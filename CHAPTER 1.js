const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load images
const villageBg = new Image();
villageBg.src = "PeacefulVillage.gif"; // Set the initial background to the peaceful village GIF

const fireBg = new Image();
fireBg.src = "Portal.png";  

const charls = new Image();
charls.src = "Main Character Sprite.png";  

const darkKnight = new Image();
darkKnight.src = "Abys king.png";  

const hermitEldren = new Image();
hermitEldren.src = "Hermit Eldren Normal.png";  

const peacefulVillageBg = new Image();
peacefulVillageBg.src = "village.gif"; // Updated to use a GIF for the peaceful village background

// Load the burning village image
const burningVillageBg = new Image();
burningVillageBg.src = "Burning Village.png"; // Add the burning village image

// Ensure images are loaded before starting the game
let imagesLoaded = 0;
const totalImages = 5; // Total number of images to load

function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        startGame(); // Start the game once all images are loaded
    }
}

// Attach the onImageLoad handler to all images
villageBg.onload = onImageLoad;
fireBg.onload = onImageLoad;
charls.onload = onImageLoad;
darkKnight.onload = onImageLoad;
hermitEldren.onload = onImageLoad;

// Debugging: Log if the character image is loaded
charls.onload = function () {
    console.log("Character sprite loaded successfully.");
};

// Start the game
function startGame() {
    peacefulVillageBg.onload = function () {
        drawIntro(); // Ensure the introduction starts after the GIF is loaded
    };
}

// NPC Data
let npcs = []; // No NPCs on the first screen

let charlsX = canvas.width * 0.1, charlsY = canvas.height * 0.5;
let speed = 5;
let nearNPCIndex = -1;

let currentDialogueIndex = 0;

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

// Hide mobile controls on PC
function hideMobileControls() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
        document.getElementById("mobile-controls").style.display = "none";
    }
}

// Call the function to hide mobile controls
hideMobileControls();

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
function showDialogue(text, callback) {
    const dialogueBox = document.getElementById("dialogue-box");
    const dialogueText = document.getElementById("dialogue-text");
    dialogueBox.style.display = "block";
    dialogueText.innerText = text;

    if (callback) {
        setTimeout(() => {
            callback(); // Execute the callback after the dialogue
        }, 3000); // Adjust delay as needed
    }
}

// Define the nextDialogue function
function nextDialogue() {
    const dialogueBox = document.getElementById("dialogue-box");
    const dialogueText = document.getElementById("dialogue-text");
    dialogueBox.classList.remove("show-next"); // Hide "Next" button

    if (currentDialogueIndex < npcs.length) {
        typeWriter(npcs[currentDialogueIndex].dialogue, dialogueText, () => {
            currentDialogueIndex++;
        });
    } else {
        dialogueBox.style.display = "none";
        currentDialogueIndex = 0; // Reset for future interactions
    }
}

// Attach nextDialogue to the global window object
window.nextDialogue = nextDialogue;

// Typewriter effect for dialogue text
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

// Physics variables
let gravity = 0.5; // Gravity force
let jumpStrength = -10; // Jump force
let charlsVelocityY = 0; // Vertical velocity
let isJumping = false; // Flag to prevent double jumps

// Define the grass floor height and Y-coordinate
const grassFloorHeight = 10; // Set the height of the grass floor
const grassFloorY = canvas.height * 0.95; // Adjust this value to align with the grass in the background image

// Update Movement with Gravity and Jumping
function updateMovement() {
    if (allowMovement) { // Only allow movement if enabled
        if (moveUp && !isJumping) {
            charlsVelocityY = jumpStrength; // Apply jump force
            isJumping = true; // Prevent double jumps
        }
        if (moveLeft) charlsX -= speed;
        if (moveRight) charlsX += speed;

        // Apply gravity
        charlsVelocityY += gravity;
        charlsY += charlsVelocityY;

        // Prevent Charls from falling below the grass floor
        if (charlsY >= grassFloorY) {
            charlsY = grassFloorY; // Snap to the floor
            charlsVelocityY = 0; // Reset vertical velocity
            isJumping = false; // Allow jumping again
        }
    }

    checkNPCProximity();
    requestAnimationFrame(updateMovement);
}

// Draw Scene with Transparent Grass Floor
let knightX = canvas.width * 0.8; // Initial position of the knight
let knightY = grassFloorY - 64; // Position the knight on the grass
let knightSpeed = -2; // Speed of the knight moving toward Charls
let knightDialogueShown = false; // Flag to show knight's dialogue
let knightFlyingAway = false; // Flag to indicate the knight is flying away
let oldManX = canvas.width * 0.3; // Initial position of the old man
let oldManY = grassFloorY - 64; // Position the old man on the grass
let oldManDisappeared = true; // Initially, the old man is not visible
let oldManDialogueStarted = false; // Flag to start the old man's dialogue

// Variables for background movement
let backgroundX = 0; // Initial X position of the background
let backgroundSpeed = 1; // Speed of the background movement

// Sprite animation variables
const spriteWidth = 100; // Width of a single frame in the sprite sheet
const spriteHeight = 100; // Height of a single frame in the sprite sheet
const totalFrames = 5; // Total number of frames in the sprite sheet (adjusted for your sprite sheet)
let currentFrame = 5; // Current frame of the animation
let frameDelay = 2; // Delay between frame updates
let frameCounter = 1; // Counter to control frame updates

// Debugging: Log the character's position
function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Move the background
    backgroundX -= backgroundSpeed; // Move the background to the left
    if (backgroundX <= -canvas.width) {
        backgroundX = 0; // Reset the background position when it moves off-screen
    }

    // Draw the background twice to create a seamless loop
    ctx.drawImage(peacefulVillageBg, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(peacefulVillageBg, backgroundX + canvas.width, 0, canvas.width, canvas.height);

    // Ensure the correct background is drawn
    if (currentScreen === 1) {
        ctx.drawImage(peacefulVillageBg, 0, 0, canvas.width, canvas.height); // Draw the peaceful village GIF
    } else if (currentScreen === 2) {
        ctx.drawImage(burningVillageBg, 0, 0, canvas.width, canvas.height); // Draw the burning village image
    } else if (currentScreen === 3) {
        ctx.drawImage(villageBg, 0, 0, canvas.width, canvas.height); // Draw the updated background

        // Draw the knight moving toward Charls
        if (!knightDialogueShown && !knightFlyingAway) {
            ctx.drawImage(darkKnight, knightX, knightY, 64, 64); // Draw the knight
            knightX += knightSpeed; // Move the knight toward Charls

            if (Math.abs(knightX - charlsX) < 100) { // When the knight is near Charls
                knightDialogueShown = true; // Stop the knight's movement
                showDialogue("Dark Knight: 'The child of prophecy... I found you.'", () => {
                    oldManDisappeared = false; // Make the old man appear
                    knightFlyingAway = true; // Trigger the knight flying away
                });
            }
        }

        // Make the knight fly away after the dialogue
        if (knightFlyingAway) {
            knightY -= 5; // Move the knight upward
            knightX += 3; // Move the knight to the right
            ctx.drawImage(darkKnight, knightX, knightY, 64, 64); // Draw the knight flying away
            if (knightY + 64 < 0 || knightX > canvas.width) { // If the knight flies off the screen
                knightFlyingAway = false; // Stop drawing the knight
                startOldManDialogue(); // Start the old man's dialogue
            }
        }

        // Draw the old man if he is visible
        if (!oldManDisappeared) {
            ctx.drawImage(hermitEldren, oldManX, oldManY, 64, 64); // Draw the old man
        }
    }

    // Draw the transparent grass floor
    ctx.fillStyle = "rgba(0, 128, 0, 0)"; // Green color with 50% transparency
    ctx.fillRect(0, grassFloorY, canvas.width, grassFloorHeight);

    // Debugging: Check if the character is within the canvas bounds
    console.log(`Character position: X=${charlsX}, Y=${charlsY}`);

    // Draw Charls with sprite animation
    const spriteX = (currentFrame % 5) * spriteWidth; // Calculate the X position of the current frame
    const spriteY = Math.floor(currentFrame / 5) * spriteHeight; // Calculate the Y position for rows
    ctx.drawImage(
        charls, // Sprite sheet image
        spriteX, spriteY, spriteWidth, spriteHeight, // Source rectangle (current frame)
        charlsX, charlsY - spriteHeight, spriteWidth, spriteHeight // Destination rectangle
    );

    // Debugging: Log if the character is being drawn
    console.log("Drawing character frame:", currentFrame);

    // Update the frame for walking or jumping animation
    if (moveLeft || moveRight || isJumping) {
        frameCounter++;
        if (frameCounter >= frameDelay) {
            currentFrame = (currentFrame + 1) % totalFrames; // Loop through frames
            frameCounter = 0; // Reset the counter
        }
    } else {
        currentFrame = 0; // Reset to the first frame when idle
    }

    drawMoveRightText(); // Show "Please move right" text if applicable
    drawFireDialogue(); // Show fire dialogue if applicable

    checkScreenTransition(); // Check if Charls reaches the right edge
    requestAnimationFrame(drawScene);
}

function startOldManDialogue() {
    if (!oldManDialogueStarted) {
        oldManDialogueStarted = true;
        showDialogue("Hermit Eldren: 'Come with me, Charls! There’s no time!'", () => {
            setTimeout(() => {
                transitionToChapter2(); // Transition to Chapter 2 after the dialogue
            }, 3000); // Delay before transitioning
        });
    }
}

function transitionToChapter2() {
    let opacity = 1; // Start with full opacity
    const fadeOutInterval = setInterval(() => {
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`; // Black fade-out effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        opacity -= 0.02; // Gradually decrease opacity
        if (opacity <= 0) {
            clearInterval(fadeOutInterval); // Stop the fade-out effect
            window.location.href = "CHAPTER 2.html"; // Redirect to Chapter 2
        }
    }, 50); // Adjust the interval for smoother or faster fade-out
}

let showIntro = true; // Flag to control the intro screen
let introOpacity = 1; // Opacity for fade-out effect
let showCharlsDialogue = false; // Flag to show Charls' initial dialogue
let showTutorial = false; // Flag to control the tutorial display

function drawIntro() {
    if (showIntro) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.drawImage(peacefulVillageBg, 0, 0, canvas.width, canvas.height); // Draw the peaceful village GIF

        ctx.fillStyle = `rgba(0, 0, 0, ${introOpacity})`; // Apply fade effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Chapter 1", canvas.width / 2, canvas.height / 2 - 30);
        ctx.font = "32px Arial";
        ctx.fillText("The Fall of Charls' Village", canvas.width / 2, canvas.height / 2 + 30);

        introOpacity -= 0.01; // Gradually reduce opacity
        if (introOpacity <= 0) {
            showIntro = false; // End the intro screen
            showCharlsDialogue = true; // Trigger Charls' dialogue
            setTimeout(() => {
                showCharlsDialogue = false; // Hide dialogue after a delay
                showTutorial = true; // Trigger tutorial
                setTimeout(() => {
                    showTutorial = false; // End tutorial after a delay
                    villageBg.src = "PeacefulVillage.gif"; // Ensure the GIF is set as the background
                    drawScene(); // Start the game scene
                    allowMovement = true; // Enable movement
                    updateMovement(); // Enable movement
                }, 4000); // Show tutorial for 4 seconds
            }, 3000); // Show Charls' dialogue for 3 seconds
        } else {
            requestAnimationFrame(drawIntro);
        }
    } else if (showCharlsDialogue) {
        drawCharlsDialogue(); // Show Charls' dialogue
    } else if (showTutorial) {
        drawTutorial(); // Show movement tutorial
    }
}

function drawCharlsDialogue() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(charls, canvas.width * 0.1, canvas.height * 0.5 - 32, 64, 64); // Draw Charls on the left

    ctx.fillStyle = `rgba(255, 255, 255, ${introOpacity})`; // Apply fade effect to text
    ctx.font = "24px Arial";
    ctx.textAlign = "left";
    ctx.fillText("What a peaceful day.", canvas.width * 0.1 + 80, canvas.height * 0.5 - 20);

    introOpacity -= 0.01; // Gradually reduce opacity
    if (introOpacity <= 0) {
        showCharlsDialogue = false; // End Charls' dialogue
        showTutorial = true; // Trigger tutorial
        setTimeout(() => {
            showTutorial = false; // End tutorial after a delay
            villageBg.src = "PeacefulVillage.gif"; // Ensure the GIF is set as the background
            drawScene(); // Start the game scene
            allowMovement = true; // Enable movement
            updateMovement(); // Enable movement
        }, 4000); // Show tutorial for 4 seconds
    } else {
        requestAnimationFrame(drawCharlsDialogue);
    }
}

let currentScreen = 1; // Track the current screen
let showMoveRightText = false; // Flag to show "Please move right" text
let showFireDialogue = false; // Flag to show fire dialogue
let allowMovement = false; // Flag to enable movement

function drawTutorial() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Use Arrow Keys to Move Charls", canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText("Arrow Up: Move Up", canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText("Arrow Down: Move Down", canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText("Arrow Left: Move Left", canvas.width / 2, canvas.height / 2 + 80);
    ctx.fillText("Arrow Right: Move Right", canvas.width / 2, canvas.height / 2 + 110);

    setTimeout(() => {
        showMoveRightText = true; // Show "Please move right" text after tutorial
        allowMovement = true; // Enable movement after tutorial
    }, 4000);
}

function drawMoveRightText() {
    if (showMoveRightText) {
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Please move to the right", canvas.width / 2, canvas.height - 50);
    }
}

function checkScreenTransition() {
    if (charlsX + 64 >= canvas.width) { // If Charls reaches the right edge
        if (currentScreen === 1) {
            currentScreen = 2; // Transition to screen 2
            villageBg.src = "Burning Village.png"; // Change to burning village background
            charlsX = 0; // Reset Charls to the left side
            showMoveRightText = false; // Hide "Please move right" text
            allowMovement = false; // Disable movement temporarily
            showFireDialogue = true; // Show fire dialogue

            setTimeout(() => {
                showFireDialogue = false; // Hide fire dialogue after a delay
                allowMovement = true; // Enable movement after dialogue
            }, 3000);
        } else if (currentScreen === 2) {
            currentScreen = 3; // Transition to screen 3
            charlsX = 0; // Reset Charls to the left side
        }
    }
}

function drawFireDialogue() {
    if (showFireDialogue) {
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Charls: 'Fire... I need to hurry!'", canvas.width / 2, canvas.height / 2);
    }
}

// Start Game
peacefulVillageBg.onload = function () {
    drawIntro();
};

function startChapter1() {
    const introScreen = document.getElementById("intro-screen");
    introScreen.style.display = "none"; // Hide the intro screen
    drawIntro(); // Start the Chapter 1 intro
}