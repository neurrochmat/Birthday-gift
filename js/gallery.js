// Gallery JavaScript for Birthday Gift Website

document.addEventListener('DOMContentLoaded', function () {
    // Photo configuration - Add your photos here!
    // Format: { src: 'assets/photos/filename.jpg', caption: 'Description' }
    const photos = [
        // Example photos - replace with your actual photos
        // { src: 'assets/photos/photo1.jpg', caption: 'Our first date' },
        // { src: 'assets/photos/photo2.jpg', caption: 'Birthday celebration' },
        // { src: 'assets/photos/photo3.jpg', caption: 'Special moment' },
    ];

    let currentPhotoIndex = 0;
    const photoDisplay = document.getElementById('photo-display');
    const currentPhoto = document.getElementById('current-photo');
    const photoIndex = document.getElementById('photo-index');
    const photoTotal = document.getElementById('photo-total');
    const btnPrev = document.getElementById('btn-prev-photo');
    const btnNext = document.getElementById('btn-next-photo');
    const btnPrint = document.getElementById('btn-print');
    const btnNextA = document.getElementById('btn-next-a');

    // Initialize gallery
    function initGallery() {
        if (photos.length > 0) {
            photoTotal.textContent = photos.length;
            showPhoto(0);
        } else {
            photoIndex.textContent = '0';
            photoTotal.textContent = '0';
        }
    }

    // Show specific photo
    function showPhoto(index) {
        if (photos.length === 0) return;

        currentPhotoIndex = index;

        // Hide no-photo message
        const noPhotoMsg = document.querySelector('.no-photo-message');
        if (noPhotoMsg) noPhotoMsg.style.display = 'none';

        // Show photo
        currentPhoto.src = photos[index].src;
        currentPhoto.alt = photos[index].caption || 'Memory';
        currentPhoto.classList.remove('hidden');

        // Update counter
        photoIndex.textContent = index + 1;

        // Update button states
        btnPrev.disabled = index === 0;
        btnNext.disabled = index === photos.length - 1;
    }

    // Navigation
    btnPrev.addEventListener('click', () => {
        if (currentPhotoIndex > 0) {
            showPhoto(currentPhotoIndex - 1);
        }
    });

    btnNext.addEventListener('click', () => {
        if (currentPhotoIndex < photos.length - 1) {
            showPhoto(currentPhotoIndex + 1);
        }
    });

    // A button for next
    if (btnNextA) {
        btnNextA.addEventListener('click', () => {
            if (photos.length > 0 && currentPhotoIndex < photos.length - 1) {
                showPhoto(currentPhotoIndex + 1);
            }
        });
    }

    // Print button effect
    btnPrint.addEventListener('click', () => {
        if (photos.length === 0) {
            alert('📷 Tambahkan foto ke folder assets/photos/ terlebih dahulu!');
            return;
        }

        // Animate print effect
        const frame = document.querySelector('.photobox-frame');
        frame.style.animation = 'shake 0.5s ease-in-out';

        setTimeout(() => {
            frame.style.animation = '';
            // Show next photo
            if (currentPhotoIndex < photos.length - 1) {
                showPhoto(currentPhotoIndex + 1);
            } else {
                showPhoto(0);
            }
        }, 500);
    });

    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

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

    setInterval(createHeart, 800);

    // Initialize
    initGallery();

    console.log('📸 Gallery loaded!');
    console.log('💡 To add photos, edit the "photos" array in js/gallery.js');
});
