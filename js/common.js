// Common JavaScript for Birthday Gift Website
// Shared utilities loaded on all pages

document.addEventListener('DOMContentLoaded', function () {
    // Create floating hearts
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = ['❤️', '💕', '💖', '💗', '💝', '🎂'][Math.floor(Math.random() * 5)];
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

        const updateMusicState = (mute) => {
            bgMusic.muted = mute;
            bgmToggle.innerHTML = mute ? '🔇' : '🔊';
            bgmToggle.classList.toggle('muted', mute);
            sessionStorage.setItem('bgm-muted', mute);
            
            if (!mute && bgMusic.paused) {
                bgMusic.play().catch(() => {});
            }
        };

        bgmToggle.addEventListener('click', () => {
            updateMusicState(!bgMusic.muted);
        });

        // Tanya izin user pada visit pertama melalui popup
        const hasPrompted = sessionStorage.getItem('bgm-prompted');
        if (!hasPrompted) {
            sessionStorage.setItem('bgm-prompted', 'true');
            
            // Tunggu sebentar untuk menampilkan modal (kasih delay buat loading screen jika ada)
            setTimeout(() => {
                const modalOverlay = document.createElement('div');
                modalOverlay.className = 'modal-overlay';
                
                const modalContent = document.createElement('div');
                modalContent.className = 'modal-content';
                modalContent.innerHTML = `
                    <h3>Putar Musik Background?</h3>
                    <p>Catatan: Kamu bisa mematikan/menyalakan musik lagi kapan saja melalui tombol volume di pojok kiri bawah layar 🔊</p>
                    <div class="modal-buttons">
                        <button class="modal-btn" id="btn-bgm-no">Tidak</button>
                        <button class="modal-btn" id="btn-bgm-yes">Ya</button>
                    </div>
                `;
                
                modalOverlay.appendChild(modalContent);
                document.body.appendChild(modalOverlay);
                
                // Trigger animasi masuk
                requestAnimationFrame(() => {
                    modalOverlay.classList.add('active');
                });
                
                const closeModal = () => {
                    modalOverlay.classList.remove('active');
                    setTimeout(() => modalOverlay.remove(), 300);
                };
                
                document.getElementById('btn-bgm-yes').addEventListener('click', () => {
                    updateMusicState(false);
                    closeModal();
                });
                
                document.getElementById('btn-bgm-no').addEventListener('click', () => {
                    updateMusicState(true);
                    closeModal();
                });
            }, window.location.pathname.endsWith('index.html') || window.location.pathname === '/' ? 1500 : 500); 
        } else {
            // Auto-play on first user interaction (browsers require user gesture)
            const startBgMusic = () => {
                if (bgMusic.paused && sessionStorage.getItem('bgm-muted') !== 'true') {
                    bgMusic.play().catch(() => {});
                }
                document.removeEventListener('click', startBgMusic);
                document.removeEventListener('touchstart', startBgMusic);
                document.removeEventListener('keydown', startBgMusic);
            };

            document.addEventListener('click', startBgMusic);
            document.addEventListener('touchstart', startBgMusic);
            document.addEventListener('keydown', startBgMusic);

            // Try auto-play immediately (works if user already interacted in session)
            if (sessionStorage.getItem('bgm-muted') !== 'true') {
                bgMusic.play().catch(() => {});
            }
        }
    }
});
