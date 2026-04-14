// Message JavaScript for Birthday Gift Website

document.addEventListener('DOMContentLoaded', function () {
    // Message content
    const messages = [
        `Happy 21st Birthday, Viaaa! 🎂✨\n\nOn this special day, I want to say how grateful I am to have met someone as wonderful as you in my life.\n\nYou are the reason behind my smile ...`,

        `Every moment with you is the most beautiful gift I've ever received. Your laughter is my favorite melody, and your smile is the most beautiful sight I always want to see.\n\nThank you for being a part of my life... 💕`,

        `On your birthday, I pray that all your dreams come true. May happiness always be with you, may good health always protect you, and may success always come your way.\n\nMay you shine even brighter in this new year! ⭐`,

        `Thank you for all the beautiful moments we’ve shared. I hope that moving forward, your life is always filled with happiness and good things.\n\nHappy birthday and take care of yourself 😊. I always love you! \n\nWith love,\nNeurrochmat 💖`
    ];

    let currentPage = 1;
    const totalPages = messages.length;
    let isTyping = false;
    let typeTimeout = null;

    const btnNext = document.getElementById('btn-next');
    const btnNextA = document.getElementById('btn-next-a');

    // Convert text with newlines to HTML
    function textToHtml(text) {
        return text.replace(/\n/g, '<br>');
    }

    // Typing effect
    function typeMessage(elementId, text, speed = 30) {
        const element = document.getElementById(elementId);
        element.innerHTML = '';
        let i = 0;
        isTyping = true;
        updateNextButton();

        function type() {
            if (i < text.length) {
                if (text.charAt(i) === '\n') {
                    element.innerHTML += '<br>';
                } else {
                    element.innerHTML += text.charAt(i);
                }
                i++;
                typeTimeout = setTimeout(type, speed);
            } else {
                // Typing finished
                isTyping = false;
                updateNextButton();
            }
        }
        type();
    }

    // Skip typing animation — show full text immediately
    function skipTyping() {
        if (!isTyping) return;
        clearTimeout(typeTimeout);
        const element = document.getElementById(`message-${currentPage}`);
        element.innerHTML = textToHtml(messages[currentPage - 1]);
        isTyping = false;
        updateNextButton();
    }

    // Update next button text based on typing state
    function updateNextButton() {
        if (isTyping) {
            btnNext.textContent = 'SKIP ⏩';
        } else if (currentPage === totalPages) {
            btnNext.textContent = 'GALLERY ▶';
        } else {
            btnNext.textContent = 'SELANJUTNYA ▶';
        }
    }

    // Show page
    function showPage(pageNum) {
        document.querySelectorAll('.message-page').forEach(page => {
            page.classList.remove('active');
        });

        const targetPage = document.querySelector(`[data-page="${pageNum}"]`);
        targetPage.classList.add('active');

        typeMessage(`message-${pageNum}`, messages[pageNum - 1]);

        document.getElementById('current-page').textContent = pageNum;
        document.getElementById('btn-prev').disabled = pageNum === 1;
        document.getElementById('btn-next').disabled = false;
    }

    // Handle next button: skip if typing, navigate if done
    function handleNext() {
        if (isTyping) {
            skipTyping();
        } else if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
        } else {
            window.location.href = 'gallery.html';
        }
    }

    // Navigation
    btnNext.addEventListener('click', handleNext);

    document.getElementById('btn-prev').addEventListener('click', () => {
        if (isTyping) {
            clearTimeout(typeTimeout);
            isTyping = false;
        }
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
        }
    });

    if (btnNextA) {
        btnNextA.addEventListener('click', handleNext);
    }

    // Initialize
    showPage(1);

    console.log('💌 Message page loaded!');
});
