const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load images
const abyssThrone = new Image();
abyssThrone.src = "Tombofmask.png";  

const charls = new Image();
charls.src = "Main Character Mask Normal.png";  

const sylia = new Image();
sylia.src = "Slyia.png";  

const talon = new Image();
talon.src = "talon.png";  

const janel = new Image();
janel.src = "janel.png";  

const abyssMinion = new Image();
abyssMinion.src ="abyssNormal.png";  

const abyssBoss = new Image();
abyssBoss.src = "abyss king final form.png";  

const healthBar = new Image();
healthBar.src = "heart 1.webp"; // Updated health bar image

// Update heart image
const heartImg = new Image();
heartImg.src = "heart 1.webp"; // Updated heart image

// Background Music
let bgMusic = document.getElementById("bg-music");
bgMusic.volume = 0.5;
bgMusic.play();

// Character Stats
let charlsHP = 100;
let partyHP = 100;
let minionHP = 30;
let bossHP = 200;

// Movement & Combat System
let charlsX = canvas.width * 0.2, charlsY = canvas.height * 0.6;
let speed = 5;
let moveUp = false, moveDown = false, moveLeft = false, moveRight = false;
let minionX = canvas.width * 0.6, minionY = canvas.height * 0.6;
let bossX = canvas.width * 0.5, bossY = canvas.height * 0.4;
let isAttacking = false;
let isCastingMagic = false;

// Introduction
function startGame() {
    document.getElementById("introduction").style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";
    bgMusic.play();
    drawScene();
    updateMovement();
}

// Mega Boss
let bossHits = 0;
const maxBossHits = 20;

// Magic Cooldown
let magicCooldown = false;

// Mega Boss Stats
let bossHitsRemaining = 3; // Boss requires 3 hits to be defeated

// Shield and Projectile Properties
let shieldActive = false;
let projectiles = [];

// Flag to prevent repeated dialogue and transition
let bossDefeated = false;

// Keyboard Controls (PC)
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") moveUp = true;
    if (event.key === "ArrowDown") moveDown = true;
    if (event.key === "ArrowLeft") moveLeft = true;
    if (event.key === "ArrowRight") moveRight = true;
    if (event.key === "Space") attackEnemy();
    if (event.key === "M") castUltimate();
    if (event.key === "1") activateShield(); // Shield activation
    if (event.key === "2") castMagic(); // Magic attack
    if (event.key === "1") castShortRangeMagic();
    if (event.key === "2") castDoubleBall();
});

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowUp") moveUp = false;
    if (event.key === "ArrowDown") moveDown = false;
    if (event.key === "ArrowLeft") moveLeft = false;
    if (event.key === "ArrowRight") moveRight = false;
});

// Mobile Controls
document.getElementById("up").addEventListener("touchstart", () => moveUp = true);
document.getElementById("down").addEventListener("touchstart", () => moveDown = true);
document.getElementById("left").addEventListener("touchstart", () => moveLeft = true);
document.getElementById("right").addEventListener("touchstart", () => moveRight = true);
document.getElementById("attack").addEventListener("touchstart", attackEnemy);
document.getElementById("magic").addEventListener("touchstart", castUltimate);

// Attack Function
function attackEnemy() {
    if (!isAttacking) {
        isAttacking = true;
        if (Math.abs(charlsX - minionX) < 60 && Math.abs(charlsY - minionY) < 60) {
            minionHP -= 10;
            if (minionHP <= 0) minionX = -100;
        }
        setTimeout(() => isAttacking = false, 500);
    }
}

// Ultimate Attack
function castUltimate() {
    if (!isCastingMagic) {
        isCastingMagic = true;
        if (Math.abs(charlsX - bossX) < 120 && Math.abs(charlsY - bossY) < 120) {
            bossHP -= 50;
            if (bossHP <= 0) {
                bossX = -100;
                showDialogue("The Abyss King is awakening...");
            }
        }
        setTimeout(() => isCastingMagic = false, 1000);
    }
}

// Short Range Magic
function castShortRangeMagic() {
    if (!magicCooldown) {
        magicCooldown = true;
        if (Math.abs(charlsX - bossX) < 80 && Math.abs(charlsY - bossY) < 80) {
            bossHP -= 10;
            bossHits++;
            checkBossDefeat();
        }
        setTimeout(() => magicCooldown = false, 20000);
    }
}

// Double Ball Magic
function castDoubleBall() {
    if (!magicCooldown) {
        magicCooldown = true;
        bossHP -= 20;
        bossHits += 2;
        checkBossDefeat();
        setTimeout(() => magicCooldown = false, 20000);
    }
}

// Check Boss Defeat
function checkBossDefeat() {
    if (bossHits >= maxBossHits) {
        bossX = -100;
        showDialogue("The Abyss King is here...");
    }
}

// Shield Activation
function activateShield() {
    if (!shieldActive) {
        shieldActive = true;
        setTimeout(() => shieldActive = false, 3000); // Shield lasts for 3 seconds
    }
}

// Magic Attack
function castMagic() {
    if (!isCastingMagic) {
        isCastingMagic = true;
        // Create three projectiles for the magic attack
        for (let i = -1; i <= 1; i++) {
            projectiles.push({
                x: charlsX + 50,
                y: charlsY + 50,
                speedX: 10,
                speedY: i * 2, // Spread projectiles
                radius: 10
            });
        }
        setTimeout(() => isCastingMagic = false, 2000); // Cooldown for magic attack
    }
}

// Update Projectiles
function updateProjectiles() {
    projectiles = projectiles.filter(projectile => {
        projectile.x += projectile.speedX;
        projectile.y += projectile.speedY;

        // Check collision with the boss
        if (!bossDefeated && Math.abs(projectile.x - bossX) < 60 && Math.abs(projectile.y - bossY) < 60) {
            bossHitsRemaining--;
            if (bossHitsRemaining === 0) {
                bossDefeated = true; // Mark boss as defeated
                bossX = -100;
                showDialogue("You defeated me how???... I am the powerful!"); // Show dialogue
                setTimeout(() => {
                    window.location.href = "CHAPTER 8.html"; // Redirect to Chapter 8
                }, 3000); // Wait 3 seconds before transitioning
            }
            return false; // Remove projectile
        }

        // Check collision with Pet 1
        if (pet1HitsRemaining > 0 && Math.abs(projectile.x - pet1X) < 60 && Math.abs(projectile.y - pet1Y) < 60) {
            pet1HitsRemaining--;
            if (pet1HitsRemaining === 0) {
                pet1X = -100; // Remove Pet 1 from the screen
                pet1Y = -100;
            }
            return false; // Remove projectile
        }

        // Check collision with Pet 2
        if (pet2HitsRemaining > 0 && Math.abs(projectile.x - pet2X) < 60 && Math.abs(projectile.y - pet2Y) < 60) {
            pet2HitsRemaining--;
            if (pet2HitsRemaining === 0) {
                pet2X = -100; // Remove Pet 2 from the screen
                pet2Y = -100;
            }
            return false; // Remove projectile
        }

        // Remove projectile if it goes off-screen
        return projectile.x < canvas.width;
    });
}

// Show Dialogue Function
function showDialogue(message) {
    const dialogueBox = document.getElementById("dialogue-box");
    const dialogueText = document.getElementById("dialogue-text");

    dialogueText.textContent = message;
    dialogueBox.style.display = "block";

    setTimeout(() => {
        dialogueBox.style.display = "none";
    }, 2500); // Hide dialogue after 2.5 seconds
}

// Enemy Attack Logic
let enemyProjectiles = [];
function createEnemyProjectile(x, y) {
    enemyProjectiles.push({
        x,
        y,
        speedX: (charlsX - x) / 70, // Slower speed
        speedY: (charlsY - y) / 70
    });
}

// Update collision logic to trigger "Game Over"
function updateEnemyProjectiles() {
    enemyProjectiles = enemyProjectiles.filter(projectile => {
        projectile.x += projectile.speedX;
        projectile.y += projectile.speedY;

        // Check collision with shield
        if (shieldActive && Math.abs(projectile.x - charlsX) < 80 && Math.abs(projectile.y - charlsY) < 80) {
            return false; // Shield blocks the projectile
        }

        // Check collision with player
        if (Math.abs(projectile.x - charlsX) < 50 && Math.abs(projectile.y - charlsY) < 50) {
            charlsHP -= 10;
            if (charlsHP <= 0) {
                charlsHP = 0;
                showGameOver(); // Trigger "Game Over"
                return false;
            }
            return false; // Remove projectile
        }

        // Remove projectile if off-screen
        return projectile.x > 0 && projectile.y > 0 && projectile.y < canvas.height && projectile.x < canvas.width;
    });
}

// Fix "Game Over" display issue
function showGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText("Press ENTER to Restart", canvas.width / 2, canvas.height / 2 + 20);

    document.addEventListener("keydown", function retry(event) {
        if (event.key === "Enter") {
            location.reload(); // Reload the game
        }
    });
}

// Movement Update
function updateMovement() {
    if (moveUp) charlsY -= speed;
    if (moveDown) charlsY += speed;
    if (moveLeft) charlsX -= speed;
    if (moveRight) charlsX += speed;

    updateProjectiles();
    updateEnemyProjectiles();

    requestAnimationFrame(updateMovement);
}

// Pets of the Mega Boss
let pet1X = canvas.width * 0.3, pet1Y = canvas.height * 0.3;
let pet2X = canvas.width * 0.7, pet2Y = canvas.height * 0.3;
let petSpeed = 3;
let pet1HitsRemaining = 1; // Pet 1 requires only 1 hit
let pet2HitsRemaining = 1; // Pet 2 requires only 1 hit

// Update Mega Boss and Pets Movement
function moveBossAndPets() {
    // Move the boss in a sinusoidal pattern
    bossX += Math.sin(Date.now() / 1000) * 2;
    bossY += Math.cos(Date.now() / 1000) * 2;

    // Move pets randomly only if they are still active
    if (pet1HitsRemaining > 0) {
        pet1X += (Math.random() - 0.5) * petSpeed;
        pet1Y += (Math.random() - 0.5) * petSpeed;
        pet1X = Math.max(0, Math.min(canvas.width - 50, pet1X));
        pet1Y = Math.max(0, Math.min(canvas.height - 50, pet1Y));
    }

    if (pet2HitsRemaining > 0) {
        pet2X += (Math.random() - 0.5) * petSpeed;
        pet2Y += (Math.random() - 0.5) * petSpeed;
        pet2X = Math.max(0, Math.min(canvas.width - 50, pet2X));
        pet2Y = Math.max(0, Math.min(canvas.height - 50, pet2Y));
    }

    // Pets attack randomly only if they are still active
    if (pet1HitsRemaining > 0 && Math.random() < 0.5) createRandomProjectile(pet1X, pet1Y);
    if (pet2HitsRemaining > 0 && Math.random() < 0.5) createRandomProjectile(pet2X, pet2Y);

    setTimeout(moveBossAndPets, 1500); // Update movement every 1.5 seconds
}

// Create random projectiles for pets
function createRandomProjectile(x, y) {
    const randomAngle = Math.random() * 2 * Math.PI; // Random direction
    enemyProjectiles.push({
        x,
        y,
        speedX: Math.cos(randomAngle) * 2, // Slower speed
        speedY: Math.sin(randomAngle) * 2
    });
}

// Boss Attack Logic
function bossAttack() {
    if (!bossDefeated && bossHitsRemaining > 0) {
        createEnemyProjectile(bossX + 75, bossY + 75); // Boss shoots a projectile from its center
    }
    setTimeout(bossAttack, 2000); // Boss attacks every 2 seconds
}

// Draw Scene
function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(abyssThrone, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(charls, charlsX, charlsY, 80, 80); // Reduced size

    // Draw Mega Boss
    if (bossHitsRemaining > 0) {
        ctx.drawImage(abyssBoss, bossX, bossY, 150, 150);
    }

    // Draw Pets
    ctx.drawImage(abyssMinion, pet1X, pet1Y, 80, 80);
    ctx.drawImage(abyssMinion, pet2X, pet2Y, 80, 80);

    // Draw Shield
    if (shieldActive) {
        ctx.strokeStyle = "cyan";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(charlsX + 40, charlsY + 40, 80, 0, Math.PI * 2); // Adjusted for smaller character
        ctx.stroke();
    }

    // Draw Player Projectiles
    ctx.fillStyle = "blue";
    projectiles.forEach(projectile => {
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Enemy Projectiles
    ctx.fillStyle = "red";
    enemyProjectiles.forEach(projectile => {
        ctx.fillRect(projectile.x, projectile.y, 10, 10);
    });

    // Draw Hearts
    for (let i = 0; i < Math.ceil(charlsHP / 20); i++) {
        ctx.drawImage(heartImg, 10 + i * 30, 10, 25, 25); // Updated to use heartImg
    }

    requestAnimationFrame(drawScene);
}

// Start Game
abyssThrone.onload = function () {
    drawScene();
    updateMovement();
    moveBossAndPets();
    bossAttack(); // Start boss attack logic
};