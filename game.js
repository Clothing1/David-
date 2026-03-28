const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let player = { x: 400, y: 300, width: 50, height: 50, speed: 6 };
let crackHeads = [];
let coins = [];
let score = 0;
let gameActive = false;
let gameStarted = false;

function initGame() {
    player = { x: 400, y: 300, width: 50, height: 50, speed: 6 };
    crackHeads = [];
    coins = [];
    score = 0;
    gameActive = true;
    gameStarted = true;
    
    for (let i = 0; i < 5; i++) {
        crackHeads.push({
            x: Math.random() * (canvas.width - 80) + 40,
            y: Math.random() * (canvas.height - 80) + 40,
            radius: 20,
            dx: (Math.random() - 0.5) * 3,
            dy: (Math.random() - 0.5) * 3
        });
    }
    
    for (let i = 0; i < 15; i++) {
        coins.push({
            x: Math.random() * (canvas.width - 10),
            y: Math.random() * (canvas.height - 10),
            radius: 5
        });
    }
}

const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function update() {
    if (!gameActive) return;
    
    if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
    if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
    
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
    
    crackHeads.forEach(ch => {
        ch.x += ch.dx;
        ch.y += ch.dy;
        
        if (ch.x - ch.radius < 0 || ch.x + ch.radius > canvas.width) ch.dx *= -1;
        if (ch.y - ch.radius < 0 || ch.y + ch.radius > canvas.height) ch.dy *= -1;
    });
    
    for (let i = crackHeads.length - 1; i >= 0; i--) {
        const ch = crackHeads[i];
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;
        
        const dist = Math.sqrt((playerCenterX - ch.x) ** 2 + (playerCenterY - ch.y) ** 2);
        
        if (dist < player.width / 2 + ch.radius + 10) {
            crackHeads.splice(i, 1);
            score += 10;
            document.getElementById('score').textContent = score;
            document.getElementById('enemies').textContent = crackHeads.length;
            
            if (crackHeads.length === 0) {
                gameActive = false;
                alert('You Won! Final Score: ' + score);
            }
        }
    }
}

function draw() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#4A90E2';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📋', player.x + player.width / 2, player.y + player.height / 2);
    
    crackHeads.forEach(ch => {
        ctx.fillStyle = '#FF4444';
        ctx.beginPath();
        ctx.arc(ch.x, ch.y, ch.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('😈', ch.x, ch.y);
    });
    
    coins.forEach(coin => {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('rules').style.display = 'block';
    
    let countdown = 5;
    const countdownEl = document.getElementById('countdown');
    
    const timer = setInterval(() => {
        countdown--;
        countdownEl.textContent = `Starting in ${countdown}...`;
        
        if (countdown <= 0) {
            clearInterval(timer);
            document.getElementById('rules').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'flex';
            
            if (!gameStarted) {
                initGame();
                gameLoop();
            } else {
                gameActive = true;
            }
        }
    }, 1000);
});

gameLoop();