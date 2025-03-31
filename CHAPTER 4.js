const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load images
const ruinsBg = new Image();
ruinsBg.src = "ruin.png";  

const charls = new Image();
charls.src = "Main Character Normal.png";  

const sylia = new Image();
sylia.src = "Slyia.png";  

const talon = new Image();
talon.src = "talon.png";  

const janel = new Image();
janel.src = "janel.png";  

const bossEnemy = new Image();
bossEnemy.src = "AbyssNormal.png";  

// Background Music
let bgMusic = document.getElementById("bg-music");
bgMusic.volume = 0.5;
bgMusic.play();

// NPC Data
let npcs = [
    { x: canvas.width * 0.4, y: canvas.height * 0.6, sprite: sylia, dialogue: "Sylia: 'This place feels... ancient. We must be careful.'" },
    { x: canvas.width * 0.6, y: canvas.height * 0.6, sprite: talon, dialogue: "Talon: 'The ruins hide many secrets. Stay alert.'" },
    { x: canvas.width * 0.8, y: canvas.height * 0.6, sprite: janel, dialogue: "Janel: 'There’s something powerful ahead... I can sense it.'" }
];

// Puzzle System (Door Unlock)
let puzzleSolved = false;

function solvePuzzle() {
    console.log("solvePuzzle function called.");
    puzzleSolved = true;
    document.getElementById("dialogue-box").style.display = "block";
    document.getElementById("dialogue-text").innerText = "The ancient door slowly opens...";

    // Redirect to Chapter 5 after a delay
    setTimeout(() => {
        window.location.href = "CHAPTER 5.html";
    }, 3000); // 3-second delay for the dialogue to display
}

// Boss Battle
let bossDefeated = false;
function startBossFight() {
    if (!bossDefeated) {
        document.getElementById("dialogue-box").style.display = "block";
        document.getElementById("dialogue-text").innerText = "A powerful guardian emerges!";
        setTimeout(() => {
            bossDefeated = true;
            document.getElementById("dialogue-text").innerText = "The guardian is defeated!";
        }, 3000);
    }
}

// Movement System
let charlsX = canvas.width * 0.2, charlsY = canvas.height * 0.6;
let speed = 5;
let moveUp = false, moveDown = false, moveLeft = false, moveRight = false;

// PC Keyboard Controls
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") moveUp = true;
    if (event.key === "ArrowDown") moveDown = true;
    if (event.key === "ArrowLeft") moveLeft = true;
    if (event.key === "ArrowRight") moveRight = true;
    if (event.key === "e") interactWithNPC();
});

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowUp") moveUp = false;
    if (event.key === "ArrowDown") moveDown = false;
    if (event.key === "ArrowLeft") moveLeft = false;
    if (event.key === "ArrowRight") moveRight = false;
});

// Mobile Touch Controls
document.getElementById("up").addEventListener("touchstart", () => moveUp = true);
document.getElementById("down").addEventListener("touchstart", () => moveDown = true);
document.getElementById("left").addEventListener("touchstart", () => moveLeft = true);
document.getElementById("right").addEventListener("touchstart", () => moveRight = true);
document.getElementById("interact").addEventListener("touchstart", () => interactWithNPC());

// Ensure mobile controls stop movement on touchend
document.getElementById("up").addEventListener("touchend", () => moveUp = false);
document.getElementById("down").addEventListener("touchend", () => moveDown = false);
document.getElementById("left").addEventListener("touchend", () => moveLeft = false);
document.getElementById("right").addEventListener("touchend", () => moveRight = false);

// Check if Charls is near an NPC
let nearNPCIndex = -1;

// Fix checkNPCProximity to hide "talk-prompt" when not near an NPC
function checkNPCProximity() {
    let promptVisible = false;
    nearNPCIndex = -1;
    npcs.forEach((npc, index) => {
        if (Math.abs(charlsX - npc.x) < 50 && Math.abs(charlsY - npc.y) < 50) {
            nearNPCIndex = index;
            promptVisible = true;
        }
    });
    document.getElementById("talk-prompt").style.display = promptVisible ? "block" : "none";
}

// Example: Trigger solvePuzzle when Charls reaches a specific location
function checkPuzzleProximity() {
    const puzzleX = canvas.width * 0.5; // Example puzzle location
    const puzzleY = canvas.height * 0.5;

    if (Math.abs(charlsX - puzzleX) < 50 && Math.abs(charlsY - puzzleY) < 50 && !puzzleSolved) {
        console.log("Puzzle proximity detected. Solving puzzle...");
        solvePuzzle();
    }
}

// NPC Interaction
function interactWithNPC() {
    if (nearNPCIndex !== -1) {
        showDialogue(npcs[nearNPCIndex].dialogue);
    }
}

// Show Dialogue Box
function showDialogue(text) {
    document.getElementById("dialogue-box").style.display = "block";
    document.getElementById("dialogue-text").innerText = text;
}

// Show Quest Notification
function showQuestNotification() {
    const questNotification = document.getElementById("quest-notification");
    questNotification.style.display = "block";

    // Hide the notification after 5 seconds
    setTimeout(() => {
        questNotification.style.display = "none";
    }, 5000);
}

// Movement Update
function updateMovement() {
    if (moveUp) charlsY -= speed;
    if (moveDown) charlsY += speed;
    if (moveLeft) charlsX -= speed;
    if (moveRight) charlsX += speed;

    checkNPCProximity();
    checkPuzzleProximity(); // Add this line to check for puzzle proximity
    requestAnimationFrame(updateMovement);
}

// Draw Scene
function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(ruinsBg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(charls, charlsX, charlsY, 100, 100);
    npcs.forEach((npc, index) => ctx.drawImage(npc.sprite, npc.x, npc.y, 100, 100));

    if (puzzleSolved) {
        ctx.drawImage(bossEnemy, canvas.width * 0.5, canvas.height * 0.4, 120, 120);
    }

    requestAnimationFrame(drawScene);
}

// Start Game
ruinsBg.onload = function () {
    showQuestNotification(); // Show the quest notification at the start
    drawScene();
    updateMovement();
};