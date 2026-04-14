// Gallery JavaScript for Birthday Gift Website
// Printing effect: photos reveal from top to bottom, one by one

document.addEventListener('DOMContentLoaded', function () {
    // Photo configuration
    const photos = [
        { src: 'assets/photos/photo1.jpg', caption: 'Senyuman Manis', position: 'center top' },
        { src: 'assets/photos/photo2.jpg', caption: 'Cantik', position: 'center 30%' },
        { src: 'assets/photos/photo3.jpg', caption: 'comell', position: 'center 20%' },
        { src: 'assets/photos/photo4.jpg', caption: 'Gaya Keren', position: 'center 25%' },
        { src: 'assets/photos/photo5.jpg', caption: 'Cisss', position: 'center 25%' },
        { src: 'assets/photos/photo6.jpg', caption: 'Keren', position: 'center 20%' },
        { src: 'assets/photos/photo7.jpg', caption: 'Gemesin', position: 'center 15%' },
        { src: 'assets/photos/photo8.jpg', caption: 'Ganteng', position: 'center 20%' },
        { src: 'assets/photos/photo9.jpg', caption: 'Hehe😅', position: 'center 20%' },
    ];

    const photoStrip = document.getElementById('photo-strip');

    // Date stamp
    function getDateStamp() {
        const d = new Date();
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yy = String(d.getFullYear()).slice(-2);
        return `${dd}/${mm}/${yy}`;
    }

    // Create a single polaroid card element (hidden initially)
    function createCard(photo, index, dateStamp) {
        const card = document.createElement('div');
        card.className = 'polaroid-card printing';
        card.innerHTML = `
            <button class="delete-photo-btn" title="Hapus foto ini">✕</button>
            <div class="polaroid-frame">
                <div class="polaroid-image-wrap">
                    <img src="${photo.src}" 
                         alt="${photo.caption}" 
                         style="object-position: ${photo.position || 'center center'}"
                         loading="lazy">
                    <span class="polaroid-number">#${index + 1}</span>
                </div>
                <div class="polaroid-caption">${photo.caption}</div>
            </div>
            <div class="polaroid-footer">
                <div class="polaroid-date">
                    <span class="date-dot">●</span>
                    <span>${dateStamp}</span>
                    <span class="date-dot">●</span>
                </div>
                <button class="change-photo-btn" title="Ganti foto ini">
                    <span class="change-photo-icon">🔄</span>
                    <span class="change-photo-text">Ganti Foto</span>
                </button>
                <input type="file" class="change-photo-input" accept="image/*" style="display:none">
            </div>
        `;

        // Wire up the delete button
        const deleteBtn = card.querySelector('.delete-photo-btn');
        deleteBtn.addEventListener('click', () => {
            // Revoke blob URL if any
            const img = card.querySelector('.polaroid-image-wrap img');
            if (img._blobUrl) URL.revokeObjectURL(img._blobUrl);

            // Collapse animation then remove
            card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = 'scale(0.8)';
            card.style.opacity = '0';
            card.style.maxHeight = card.offsetHeight + 'px';
            card.offsetHeight; // force reflow
            card.style.maxHeight = '0';
            card.style.marginTop = '0';
            card.style.marginBottom = '0';
            card.style.padding = '0';
            card.style.overflow = 'hidden';

            setTimeout(() => card.remove(), 450);
        });

        // Wire up the change photo button
        const btn = card.querySelector('.change-photo-btn');
        const fileInput = card.querySelector('.change-photo-input');
        const imgEl = card.querySelector('.polaroid-image-wrap img');

        btn.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Revoke previous blob URL if any
            if (imgEl._blobUrl) URL.revokeObjectURL(imgEl._blobUrl);

            const url = URL.createObjectURL(file);
            imgEl._blobUrl = url;
            imgEl.src = url;
            imgEl.style.objectPosition = 'center center';
            imgEl.alt = file.name;

            // Brief flash animation on the card
            card.classList.add('photo-swapped');
            setTimeout(() => card.classList.remove('photo-swapped'), 600);
        });

        return card;
    }

    // Progress indicator element
    function createProgressEl() {
        const el = document.createElement('div');
        el.className = 'print-progress';
        el.id = 'print-progress';
        return el;
    }

    // Animate one card: reveal from top using clip-path
    function animateCard(card, duration) {
        return new Promise(resolve => {
            card.classList.add('printing');
            // Force layout
            card.offsetHeight;

            let start = null;
            function step(timestamp) {
                if (!start) start = timestamp;
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);

                // Reveal from top to bottom
                card.style.clipPath = `inset(0 0 ${(1 - progress) * 100}% 0)`;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    card.style.clipPath = 'none';
                    card.classList.remove('printing');
                    card.classList.add('printed');
                    // Show the change-photo & delete buttons with animation
                    const changeBtn = card.querySelector('.change-photo-btn');
                    if (changeBtn) changeBtn.classList.add('visible');
                    const delBtn = card.querySelector('.delete-photo-btn');
                    if (delBtn) delBtn.classList.add('visible');
                    resolve();
                }
            }
            requestAnimationFrame(step);
        });
    }

    // Main: print photos one by one
    async function startPrinting() {
        if (photos.length === 0) {
            photoStrip.innerHTML = `
                <div class="no-photo-message">
                    <span class="camera-icon">📷</span>
                    <p>Tambahkan foto ke folder:</p>
                    <code>assets/photos/</code>
                </div>`;
            return;
        }

        const dateStamp = getDateStamp();
        const progressEl = createProgressEl();
        photoStrip.appendChild(progressEl);

        const PRINT_DURATION = 1800; // ms per photo reveal
        const PAUSE_BETWEEN = 400;  // ms pause between photos

        for (let i = 0; i < photos.length; i++) {
            // Update progress text
            progressEl.textContent = `Mencetak foto ${i + 1} dari ${photos.length}...`;

            // Create card and add to strip
            const card = createCard(photos[i], i, dateStamp);
            photoStrip.insertBefore(card, progressEl);

            // Scroll to keep the new card visible
            card.scrollIntoView({ behavior: 'smooth', block: 'end' });

            // Animate the reveal
            await animateCard(card, PRINT_DURATION);

            // Small pause before next
            if (i < photos.length - 1) {
                await new Promise(r => setTimeout(r, PAUSE_BETWEEN));
            }
        }

        // Done printing
        progressEl.textContent = `✅ ${photos.length} foto berhasil dicetak!`;
        progressEl.classList.add('done');

        // Fade out progress after a moment
        setTimeout(() => {
            progressEl.style.opacity = '0';
            setTimeout(() => progressEl.remove(), 500);
        }, 2000);
    }

    startPrinting();
    console.log('📸 Gallery printing', photos.length, 'photos');
});
