// Music Player JavaScript for Birthday Gift Website

document.addEventListener('DOMContentLoaded', function () {
    // Playlist configuration - Add your songs here!
    // Format: { title: 'Song Title', artist: 'Artist Name', src: 'assets/music/filename.mp3' }
    const playlist = [
        { title: 'On Bended Knee', artist: 'Boyz II Men', src: 'assets/music/song1.mp3' },
        { title: 'I Do It For You', artist: 'Bryan Adams', src: 'assets/music/song2.mp3' },
        { title: 'Just the Two of Us', artist: 'Grover Washington Jr.', src: 'assets/music/song3.mp3' },
        { title: "Nothing's Gonna Change", artist: 'George Benson', src: 'assets/music/song4.mp3' },
        { title: 'How Deep Is Your Love', artist: 'Bee Gees', src: 'assets/music/song5.mp3' },
    ];

    let currentSongIndex = 0;
    let isPlaying = false;

    const audioPlayer = document.getElementById('audio-player');
    const vinylRecord = document.getElementById('vinyl-record');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const progressFill = document.getElementById('progress-fill');
    const currentTime = document.getElementById('current-time');
    const totalTime = document.getElementById('total-time');
    const btnPlay = document.getElementById('btn-play');
    const btnPrevSong = document.getElementById('btn-prev-song');
    const btnNextSong = document.getElementById('btn-next-song');
    const btnPlayA = document.getElementById('btn-play-a');
    const playlistItems = document.getElementById('playlist-items');

    // Initialize playlist UI
    function initPlaylist() {
        playlistItems.innerHTML = '';
        playlist.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item' + (index === currentSongIndex ? ' active' : '');
            item.innerHTML = `
                <span class="song-number">${index + 1}.</span>
                <span class="song-name">${song.title}</span>
            `;
            item.addEventListener('click', () => playSong(index));
            playlistItems.appendChild(item);
        });
    }

    // Load song
    function loadSong(index) {
        const song = playlist[index];
        currentSongIndex = index;

        audioPlayer.src = song.src;
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;

        // Update playlist UI
        document.querySelectorAll('.playlist-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    // Play song
    function playSong(index) {
        loadSong(index);
        audioPlayer.play().catch(err => {
            console.log('Audio play error:', err);
            // Show message if audio file not found
            songArtist.textContent = '(Tambahkan file musik)';
        });
        isPlaying = true;
        updatePlayButton();
        vinylRecord.classList.add('spinning');
    }

    // Toggle play/pause
    function togglePlay() {
        if (isPlaying) {
            audioPlayer.pause();
            vinylRecord.classList.remove('spinning');
        } else {
            audioPlayer.play().catch(err => {
                console.log('Audio play error:', err);
            });
            vinylRecord.classList.add('spinning');
        }
        isPlaying = !isPlaying;
        updatePlayButton();
    }

    // Update play button
    function updatePlayButton() {
        btnPlay.textContent = isPlaying ? '⏸' : '▶';
    }

    // Format time
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Update progress
    function updateProgress() {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = `${progress}%`;
        currentTime.textContent = formatTime(audioPlayer.currentTime);
        totalTime.textContent = formatTime(audioPlayer.duration);
    }

    // Event listeners
    btnPlay.addEventListener('click', togglePlay);

    if (btnPlayA) {
        btnPlayA.addEventListener('click', togglePlay);
    }

    btnPrevSong.addEventListener('click', () => {
        let newIndex = currentSongIndex - 1;
        if (newIndex < 0) newIndex = playlist.length - 1;
        playSong(newIndex);
    });

    btnNextSong.addEventListener('click', () => {
        let newIndex = currentSongIndex + 1;
        if (newIndex >= playlist.length) newIndex = 0;
        playSong(newIndex);
    });

    audioPlayer.addEventListener('timeupdate', updateProgress);

    audioPlayer.addEventListener('ended', () => {
        let newIndex = currentSongIndex + 1;
        if (newIndex >= playlist.length) newIndex = 0;
        playSong(newIndex);
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTime.textContent = formatTime(audioPlayer.duration);
    });

    // Progress bar click to seek
    document.querySelector('.progress-bar').addEventListener('click', (e) => {
        const rect = e.target.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioPlayer.currentTime = percent * audioPlayer.duration;
    });

    // Create floating hearts
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = ['❤️', '💕', '💖', '🎵', '🎶'][Math.floor(Math.random() * 5)];
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
    initPlaylist();
    loadSong(0);

    console.log('🎵 Music player loaded!');
    console.log('💡 To add music, place MP3 files in assets/music/ folder');
    console.log('💡 Then update the playlist array in js/music.js');
});
