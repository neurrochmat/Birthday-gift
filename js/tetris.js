// Tetris Game JavaScript for Birthday Gift Website

document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('tetris-board');
    const ctx = canvas.getContext('2d');
    const nextCanvas = document.getElementById('next-piece');
    const nextCtx = nextCanvas.getContext('2d');

    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 20;

    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    const linesElement = document.getElementById('lines');
    const gameOverlay = document.getElementById('game-overlay');
    const overlayTitle = document.getElementById('overlay-title');
    const overlayMessage = document.getElementById('overlay-message');
    const btnStartGame = document.getElementById('btn-start-game');
    const btnRotate = document.getElementById('btn-rotate');

    // Colors for pieces (Game Boy style)
    const COLORS = {
        I: '#0f380f',
        O: '#306230',
        T: '#0f380f',
        S: '#306230',
        Z: '#0f380f',
        J: '#306230',
        L: '#0f380f',
        empty: '#9bbc0f',
        ghost: '#8bac0f'
    };

    // Tetromino shapes
    const SHAPES = {
        I: [[1, 1, 1, 1]],
        O: [[1, 1], [1, 1]],
        T: [[0, 1, 0], [1, 1, 1]],
        S: [[0, 1, 1], [1, 1, 0]],
        Z: [[1, 1, 0], [0, 1, 1]],
        J: [[1, 0, 0], [1, 1, 1]],
        L: [[0, 0, 1], [1, 1, 1]]
    };

    let board = [];
    let currentPiece = null;
    let nextPiece = null;
    let score = 0;
    let level = 1;
    let lines = 0;
    let gameRunning = false;
    let gameInterval = null;
    let dropSpeed = 1000;

    // Initialize board
    function initBoard() {
        board = [];
        for (let row = 0; row < ROWS; row++) {
            board[row] = [];
            for (let col = 0; col < COLS; col++) {
                board[row][col] = null;
            }
        }
    }

    // Create new piece
    function createPiece(type) {
        const shape = SHAPES[type];
        return {
            type: type,
            shape: shape,
            x: Math.floor((COLS - shape[0].length) / 2),
            y: 0
        };
    }

    // Get random piece type
    function getRandomType() {
        const types = Object.keys(SHAPES);
        return types[Math.floor(Math.random() * types.length)];
    }

    // Rotate piece
    function rotatePiece(piece) {
        const rotated = [];
        for (let col = 0; col < piece.shape[0].length; col++) {
            rotated[col] = [];
            for (let row = piece.shape.length - 1; row >= 0; row--) {
                rotated[col].push(piece.shape[row][col]);
            }
        }
        return rotated;
    }

    // Check collision
    function checkCollision(piece, offsetX = 0, offsetY = 0, newShape = null) {
        const shape = newShape || piece.shape;
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = piece.x + col + offsetX;
                    const newY = piece.y + row + offsetY;

                    if (newX < 0 || newX >= COLS || newY >= ROWS) {
                        return true;
                    }

                    if (newY >= 0 && board[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Lock piece to board
    function lockPiece() {
        for (let row = 0; row < currentPiece.shape.length; row++) {
            for (let col = 0; col < currentPiece.shape[row].length; col++) {
                if (currentPiece.shape[row][col]) {
                    const boardY = currentPiece.y + row;
                    const boardX = currentPiece.x + col;

                    if (boardY < 0) {
                        gameOver();
                        return;
                    }

                    board[boardY][boardX] = currentPiece.type;
                }
            }
        }

        clearLines();
        spawnPiece();
    }

    // Clear completed lines
    function clearLines() {
        let linesCleared = 0;

        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row].every(cell => cell !== null)) {
                board.splice(row, 1);
                board.unshift(Array(COLS).fill(null));
                linesCleared++;
                row++;
            }
        }

        if (linesCleared > 0) {
            lines += linesCleared;
            score += linesCleared * linesCleared * 100 * level;
            level = Math.floor(lines / 10) + 1;
            dropSpeed = Math.max(100, 1000 - (level - 1) * 100);

            updateScore();
            restartInterval();
        }
    }

    // Update score display
    function updateScore() {
        scoreElement.textContent = score;
        levelElement.textContent = level;
        linesElement.textContent = lines;
    }

    // Spawn new piece
    function spawnPiece() {
        currentPiece = nextPiece || createPiece(getRandomType());
        nextPiece = createPiece(getRandomType());

        if (checkCollision(currentPiece)) {
            gameOver();
        }

        drawNextPiece();
    }

    // Draw board
    function drawBoard() {
        ctx.fillStyle = COLORS.empty;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = '#8bac0f';
        ctx.lineWidth = 0.5;
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }

        // Draw locked pieces
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (board[row][col]) {
                    drawBlock(ctx, col, row, COLORS[board[row][col]]);
                }
            }
        }

        // Draw current piece
        if (currentPiece) {
            for (let row = 0; row < currentPiece.shape.length; row++) {
                for (let col = 0; col < currentPiece.shape[row].length; col++) {
                    if (currentPiece.shape[row][col]) {
                        drawBlock(ctx, currentPiece.x + col, currentPiece.y + row, COLORS[currentPiece.type]);
                    }
                }
            }
        }
    }

    // Draw single block
    function drawBlock(context, x, y, color) {
        context.fillStyle = color;
        context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

        // 3D effect
        context.fillStyle = 'rgba(255, 255, 255, 0.3)';
        context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, 2);
        context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, 2, BLOCK_SIZE);

        context.fillStyle = 'rgba(0, 0, 0, 0.3)';
        context.fillRect(x * BLOCK_SIZE, (y + 1) * BLOCK_SIZE - 2, BLOCK_SIZE, 2);
        context.fillRect((x + 1) * BLOCK_SIZE - 2, y * BLOCK_SIZE, 2, BLOCK_SIZE);
    }

    // Draw next piece preview
    function drawNextPiece() {
        nextCtx.fillStyle = COLORS.empty;
        nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

        if (nextPiece) {
            const offsetX = (nextCanvas.width - nextPiece.shape[0].length * BLOCK_SIZE) / 2;
            const offsetY = (nextCanvas.height - nextPiece.shape.length * BLOCK_SIZE) / 2;

            for (let row = 0; row < nextPiece.shape.length; row++) {
                for (let col = 0; col < nextPiece.shape[row].length; col++) {
                    if (nextPiece.shape[row][col]) {
                        const x = offsetX + col * BLOCK_SIZE;
                        const y = offsetY + row * BLOCK_SIZE;

                        nextCtx.fillStyle = COLORS[nextPiece.type];
                        nextCtx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);

                        // 3D effect
                        nextCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                        nextCtx.fillRect(x, y, BLOCK_SIZE, 2);
                        nextCtx.fillRect(x, y, 2, BLOCK_SIZE);
                    }
                }
            }
        }
    }

    // Move piece
    function movePiece(dir) {
        if (!gameRunning || !currentPiece) return;

        if (!checkCollision(currentPiece, dir, 0)) {
            currentPiece.x += dir;
            drawBoard();
        }
    }

    // Drop piece
    function dropPiece() {
        if (!gameRunning || !currentPiece) return;

        if (!checkCollision(currentPiece, 0, 1)) {
            currentPiece.y++;
        } else {
            lockPiece();
        }
        drawBoard();
    }

    // Hard drop
    function hardDrop() {
        if (!gameRunning || !currentPiece) return;

        while (!checkCollision(currentPiece, 0, 1)) {
            currentPiece.y++;
            score += 2;
        }
        lockPiece();
        updateScore();
        drawBoard();
    }

    // Rotate
    function rotate() {
        if (!gameRunning || !currentPiece) return;

        const rotated = rotatePiece(currentPiece);

        if (!checkCollision(currentPiece, 0, 0, rotated)) {
            currentPiece.shape = rotated;
            drawBoard();
        }
    }

    // Game over
    function gameOver() {
        gameRunning = false;
        clearInterval(gameInterval);

        overlayTitle.textContent = 'GAME OVER';
        overlayMessage.textContent = `Score: ${score}`;
        gameOverlay.classList.remove('hidden');
    }

    // Start game
    function startGame() {
        initBoard();
        score = 0;
        level = 1;
        lines = 0;
        dropSpeed = 1000;
        updateScore();

        gameOverlay.classList.add('hidden');
        gameRunning = true;

        spawnPiece();
        drawBoard();
        restartInterval();
    }

    // Restart interval
    function restartInterval() {
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(dropPiece, dropSpeed);
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!gameRunning) {
            if (e.key === 'Enter' || e.code === 'Space') {
                startGame();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowLeft':
                movePiece(-1);
                break;
            case 'ArrowRight':
                movePiece(1);
                break;
            case 'ArrowDown':
                dropPiece();
                score++;
                updateScore();
                break;
            case 'ArrowUp':
                rotate();
                break;
            case ' ':
                hardDrop();
                break;
        }
    });

    // Touch/click controls for D-pad
    document.getElementById('dpad-left')?.addEventListener('click', () => movePiece(-1));
    document.getElementById('dpad-right')?.addEventListener('click', () => movePiece(1));
    document.getElementById('dpad-down')?.addEventListener('click', () => {
        dropPiece();
        score++;
        updateScore();
    });
    document.getElementById('dpad-up')?.addEventListener('click', rotate);

    // Button controls
    btnStartGame.addEventListener('click', startGame);
    btnRotate.addEventListener('click', rotate);

    // Initial draw
    initBoard();
    drawBoard();

    console.log('🎮 Tetris loaded!');
    console.log('Controls: Arrow keys to move, Up to rotate, Space for hard drop');
});
