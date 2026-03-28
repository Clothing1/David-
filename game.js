const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let player = { x: 400, y: 300, width: 50, height: 50, speed: 5 };
let crackHeads = [];
let coins = [];
let score = 0;

function initGame() {
    // Create crack heads
    for (let i = 0; i < 5; i++) {
        crackHeads.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 20,
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4
        });
    }
    // Create coins
    for (let i = 0; i < 10; i++) {
        coins.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            width: 10,
            height: 10
        });
    }
}

function update() {
    // Move crack heads
    crackHeads.forEach(ch => {
        ch.x += ch.dx;
        ch.y += ch.dy;
        if (ch.x < 0 || ch.x > canvas.width) ch.dx *= -1;
        if (ch.y < 0 || ch.y > canvas.height) ch.dy *= -1;
        // Check collision with coins
        coins.forEach((coin, index) => {
            if (Math.abs(ch.x - coin.x) < ch.radius && Math.abs(ch.y - coin.y) < ch.radius) {
                coins.splice(index, 1);
                // Maybe speed up or something
            }
        });
    });

    // Move player
    if (keys.ArrowLeft) player.x -= player.speed;
    if (keys.ArrowRight) player.x += player.speed;
    if (keys.ArrowUp) player.y -= player.speed;
    if (keys.ArrowDown) player.y += player.speed;

    // Check collision with crack heads
    crackHeads.forEach((ch, index) => {
        if (Math.abs(player.x - ch.x) < player.width / 2 + ch.radius &&
            Math.abs(player.y - ch.y) < player.height / 2 + ch.radius) {
            crackHeads.splice(index, 1);
            score += 10;
        }
    });

    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y > canvas.height - player.height) player.y = canvas.height - player.height;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    // Draw crack heads
    ctx.fillStyle = 'red';
    crackHeads.forEach(ch => {
        ctx.beginPath();
        ctx.arc(ch.x, ch.y, ch.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    // Draw coins
    ctx.fillStyle = 'yellow';
    coins.forEach(coin => {
        ctx.fillRect(coin.x, coin.y, coin.width, coin.height);
    });
    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

let keys = {};
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('music').play();
    document.getElementById('landing').style.display = 'none';
    document.getElementById('rules').style.display = 'block';
    setTimeout(() => {
        document.getElementById('rules').style.display = 'none';
        document.getElementById('gameCanvas').style.display = 'block';
        initGame();
        gameLoop();
    }, 10000);
});