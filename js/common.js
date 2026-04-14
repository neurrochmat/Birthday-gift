// Common JavaScript for Birthday Gift Website
// Shared utilities loaded on all pages

document.addEventListener('DOMContentLoaded', function () {
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
        button.addEventListener('click', function () {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });

    // D-pad visual feedback
    const dpadButtons = document.querySelectorAll('.dpad-up, .dpad-down, .dpad-left, .dpad-right');
    dpadButtons.forEach(button => {
        button.addEventListener('mousedown', function () {
            this.style.boxShadow = 'inset 0 2px 0 rgba(0, 0, 0, 0.5)';
        });
        button.addEventListener('mouseup', function () {
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

    // ===== BACKGROUND MUSIC =====
    // Completely skip background music on the music page
    const isOnMusicPage = window.location.pathname.endsWith('music.html');
    if (!isOnMusicPage) {
        const bgMusic = new Audio('assets/music/background.mp3');
        bgMusic.loop = true;
        bgMusic.volume = 0.65;

        // Restore playback position from previous page
        const savedTime = parseFloat(sessionStorage.getItem('bgm-time') || '0');
        const isMuted = sessionStorage.getItem('bgm-muted') === 'true';
        bgMusic.currentTime = savedTime;

        // Save position periodically so navigation doesn't restart the song
        setInterval(() => {
            if (!bgMusic.paused) {
                sessionStorage.setItem('bgm-time', bgMusic.currentTime);
            }
        }, 500);

        // Save position on page unload
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('bgm-time', bgMusic.currentTime);
        });

        // Create toggle button
        const bgmToggle = document.createElement('button');
        bgmToggle.id = 'bgm-toggle';
        bgmToggle.className = 'bgm-toggle';
        bgmToggle.innerHTML = isMuted ? '🔇' : '🔊';
        bgmToggle.title = 'Toggle musik background';
        document.body.appendChild(bgmToggle);

        // Mute state
        if (isMuted) {
            bgMusic.muted = true;
            bgmToggle.classList.add('muted');
        }

        bgmToggle.addEventListener('click', () => {
            bgMusic.muted = !bgMusic.muted;
            bgmToggle.innerHTML = bgMusic.muted ? '🔇' : '🔊';
            bgmToggle.classList.toggle('muted', bgMusic.muted);
            sessionStorage.setItem('bgm-muted', bgMusic.muted);

            // If first interaction, start playing
            if (bgMusic.paused) {
                bgMusic.play().catch(() => {});
            }
        });

        // Auto-play on first user interaction (browsers require user gesture)
        function startBgMusic() {
            if (bgMusic.paused && !isMuted) {
                bgMusic.play().catch(() => {});
            }
            document.removeEventListener('click', startBgMusic);
            document.removeEventListener('touchstart', startBgMusic);
            document.removeEventListener('keydown', startBgMusic);
        }

        document.addEventListener('click', startBgMusic);
        document.addEventListener('touchstart', startBgMusic);
        document.addEventListener('keydown', startBgMusic);

        // Try auto-play immediately (works if user already interacted in session)
        if (!isMuted) {
            bgMusic.play().catch(() => {});
        }
    }
});
