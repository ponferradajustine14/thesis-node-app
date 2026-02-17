const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const path = require('path');

const app = express();
const PORT = 3000;

// ============================================================
// DATABASE SETUP
// ============================================================
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('✅ Connected to SQLite database');
    // Create users table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('✅ Users table ready');
      }
    });
  }
});

// ============================================================
// MIDDLEWARE CONFIGURATION
// ============================================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: 'ben10-omnitrix-secret-key-transform',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 3600000, // 1 hour
    httpOnly: true
  }
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login');
};

const redirectIfAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }
  next();
};

// ============================================================
// ROUTES
// ============================================================

// Home - redirect to dashboard or login
app.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// LOGIN ROUTES
app.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', 
  redirectIfAuthenticated,
  [
    body('username').trim().notEmpty().withMessage('Username or email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('login', { error: errors.array()[0].msg });
    }

    const { username, password } = req.body;

    // Find user by username or email
    db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username],
      async (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.render('login', { error: 'An error occurred. Please try again.' });
        }

        if (!user) {
          return res.render('login', { error: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.render('login', { error: 'Invalid credentials' });
        }

        // Create session
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.email = user.email;

        res.redirect('/dashboard');
      }
    );
  }
);

// SIGNUP ROUTES
app.get('/signup', redirectIfAuthenticated, (req, res) => {
  res.render('signup', { error: null, formData: {} });
});

app.post('/signup',
  redirectIfAuthenticated,
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be 3-20 characters')
      .isAlphanumeric()
      .withMessage('Username must be alphanumeric'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number'),
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('signup', { 
        error: errors.array()[0].msg,
        formData: req.body
      });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email],
      async (err, existingUser) => {
        if (err) {
          console.error('Database error:', err);
          return res.render('signup', { 
            error: 'An error occurred. Please try again.',
            formData: req.body
          });
        }

        if (existingUser) {
          const errorMsg = existingUser.username === username 
            ? 'Username already taken' 
            : 'Email already registered';
          return res.render('signup', { 
            error: errorMsg,
            formData: req.body
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        db.run(
          'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
          [username, email, hashedPassword],
          function(err) {
            if (err) {
              console.error('Insert error:', err);
              return res.render('signup', { 
                error: 'Failed to create account. Please try again.',
                formData: req.body
              });
            }

            // Auto-login after signup
            req.session.userId = this.lastID;
            req.session.username = username;
            req.session.email = email;

            res.redirect('/dashboard');
          }
        );
      }
    );
  }
);

// DASHBOARD ROUTE (Protected)
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', {
    username: req.session.username,
    email: req.session.email
  });
});

// LOGOUT ROUTE
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/login');
  });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 Ben 10 Server running on http://localhost:${PORT}`);
  console.log(`🔥 It's Hero Time!`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
