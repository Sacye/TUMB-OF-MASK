const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load images
const caveBg = new Image();
caveBg.src = "Cave.gif";  
caveBg.onload = function () {
    console.log("Background image loaded successfully.");
    drawScene();
    startGame(); // Start the wake-up sequence
    updateMovement();
};
caveBg.onerror = function () {
    console.error("Failed to load background image. Check the file path.");
};

const charls = new Image();
charls.src = "Main Character Normal.png";  

const hermitEldren = new Image();
hermitEldren.src = "Hermit Eldren Normal.png";  

// NPC Data
let npcs = [
    { x: canvas.width * 0.4, y: canvas.height * 0.5, sprite: hermitEldren, dialogue: "Hermit Eldren: 'You are safe now, Charls. But the world is not.'" }
];

let charlsX = canvas.width * 0.2, charlsY = canvas.height * 0.6;
let speed = 5;
let nearNPCIndex = -1;

let questUnlocked = false;
let dialogueActive = false;

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
    const dialogueBox = document.getElementById("dialogue-box");
    dialogueBox.style.display = "block";
    typeWriter(npc.dialogue, document.getElementById("dialogue-text"));
}

// Show Dialogue Box
function showDialogue(text) {
    document.getElementById("dialogue-box").style.display = "block";
    document.getElementById("dialogue-text").innerText = text;
}

// Start Game with Wake-Up Sequence
function startGame() {
    console.log("Game started. Charls is waking up...");
    setTimeout(() => {
        console.log("Old man appears.");
        const dialogueBox = document.getElementById("dialogue-box");
        dialogueBox.style.display = "block";
        nextDialogue(); // Start the dialogue sequence
    }, 2000); // Old man appears after 2 seconds
}

// Start Dialogue
function startDialogue(text) {
    dialogueActive = true;
    showDialogue(text);
    setTimeout(() => {
        endDialogue();
        unlockQuestSystem();
    }, 5000); // Dialogue lasts for 5 seconds
}

// End Dialogue
function endDialogue() {
    dialogueActive = false;
    document.getElementById("dialogue-box").style.display = "none";
    console.log("Dialogue ended.");
}

// Unlock Quest System
function unlockQuestSystem() {
    questUnlocked = true;
    console.log("Quest system unlocked!");
    alert("Quest system unlocked! You can now interact with the world.");
}

// Override Movement Update to Disable Movement During Dialogue
function updateMovement() {
    if (dialogueActive) return; // Disable movement during dialogue
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
    if (caveBg.complete) {
        ctx.drawImage(caveBg, 0, 0, canvas.width, canvas.height);
    } else {
        console.warn("Background image not yet loaded.");
    }
    ctx.drawImage(charls, charlsX, charlsY, 100, 100);
    npcs.forEach((npc, index) => ctx.drawImage(npc.sprite, npc.x, npc.y, 100, 100));
    requestAnimationFrame(drawScene);
}

let dialogueSequence = [
    "Charls: Where..am..I?",
    "Oldman: You..are..safe..now,..Charls.But..the..world..is..not.",
    "Charls: What..happened..to..my..village?",
    "Oldman: It.was.the.work.of.the.Abyss.King..You.are.the.only.hope.left.",
    "Charls: What.do.you.mean?.Me?",
    "Oldman: You.are.the.chosen.one.of.the.Mask...",
    "Oldman: I.am.a.last.fragment.holding.the.memory.of.the.Mask...I.was.summoned.if.there.is.a.chosen.one.to.hold.the.power.of.the.Mask...",
    "Oldman: I.won’t.last.long...",
    "New Quest Unlocked:-Find.a.new.ally."
];

let currentDialogueIndex = 0;

// Typewriter Effect for Dialogue Text
function typeWriter(text, element, callback) {
    let i = 0;
    element.innerText = "";
    const interval = setInterval(() => {
        element.innerText += text.charAt(i);
        i++;
        if (i === text.length) {
            clearInterval(interval);
            document.getElementById("dialogue-box").classList.add("show-next"); // Show "Next" button
            if (callback) callback();
        }
    }, 50); // Adjust typing speed here
}

// Define the nextDialogue function
function nextDialogue() {
    const dialogueBox = document.getElementById("dialogue-box");
    const dialogueText = document.getElementById("dialogue-text");
    dialogueBox.classList.remove("show-next"); // Hide "Next" button

    if (currentDialogueIndex < dialogueSequence.length) {
        typeWriter(dialogueSequence[currentDialogueIndex], dialogueText, () => {
            currentDialogueIndex++;
            if (currentDialogueIndex === dialogueSequence.length) {
                setTimeout(() => {
                    unlockQuestAndTransition();
                }, 2000); // Delay before transitioning
            }
        });
    } else {
        dialogueBox.style.display = "none";
    }
}

// Unlock Quest and Transition to Chapter 3
function unlockQuestAndTransition() {
    alert("New Quest Unlocked: Find a new ally.");
    fadeOutToChapter3();
}

// Fade-Out Transition to Chapter 3
function fadeOutToChapter3() {
    let opacity = 1;
    const fadeOutInterval = setInterval(() => {
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        opacity -= 0.02;
        if (opacity <= 0) {
            clearInterval(fadeOutInterval);
            window.location.href = "CHAPTER 3.html"; // Redirect to Chapter 3
        }
    }, 50);
}

// Detect if the user is on a mobile device
function isMobileDevice() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// Adjust visibility of mobile controls based on device type
function adjustMobileControlsVisibility() {
    const mobileControls = document.getElementById("mobile-controls");

    if (isMobileDevice()) {
        if (mobileControls) mobileControls.style.display = "flex"; // Show controls for mobile devices
    } else {
        if (mobileControls) mobileControls.style.display = "none"; // Hide controls for non-mobile devices
    }
}

// Call the function on page load
window.onload = adjustMobileControlsVisibility;

// Detect if the user is on a mobile device
function isMobileDevice() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// Adjust visibility of "Next" button and mobile controls based on device type
function adjustControlsVisibility() {
    const nextButton = document.querySelector("#dialogue-box button");
    const mobileControls = document.getElementById("mobile-controls");

    if (isMobileDevice() && (window.innerWidth < 768 || window.innerHeight > window.innerWidth)) {
        if (nextButton) nextButton.style.display = "none";
        if (mobileControls) mobileControls.style.display = "flex"; // Show controls for small screens or portrait mode
    } else {
        if (nextButton) nextButton.style.display = "block";
        if (mobileControls) mobileControls.style.display = "none"; // Hide controls for large screens or landscape mode
    }
}

// Call the function on page load
window.onload = adjustControlsVisibility;