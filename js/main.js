// Main JavaScript for Birthday Gift Website

document.addEventListener('DOMContentLoaded', function() {
    // Create floating hearts
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = ['❤️', '💕', '💖', '💗', '💝'][Math.floor(Math.random() * 5)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        
        const container = document.getElementById('floating-hearts');
        if (container) {
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 7000);
        }
    }

    // Start creating hearts
    setInterval(createHeart, 800);

    // Button sound effect (visual feedback)
    const buttons = document.querySelectorAll('.menu-button, .btn-a, .btn-b, .btn-select, .btn-start');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });

    // D-pad visual feedback
    const dpadButtons = document.querySelectorAll('.dpad-up, .dpad-down, .dpad-left, .dpad-right');
    dpadButtons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.boxShadow = 'inset 0 2px 0 rgba(0, 0, 0, 0.5)';
        });
        button.addEventListener('mouseup', function() {
            this.style.boxShadow = '';
        });
    });

    // Power LED animation enhancement
    const powerLed = document.querySelector('.power-led');
    if (powerLed) {
        setInterval(() => {
            powerLed.style.opacity = Math.random() * 0.3 + 0.7;
        }, 200);
    }

    console.log('🎮 HEYTML-BOY Birthday Gift loaded!');
    console.log('💝 Made with love for Afri Finda Viana');
});
