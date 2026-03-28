const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let player = { x: 400, y: 300, width: 50, height: 50, speed: 5 };
let crackHeads = [];
let coins = [];
let score = 0;
let gameActive = true;

function initGame() {
    player = { x: 400, y: 300, width: 50, height: 50, speed: 5 };
    crackHeads = [];
    coins = [];
    score = 0;
    gameActive = true;
    
    // Create crack heads
    for (let i = 0; i < 5; i++) {
        crackHeads.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * (canvas.height - 40) + 20,
            radius: 20,
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4
        });
    }
    
    // Create coins
    for (let i = 0; i < 10; i++) {
        coins.push({
            x: Math.random() * (canvas.width - 10),
            y: Math.random() * (canvas.height - 10),
            width: 10,
            height: 10
        });
    }
}

function update() {
    if (!gameActive) return;
    
    // Move crack heads
    crackHeads.forEach(ch => {
        ch.x += ch.dx;
        ch.y += ch.dy;
        if (ch.x - ch.radius < 0 || ch.x + ch.radius > canvas.width) ch.dx *= -1;
        if (ch.y - ch.radius < 0 || ch.y + ch.radius > canvas.height) ch.dy *= -1;
    });

    // Move player
    if (keys['ArrowLeft']) player.x -= player.speed;
    if (keys['ArrowRight']) player.x += player.speed;
    if (keys['ArrowUp']) player.y -= player.speed;
    if (keys['ArrowDown']) player.y += player.speed;

    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y > canvas.height - player.height) player.y = canvas.height - player.height;

    // Check collision with crack heads
    for (let i = crackHeads.length - 1; i >= 0; i--) {
        const ch = crackHeads[i];
        const distX = (player.x + player.width / 2) - ch.x;
        const distY = (player.y + player.height / 2) - ch.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        if (distance < (player.width / 2 + ch.radius)) {
            crackHeads.splice(i, 1);
            score += 10;
        }
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#666';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Draw player (blue square - job application)
    ctx.fillStyle = '#4A90E2';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📋', player.x + player.width / 2, player.y + player.height / 2);
    
    // Draw crack heads (red circles)
    crackHeads.forEach(ch => {
        ctx.fillStyle = '#FF4444';
        ctx.beginPath();
        ctx.arc(ch.x, ch.y, ch.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // Draw coins (yellow circles)
    coins.forEach(coin => {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw score
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Score: ' + score, 10, 10);
    
    // Draw remaining enemies
    ctx.font = '16px Arial';
    ctx.fillText('Enemies: ' + crackHeads.length, 10, 40);
}

let keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('rules').style.display = 'block';
    
    setTimeout(() => {
        document.getElementById('rules').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        initGame();
        gameLoop();
    }, 5000);
});