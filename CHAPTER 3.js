const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load images
const journeyBg = new Image();
journeyBg.src = "journey.gif"; // Use the GIF as the background image

const charls = new Image();
charls.src = "Main Character Normal.png";  // Replace with Charls' unique image file

const sylia = new Image();
sylia.src = "Slyia.png";  // Replace with Sylia's unique image file

const talon = new Image();
talon.src = "talon.png";  // Replace with Talon's unique image file

const janel = new Image();
janel.src = "janel.png";  // Replace with Janel's unique image file

// NPC Data
let npcs = [
    { x: canvas.width * 0.4, y: canvas.height * 0.7, sprite: sylia, dialogue: "Sylia: 'We head toward the ruins. The Mask’s power lies there.'" },
    { x: canvas.width * 0.6, y: canvas.height * 0.7, sprite: talon, dialogue: "Talon: 'But be careful. We’re not the only ones looking for it.'" },
    { x: canvas.width * 0.8, y: canvas.height * 0.7, sprite: janel, dialogue: "Janel: 'Stay close. This is just the beginning of our journey.'" }
];

let charlsX = canvas.width * 0.2, charlsY = canvas.height * 0.7; // Lower Charls' position
let speed = 5;
let nearNPCIndex = -1;
let allNPCsNear = false;

// Movement Controls
let moveUp = false, moveDown = false, moveLeft = false, moveRight = false;

// Keyboard Controls (PC)
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") moveUp = true;
    if (event.key === "ArrowDown") moveDown = true;
    if (event.key === "ArrowLeft") moveLeft = true;
    if (event.key === "ArrowRight") moveRight = true;
    if (event.key === "e" && nearNPCIndex !== -1) interactWithNPC(npcs[nearNPCIndex]);
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
document.getElementById("interact").addEventListener("touchstart", () => {
    if (nearNPCIndex !== -1) interactWithNPC(npcs[nearNPCIndex]);
});

// Check if Charls is near an NPC
function checkNPCProximity() {
    nearNPCIndex = -1;
    npcs.forEach((npc, index) => {
        if (Math.abs(charlsX - npc.x) < 50 && Math.abs(charlsY - npc.y) < 50) {
            nearNPCIndex = index;
            document.getElementById("talk-prompt").style.display = "block";
        }
    });
}

// NPC Interaction
function interactWithNPC(npc) {
    showDialogue(npc.dialogue);
}

// Show Dialogue Box
function showDialogue(text) {
    const dialogueBox = document.getElementById("dialogue-box");
    const dialogueText = document.getElementById("dialogue-text");

    dialogueBox.style.display = "block";
    dialogueText.innerText = text;
}

// Hide Dialogue Box
function hideDialogue() {
    document.getElementById("dialogue-box").style.display = "none";
}

// Move NPCs toward Charls
function moveNPCsTowardCharls() {
    const currentNPC = npcs[dialogueIndex]; // Get the current NPC based on dialogueIndex
    if (currentNPC.x < charlsX) currentNPC.x += 2;
    if (currentNPC.x > charlsX) currentNPC.x -= 2;
    if (currentNPC.y < charlsY) currentNPC.y += 2;
    if (currentNPC.y > charlsY) currentNPC.y -= 2;

    // Check if the current NPC is near Charls
    if (Math.abs(charlsX - currentNPC.x) < 50 && Math.abs(charlsY - currentNPC.y) < 50) {
        startDialogueSequence();
    }
}

// Dialogue sequence
let dialogueIndex = 0;
const dialogueLines = [
    { npc: "Janel", text: "Janel: 'Stay close. This is just the beginning of our journey.'" },
    { npc: "Talon", text: "Talon: 'But be careful. We’re not the only ones looking for it.'" },
    { npc: "Sylia", text: "Sylia: 'We head toward the ruins. The Mask’s power lies there.'" },
    { npc: "Charls", text: "Charls: 'I understand. Let’s move forward together.'" }
];

function startDialogueSequence() {
    if (dialogueIndex < dialogueLines.length) {
        const currentDialogue = dialogueLines[dialogueIndex];
        showDialogue(currentDialogue.text);

        // Move to the next NPC after the current dialogue
        dialogueIndex++;
    } else {
        hideDialogue();
        transitionToChapter4();
    }
}

// Transition to Chapter 4
function transitionToChapter4() {
    window.location.href = "CHAPTER 4.html"; // Ensure CHAPTER 4.html exists
}

// Movement Update
function updateMovement() {
    if (dialogueIndex < npcs.length) {
        moveNPCsTowardCharls(); // Move the current NPC toward Charls
    }

    if (moveUp) charlsY -= speed;
    if (moveDown) charlsY += speed;
    if (moveLeft) charlsX -= speed;
    if (moveRight) charlsX += speed;

    checkNPCProximity();
    requestAnimationFrame(updateMovement);
}

// Draw Scene
function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(journeyBg, 0, 0, canvas.width, canvas.height); // Draw the GIF as the background
    ctx.drawImage(charls, charlsX, charlsY, 100, 100); // Draw Charls
    npcs.forEach((npc, index) => ctx.drawImage(npc.sprite, npc.x, npc.y, 100, 100)); // Draw NPCs
    requestAnimationFrame(drawScene);
}

// Start Game
journeyBg.onload = function () {
    drawScene();
    updateMovement();
};