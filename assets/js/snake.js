// ================== 贪吃蛇小游戏 ==================
(function() {
    const startBtn = document.getElementById('snake-start-btn');
    const gameWrap = document.getElementById('snake-game-wrap');
    const canvas = document.getElementById('snake-canvas');
    if (!canvas || !startBtn || !gameWrap) return;
    const ctx = canvas.getContext('2d');
    const box = 20; // 单元格大小
    const canvasSize = 400;
    let snake, direction, food, score, gameOver, moveLock, intervalId;
    let gameStarted = false;
    let speed = 180; // 降低难度：移动速度变慢

    function initGame() {
        // 降低难度：初始蛇身长度为3
        snake = [
            {x: 8, y: 10},
            {x: 7, y: 10},
            {x: 6, y: 10}
        ];
        direction = 'RIGHT';
        food = randomFood();
        score = 0;
        gameOver = false;
        moveLock = false;
        draw();
        clearInterval(intervalId);
        intervalId = setInterval(move, speed);
    }

    function randomFood() {
        let pos;
        do {
            pos = {
                x: Math.floor(Math.random() * (canvasSize/box)),
                y: Math.floor(Math.random() * (canvasSize/box))
            };
        } while (snake.some(seg => seg.x === pos.x && seg.y === pos.y));
        return pos;
    }

    function draw() {
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        // 画蛇
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = i === 0 ? '#e74c3c' : '#fff';
            ctx.fillRect(snake[i].x * box, snake[i].y * box, box-2, box-2);
        }
        // 画食物
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(food.x * box, food.y * box, box-2, box-2);
        // 画分数
        ctx.fillStyle = '#fff';
        ctx.font = '18px Inter, Arial';
        ctx.fillText('分数: ' + score, 10, 24);
    }

    function move() {
        if (gameOver) return;
        let head = { ...snake[0] };
        if (direction === 'LEFT') head.x--;
        if (direction === 'RIGHT') head.x++;
        if (direction === 'UP') head.y--;
        if (direction === 'DOWN') head.y++;
        // 撞墙
        if (head.x < 0 || head.x >= canvasSize/box || head.y < 0 || head.y >= canvasSize/box) {
            endGame();
            return;
        }
        // 撞自己
        if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
            endGame();
            return;
        }
        snake.unshift(head);
        // 吃到食物
        if (head.x === food.x && head.y === food.y) {
            score++;
            food = randomFood();
        } else {
            snake.pop();
        }
        draw();
        moveLock = false;
    }

    function endGame() {
        gameOver = true;
        clearInterval(intervalId);
        ctx.fillStyle = 'rgba(34,34,34,0.85)';
        ctx.fillRect(0, canvasSize/2-40, canvasSize, 80);
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 32px Inter, Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束', canvasSize/2, canvasSize/2);
        ctx.font = '20px Inter, Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText('分数: ' + score + '  按空格重新开始', canvasSize/2, canvasSize/2+32);
        ctx.textAlign = 'left';
    }

    function restart() {
        initGame();
    }

    document.addEventListener('keydown', function(e) {
        if (!gameStarted) return;
        if (gameOver && e.code === 'Space') {
            restart();
            return;
        }
        if (moveLock) return;
        if (e.code === 'ArrowLeft' && direction !== 'RIGHT') { direction = 'LEFT'; moveLock = true; }
        if (e.code === 'ArrowUp' && direction !== 'DOWN') { direction = 'UP'; moveLock = true; }
        if (e.code === 'ArrowRight' && direction !== 'LEFT') { direction = 'RIGHT'; moveLock = true; }
        if (e.code === 'ArrowDown' && direction !== 'UP') { direction = 'DOWN'; moveLock = true; }
    });

    startBtn.addEventListener('click', function() {
        startBtn.style.display = 'none';
        gameWrap.style.display = 'flex';
        gameStarted = true;
        initGame();
    });
})();
// ================== END 贪吃蛇小游戏 ================== 