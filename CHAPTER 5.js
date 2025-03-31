const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load images
const castleBg = new Image();
castleBg.src = "castle.jpg";  

const charls = new Image();
charls.src = "Main Character Normal.png";  

const enemy = new Image();
enemy.src = "enemy.png";  

const healthBar = new Image();
healthBar.src = "Character 1.png";  

// Load heart image
const heartImage = new Image();
heartImage.src = "heart 1.webp";  // Ensure this image exists in your project directory

// Background Music
let bgMusic = document.getElementById("bg-music");
bgMusic.volume = 0.5;
bgMusic.play();

// Character Stats
let charlsHP = 100;
let enemyHP = 50;

// Movement & Combat System
let charlsX = canvas.width * 0.2, charlsY = canvas.height * 0.6;
let speed = 5;
let moveUp = false, moveDown = false, moveLeft = false, moveRight = false;
let enemyX = canvas.width * 0.6, enemyY = canvas.height * 0.6;
let isAttacking = false;

let gravity = 2; // Gravity effect
let isFalling = true; // Track if Charls is falling

let hasInteracted = false; // Track if interaction has occurred

let dialogueQueue = []; // Queue for multi-step dialogues
let isDialogueActive = false; // Track if dialogue is active

let currentRiddleIndex = 0; // Track the current riddle
const riddles = [
    { question: "What has keys but can't open locks?", options: [" piano", " door"], answer: 0 },
    { question: "What has to be broken before you can use it?", options: ["An egg", " glass"], answer: 0 },
    { question: "I’m tall when I’m young, and I’m short when I’m old. What am I?", options: [" candle", " tree"], answer: 0 },
    { question: "What can travel around the world while staying in the same spot?", options: ["stamp", "shadow"], answer: 0 },
    { question: "The more of this you take, the more you leave behind. What is it?", options: ["Footsteps", "Time"], answer: 0 }
];

// Keyboard Controls (PC)
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") moveUp = true;
    if (event.key === "ArrowDown") moveDown = true;
    if (event.key === "ArrowLeft") moveLeft = true;
    if (event.key === "ArrowRight") moveRight = true;
    if (event.key === "Space") attackEnemy();
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

// Attack Function
function attackEnemy() {
    if (!isAttacking && Math.abs(charlsX - enemyX) < 60 && Math.abs(charlsY - enemyY) < 60) {
        isAttacking = true;
        enemyHP -= 10;
        setTimeout(() => isAttacking = false, 500);
        if (enemyHP <= 0) {
            enemyX = -100;  // Remove enemy from screen
            showDialogue("Enemy defeated! You may proceed.");
        }
    }
}

// Movement Update
function updateMovement() {
    if (isFalling) {
        charlsY += gravity;
        if (charlsY >= canvas.height * 0.6) { // Stop falling when reaching the floor
            charlsY = canvas.height * 0.6;
            isFalling = false;
            showDialogue("Ouchh! Where am I...");
        }
    } else {
        if (moveUp) charlsY -= speed;
        if (moveDown) charlsY += speed;
        if (moveLeft) charlsX -= speed;
        if (moveRight) charlsX += speed;

        // Interaction with enemy
        if (!hasInteracted && Math.abs(charlsX - enemyX) < 60 && Math.abs(charlsY - enemyY) < 60) {
            hasInteracted = true;
            dialogueQueue = [
                "Ohhhh, I chosen one...",
                "Then you have no other choices. You are trapped here! HAHAHA!",
                "Charls: Try me out, CAPEMAN!",
                "Enemy: Sure, but my condition is this: if you cannot answer some of my riddles, you will lose your life!"
            ];
            nextDialogue();
        }
    }

    requestAnimationFrame(updateMovement);
}

// Dialogue Function
function showDialogue(message) {
    const dialogueBox = document.getElementById("dialogue-box");
    const dialogueText = document.getElementById("dialogue-text");
    const nextButton = document.querySelector("#dialogue-box button");
    dialogueText.textContent = message;
    dialogueBox.style.display = "block";
    nextButton.style.display = "block"; // Ensure the "Next" button is visible by default
    isDialogueActive = true;
}

// Advance Dialogue
function nextDialogue() {
    if (dialogueQueue.length > 0) {
        const nextMessage = dialogueQueue.shift();
        showDialogue(nextMessage);
    } else {
        const dialogueBox = document.getElementById("dialogue-box");
        dialogueBox.style.display = "none";
        isDialogueActive = false;

        // Trigger riddle quest if dialogue ends
        if (hasInteracted && !riddleStarted) {
            startRiddleQuest();
        }
    }
}

// Start Riddle Quest
let riddleStarted = false;
function startRiddleQuest() {
    riddleStarted = true;
    currentRiddleIndex = 0;

    // Hide the "Next" button during the riddle phase
    const nextButton = document.querySelector("#dialogue-box button");
    nextButton.style.display = "none";

    showRiddle();
}

function showRiddle() {
    if (currentRiddleIndex >= riddles.length) {
        // Player wins
        const nextButton = document.querySelector("#dialogue-box button");
        nextButton.style.display = "block"; // Unhide the "Next" button after the riddle phase
        showDialogue("Wow, impressive! But what about this...");
        setTimeout(() => {
            window.location.href = "CHAPTER 6.html"; // Redirect to Chapter 6
        }, 3000);
        return;
    }

    const riddle = riddles[currentRiddleIndex];
    const dialogueBox = document.getElementById("dialogue-box");
    const dialogueText = document.getElementById("dialogue-text");
    dialogueText.innerHTML = `
        ${riddle.question}<br>
        <button onclick="answerRiddle(0)">A: ${riddle.options[0]}</button>
        <button onclick="answerRiddle(1)">B: ${riddle.options[1]}</button>
    `;
    dialogueBox.style.display = "block";
}

function answerRiddle(selectedOption) {
    const riddle = riddles[currentRiddleIndex];
    if (selectedOption === riddle.answer) {
        currentRiddleIndex++;
        showRiddle();
    } else {
        // Incorrect answer
        charlsHP -= 33.33; // Lose one heart
        if (charlsHP <= 0) {
            // Player loses
            showDialogue("You lost! Restarting the chapter...");
            setTimeout(() => {
                window.location.reload(); // Restart the chapter
            }, 3000);
        } else {
            showDialogue("Incorrect! Try the next question...");
            setTimeout(showRiddle, 3000);
        }
    }
}

// Draw Scene
function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(castleBg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(charls, charlsX, charlsY, 100, 100);
    if (enemyHP > 0) ctx.drawImage(enemy, enemyX, enemyY, 100, 100);

    // Draw hearts for health
    for (let i = 0; i < Math.ceil(charlsHP / 33.33); i++) {
        ctx.drawImage(heartImage, 10 + i * 40, 10, 30, 30);
    }

    requestAnimationFrame(drawScene);
}

// Start Game
castleBg.onload = function () {
    drawScene();
    updateMovement();
};