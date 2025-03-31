const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load images
const templeBg = new Image();
templeBg.src = "Tombofmask.png";  

const charls = new Image();
charls.src = "Main Character Normal.png";  

const enemy1 = new Image();
enemy1.src = "enemy.png";  

const enemy2 = new Image();
enemy2.src = "AbyssNormal.png";  

const boss = new Image();
boss.src = "Abys king.png";  

const healthBar = new Image();
healthBar.src = "heart 1.webp"; // Ensure "heart.png" is in the same directory

// Load heart image
const heartImg = new Image();
heartImg.src = "heart 1.webp"; // Ensure "heart.png" is in the same directory

// Background Music
let bgMusic = document.getElementById("bg-music");
bgMusic.volume = 0.5;

// Character Stats
let charlsHP = 100;
let bossHitsRemaining = 1; // Boss requires 10 hits to be defeated

let playerAlive = true;

// Enemy attack properties
let enemyMagicCooldown = false;
let enemyMeleeCooldown = false;

// Movement & Combat System
let charlsX = canvas.width * 0.2, charlsY = canvas.height * 0.6;
let speed = 5;
let moveUp = false, moveDown = false, moveLeft = false, moveRight = false;
let bossX = canvas.width * 0.5, bossY = canvas.height * 0.4;
let isAttacking = false;
let isCastingMagic = false;

let gameStarted = false;

// Sword and projectile properties
let swordActive = false;
let projectiles = [];

// Add a start screen
function showStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "20px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText("Press ENTER to Start", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText("Arrow Keys: Move", canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText("1: Sword Attack", canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText("2: Magic Attack", canvas.width / 2, canvas.height / 2 + 80);
}

// Start game on ENTER key press
document.addEventListener("keydown", function (event) {
    if (!gameStarted && event.key === "Enter") {
        gameStarted = true;

        // Play background music after user interaction
        bgMusic.play().catch(error => {
            console.error("Background music failed to play:", error);
        });

        drawScene();
        updateMovement();
        moveEnemies();
    }
});

// Fix movement and skills
document.addEventListener("keydown", function (event) {
    if (gameStarted) {
        if (event.key === "ArrowUp") moveUp = true;
        if (event.key === "ArrowDown") moveDown = true;
        if (event.key === "ArrowLeft") moveLeft = true;
        if (event.key === "ArrowRight") moveRight = true;
        if (event.key === "1") attackEnemy(); // Sword attack with key '1'
        if (event.key === "2") castMagic();  // Magic attack with key '2'
    }
});

document.addEventListener("keyup", function (event) {
    if (gameStarted) {
        if (event.key === "ArrowUp") moveUp = false;
        if (event.key === "ArrowDown") moveDown = false;
        if (event.key === "ArrowLeft") moveLeft = false;
        if (event.key === "ArrowRight") moveRight = false;
    }
});

// Mobile Controls
document.getElementById("up").addEventListener("touchstart", () => moveUp = true);
document.getElementById("down").addEventListener("touchstart", () => moveDown = true);
document.getElementById("left").addEventListener("touchstart", () => moveLeft = true);
document.getElementById("right").addEventListener("touchstart", () => moveRight = true);
document.getElementById("attack").addEventListener("touchstart", attackEnemy);
document.getElementById("magic").addEventListener("touchstart", castMagic);

// Adjust canvas size dynamically for mobile
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Initial resize

// Mobile Controls (Touch Events)
document.getElementById("up").addEventListener("touchstart", () => moveUp = true);
document.getElementById("up").addEventListener("touchend", () => moveUp = false);

document.getElementById("down").addEventListener("touchstart", () => moveDown = true);
document.getElementById("down").addEventListener("touchend", () => moveDown = false);

document.getElementById("left").addEventListener("touchstart", () => moveLeft = true);
document.getElementById("left").addEventListener("touchend", () => moveLeft = false);

document.getElementById("right").addEventListener("touchstart", () => moveRight = true);
document.getElementById("right").addEventListener("touchend", () => moveRight = false);

document.getElementById("attack").addEventListener("touchstart", attackEnemy);
document.getElementById("magic").addEventListener("touchstart", castMagic);

// Sword animation and shield logic
function attackEnemy() {
    if (!isAttacking) {
        isAttacking = true;
        swordActive = true;

        // Activate shield effect
        console.log("Shield activated!");
        setTimeout(() => {
            swordActive = false; // Deactivate shield after 3 seconds
            console.log("Shield deactivated!");
            isAttacking = false;
        }, 3000);
    }
}

// Magic attack with projectile
function castMagic() {
    if (!isCastingMagic) {
        isCastingMagic = true;

        // Create a new projectile (blue ball)
        projectiles.push({
            x: charlsX + 50, // Start near Charles
            y: charlsY + 50,
            speed: 10, // Move to the right
            radius: 10, // Size of the blue ball
        });

        console.log("Magic ball created at:", charlsX + 50, charlsY + 50); // Debugging log

        // Deactivate casting after cooldown
        setTimeout(() => isCastingMagic = false, 1000);
    }
}

// Update projectiles and check for collisions
function updateProjectiles() {
    projectiles = projectiles.filter(projectile => {
        // Move projectile
        projectile.x += projectile.speed;

        // Check collision with the boss
        if (Math.abs(projectile.x - bossX) < 60 && Math.abs(projectile.y - bossY) < 60) {
            bossHitsRemaining--; // Reduce boss hit count
            console.log(`Boss hit! Hits remaining: ${bossHitsRemaining}`);
            if (bossHitsRemaining <= 0) {
                triggerDialogue(); // Trigger dialogue when boss is defeated
            }
            return false; // Remove projectile
        }

        // Remove projectile if it goes off-screen
        return projectile.x < canvas.width;
    });
}

// Trigger dialogue and transition to Chapter 7
function triggerDialogue() {
    console.log("The Abyss General is defeated! Proceeding to Chapter 7...");
    playerAlive = false; // Stop the game
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "20px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText("Your mask is awake.", canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillText("Now you're facing the Mega Boss.", canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillText("Proceeding to Chapter 7...", canvas.width / 2, canvas.height / 2 + 30);
    setTimeout(() => {
        window.location.href = "CHAPTER 7.html"; // Redirect to Chapter 7
    }, 4000); // Wait 4 seconds before transitioning
}

// Display enemy health percentage
function drawEnemyHealth(x, y, hp, maxHp) {
    const healthPercent = Math.max(0, Math.floor((hp / maxHp) * 100));
    ctx.fillStyle = "red";
    ctx.font = "14px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText(`${healthPercent}%`, x + 50, y - 10);
}

// Enemy attack logic
function enemyAttack() {
    if (!playerAlive) return;

    // Melee attack if near
    if (!enemyMeleeCooldown && Math.abs(charlsX - bossX) < 80 && Math.abs(charlsY - bossY) < 80) {
        reducePlayerHealth(20); // Strong melee attack
        enemyMeleeCooldown = true;
        setTimeout(() => (enemyMeleeCooldown = false), 1000);
    }

    // Magic attack from a distance
    if (!enemyMagicCooldown) {
        createEnemyProjectile(bossX, bossY);
        enemyMagicCooldown = true;
        setTimeout(() => (enemyMagicCooldown = false), 1500);
    }
}

// Create enemy projectile
let enemyProjectiles = [];
function createEnemyProjectile(x, y) {
    // Multi-attack: Create multiple projectiles
    for (let angle = -30; angle <= 30; angle += 15) {
        enemyProjectiles.push({
            x,
            y,
            speedX: -5 * Math.cos((angle * Math.PI) / 180),
            speedY: -5 * Math.sin((angle * Math.PI) / 180),
        });
    }
}

// Update enemy projectiles and check for collisions
function updateEnemyProjectiles() {
    enemyProjectiles = enemyProjectiles.filter(projectile => {
        projectile.x += projectile.speedX;
        projectile.y += projectile.speedY;

        // Check collision with player or shield
        if (swordActive && Math.abs(projectile.x - charlsX) < 80 && Math.abs(projectile.y - charlsY) < 80) {
            // Shield blocks the projectile
            console.log("Projectile blocked by shield!");
            return false; // Remove projectile
        }

        if (Math.abs(projectile.x - charlsX) < 50 && Math.abs(projectile.y - charlsY) < 50) {
            reducePlayerHealth(10);
            return false; // Remove projectile
        }

        // Remove projectile if off-screen
        return projectile.x > 0 && projectile.y > 0 && projectile.y < canvas.height;
    });
}

// Reduce player health
function reducePlayerHealth(amount) {
    charlsHP -= amount;
    if (charlsHP <= 0) {
        charlsHP = 0;
        endGame(false); // Player loses
    }
}

// End game
function endGame(playerWon) {
    playerAlive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "20px 'Press Start 2P'";
    ctx.textAlign = "center";

    if (playerWon) {
        ctx.fillText("The Mask is Revealed!", canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText("Proceeding to Chapter 7...", canvas.width / 2, canvas.height / 2 + 20);
        setTimeout(() => {
            window.location.href = "CHAPTER 7.html"; // Redirect to Chapter 7
        }, 3000);
    } else {
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText("Press ENTER to Try Again", canvas.width / 2, canvas.height / 2 + 20);
        document.addEventListener("keydown", function retry(event) {
            if (event.key === "Enter") {
                location.reload(); // Reload the game
            }
        });
    }
}

// Draw boss and its health
function drawScene() {
    if (!playerAlive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(templeBg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(charls, charlsX, charlsY, 100, 100);

    // Draw boss
    if (bossHitsRemaining > 0) {
        ctx.drawImage(boss, bossX, bossY, 120, 120);
    }

    // Draw hearts for health
    for (let i = 0; i < Math.ceil(charlsHP / 20); i++) {
        ctx.drawImage(heartImg, 10 + i * 30, 10, 25, 25);
    }

    // Draw shield animation
    if (swordActive) {
        ctx.strokeStyle = "cyan";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(charlsX + 50, charlsY + 50, 80, 0, Math.PI * 2); // Shield as a circle
        ctx.stroke();
    }

    // Draw player projectiles (blue balls)
    ctx.fillStyle = "blue";
    projectiles.forEach(projectile => {
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw enemy projectiles
    ctx.fillStyle = "red";
    enemyProjectiles.forEach(projectile => {
        ctx.fillRect(projectile.x, projectile.y, 10, 10); // Enemy projectile
    });

    requestAnimationFrame(drawScene);
}

// Update game logic
function updateMovement() {
    if (!playerAlive) return;

    if (moveUp) charlsY -= speed;
    if (moveDown) charlsY += speed;
    if (moveLeft) charlsX -= speed;
    if (moveRight) charlsX += speed;

    updateProjectiles(); // Update player projectiles
    updateEnemyProjectiles(); // Update enemy projectiles
    requestAnimationFrame(updateMovement);
}

// Enemy movement and attack logic
function moveEnemies() {
    if (!playerAlive) return;

    if (bossHitsRemaining > 0) {
        bossX += Math.sin(Date.now() / 1000) * 1.5;
        bossY += Math.cos(Date.now() / 1000) * 1.5;
    }

    enemyAttack(); // Trigger enemy attacks
    if (gameStarted) setTimeout(moveEnemies, 50);
}

// Show start screen initially
showStartScreen();

function updatePlayerPosition() {
    if (moveUp) playerY -= playerSpeed;
    if (moveDown) playerY += playerSpeed;
    if (moveLeft) playerX -= playerSpeed;
    if (moveRight) playerX += playerSpeed;

    // Boundary checks
    if (playerX < 0) playerX = 0;
    if (playerY < 0) playerY = 0;
    if (playerX > canvas.width - playerWidth) playerX = canvas.width - playerWidth;
    if (playerY > canvas.height - playerHeight) playerY = canvas.height - playerHeight;
}