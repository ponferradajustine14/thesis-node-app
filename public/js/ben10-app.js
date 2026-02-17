// ============================================================
// BEN 10 AUTHENTICATION APP - CLIENT-SIDE JAVASCRIPT
// Interactive Effects and Form Enhancements
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ============================================================
  // FORM VALIDATION
  // ============================================================
  
  // Login Form
  const loginForm = document.querySelector('.login-page form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      
      if (!username || !password) {
        e.preventDefault();
        showError('Please fill in all fields');
      }
    });
  }
  
  // Signup Form
  const signupForm = document.querySelector('.signup-page form');
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      // Username validation
      if (username.length < 3 || username.length > 20) {
        e.preventDefault();
        showError('Username must be 3-20 characters');
        return;
      }
      
      if (!/^[a-zA-Z0-9]+$/.test(username)) {
        e.preventDefault();
        showError('Username must be alphanumeric');
        return;
      }
      
      // Email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        e.preventDefault();
        showError('Please provide a valid email');
        return;
      }
      
      // Password validation
      if (password.length < 8) {
        e.preventDefault();
        showError('Password must be at least 8 characters');
        return;
      }
      
      if (!/[A-Z]/.test(password)) {
        e.preventDefault();
        showError('Password must contain at least one uppercase letter');
        return;
      }
      
      if (!/[0-9]/.test(password)) {
        e.preventDefault();
        showError('Password must contain at least one number');
        return;
      }
      
      // Confirm password match
      if (password !== confirmPassword) {
        e.preventDefault();
        showError('Passwords do not match');
        return;
      }
    });
  }
  
  // ============================================================
  // ERROR DISPLAY FUNCTION
  // ============================================================
  function showError(message) {
    // Remove existing error if present
    const existingError = document.querySelector('.error-burst');
    if (existingError) {
      existingError.remove();
    }
    
    // Create new error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-burst';
    errorDiv.innerHTML = `<span>⚠️ ${message}</span>`;
    
    // Insert before form
    const form = document.querySelector('form');
    if (form) {
      form.parentNode.insertBefore(errorDiv, form);
      
      // Scroll to error
      errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  // ============================================================
  // INPUT FOCUS EFFECTS
  // ============================================================
  const inputs = document.querySelectorAll('.hex-input');
  inputs.forEach(input => {
    // Add energy glow on focus
    input.addEventListener('focus', function() {
      this.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
      this.style.transform = 'scale(1)';
    });
    
    // Real-time validation feedback
    input.addEventListener('input', function() {
      if (this.value.length > 0) {
        this.style.borderColor = '#00FF41';
      } else {
        this.style.borderColor = '#8B92A8';
      }
    });
  });
  
  // ============================================================
  // BUTTON HOVER EFFECTS
  // ============================================================
  const transformBtn = document.querySelector('.transform-btn');
  if (transformBtn) {
    transformBtn.addEventListener('mouseenter', function() {
      this.style.animation = 'none';
      setTimeout(() => {
        this.style.animation = '';
      }, 10);
    });
  }
  
  // ============================================================
  // ACTION ZONE INTERACTIONS (Dashboard)
  // ============================================================
  const actionZones = document.querySelectorAll('.action-zone');
  actionZones.forEach(zone => {
    zone.addEventListener('click', function() {
      // Add pulse effect on click
      this.style.animation = 'none';
      setTimeout(() => {
        this.style.animation = '';
      }, 10);
      
      // You can add actual functionality here
      console.log('Action zone clicked:', this.querySelector('.zone-title').textContent);
    });
  });
  
  // ============================================================
  // HUB OPTION INTERACTIONS (Dashboard)
  // ============================================================
  const hubOptions = document.querySelectorAll('.hub-option:not(.logout-option)');
  hubOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      const optionName = this.querySelector('span').textContent;
      
      // Show placeholder alert
      alert(`🚀 ${optionName} feature coming soon! Stay tuned, hero!`);
    });
  });
  
  // ============================================================
  // PARTICLE EFFECTS
  // ============================================================
  function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '5px';
    particle.style.height = '5px';
    particle.style.background = '#00FF41';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.boxShadow = '0 0 10px #00FF41';
    particle.style.zIndex = '9999';
    
    document.body.appendChild(particle);
    
    // Animate particle
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 3;
    const lifetime = 1000 + Math.random() * 1000;
    
    let opacity = 1;
    let posX = x;
    let posY = y;
    
    const animate = setInterval(() => {
      posX += Math.cos(angle) * velocity;
      posY += Math.sin(angle) * velocity;
      opacity -= 0.02;
      
      particle.style.left = posX + 'px';
      particle.style.top = posY + 'px';
      particle.style.opacity = opacity;
      
      if (opacity <= 0) {
        clearInterval(animate);
        particle.remove();
      }
    }, 16);
    
    setTimeout(() => {
      particle.remove();
    }, lifetime);
  }
  
  // Add particle effect on button click
  if (transformBtn) {
    transformBtn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Create multiple particles
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          createParticle(centerX, centerY);
        }, i * 30);
      }
    });
  }
  
  // ============================================================
  // OMNITRIX DIAL ROTATION (Login Page)
  // ============================================================
  const omnitrixDial = document.querySelector('.omnitrix-dial');
  if (omnitrixDial) {
    let rotation = 0;
    
    document.addEventListener('mousemove', function(e) {
      const rect = omnitrixDial.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      // Calculate angle
      const angle = Math.atan2(deltaY, deltaX);
      rotation = angle * (180 / Math.PI);
      
      // Apply subtle rotation based on mouse position
      const rotationAmount = rotation * 0.02;
      omnitrixDial.style.transform = `rotate(${rotationAmount}deg)`;
    });
  }
  
  // ============================================================
  // ENERGY GRID ANIMATION INTENSITY
  // ============================================================
  const energyGrid = document.querySelector('.energy-grid');
  if (energyGrid) {
    // Increase intensity on mouse move
    document.addEventListener('mousemove', function() {
      energyGrid.style.opacity = '0.25';
      
      setTimeout(() => {
        energyGrid.style.opacity = energyGrid.classList.contains('active') ? '0.2' : '0.1';
      }, 100);
    });
  }
  
  // ============================================================
  // PASSWORD VISIBILITY TOGGLE
  // ============================================================
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  passwordInputs.forEach(input => {
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.textContent = '👁️';
    toggleBtn.style.cssText = `
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #8B92A8;
      cursor: pointer;
      font-size: 1.2rem;
      z-index: 10;
    `;
    
    // Wrap input in relative container
    if (!input.parentElement.style.position) {
      input.parentElement.style.position = 'relative';
    }
    
    toggleBtn.addEventListener('click', function() {
      if (input.type === 'password') {
        input.type = 'text';
        this.textContent = '🙈';
      } else {
        input.type = 'password';
        this.textContent = '👁️';
      }
    });
    
    input.parentElement.style.position = 'relative';
    input.style.paddingRight = '45px';
    input.parentElement.appendChild(toggleBtn);
  });
  
  // ============================================================
  // CONSOLE EASTER EGG
  // ============================================================
  console.log('%c🔥 IT\'S HERO TIME! 🔥', 'color: #00FF41; font-size: 24px; font-weight: bold;');
  console.log('%cBen 10 Authentication System Activated', 'color: #00F5FF; font-size: 14px;');
  console.log('%cOmnitrix Status: ONLINE ✅', 'color: #FF6B35; font-size: 12px;');
  
});
