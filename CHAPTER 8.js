const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load images
const finalBattleBg = new Image();
finalBattleBg.src = "Portal.png";

const charls = new Image();
charls.src = "Main Character Mask Normal.png";

const abyssKing = new Image();
abyssKing.src = "abyss king final form.png";

// Background Music
let bgMusic = document.getElementById("bg-music");
bgMusic.volume = 0.5;

// Character Stats
let charlsHP = 100;
let abyssKingHP = 300;
let charlsX = canvas.width * 0.2, charlsY = canvas.height * 0.6;
let bossX = canvas.width * 0.5, bossY = canvas.height * 0.4;
let speed = 5;
let moveUp = false, moveDown = false, moveLeft = false, moveRight = false;
let isAttacking = false;
let isCastingMagic = false;

// Ensure images are loaded before starting the game
let imagesLoaded = 0;
const totalImages = 3;

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        showIntro();
    }
}

finalBattleBg.onload = checkImagesLoaded;
charls.onload = checkImagesLoaded;
abyssKing.onload = checkImagesLoaded;

// Keyboard Controls (PC)
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") moveUp = true;
    if (event.key === "ArrowDown") moveDown = true;
    if (event.key === "ArrowLeft") moveLeft = true;
    if (event.key === "ArrowRight") moveRight = true;
    if (event.key === "Space") attackBoss();
    if (event.key === "M") castUltimate();
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
document.getElementById("attack").addEventListener("touchstart", attackBoss);
document.getElementById("magic").addEventListener("touchstart", castUltimate);

// Attack Function
function attackBoss() {
    if (!isAttacking) {
        isAttacking = true;
        if (Math.abs(charlsX - bossX) < 80 && Math.abs(charlsY - bossY) < 80) {
            abyssKingHP -= 20;
            if (abyssKingHP <= 0) {
                triggerFinalChoice();
            }
        }
        setTimeout(() => isAttacking = false, 500);
    }
}

// Ultimate Attack
function castUltimate() {
    if (!isCastingMagic) {
        isCastingMagic = true;
        if (Math.abs(charlsX - bossX) < 120 && Math.abs(charlsY - bossY) < 120) {
            abyssKingHP -= 50;
            if (abyssKingHP <= 0) {
                triggerFinalChoice();
            }
        }
        setTimeout(() => isCastingMagic = false, 1000);
    }
}

// Dialogue Data
const dialogues = {
    opening: {
        abyssKing: "So… you have come at last. Tell me, why do you stand before me?",
        choices: [
            {
                text: "I came to end this. The Abyss must be sealed forever.",
                abyssKingResponse: "End this? You think you can erase what has existed since the dawn of time?",
                charlsResponse: "The Abyss only exists because of the suffering you have caused.",
                abyssKingFinal: "No… the Abyss exists because the world demanded it. Because mortals, time and time again, sought power they could not control.",
                outcome: "defiant"
            },
            {
                text: "I want to understand. Why did you create the Abyss?",
                abyssKingResponse: "At last… someone who does not simply swing their blade without knowing why. The Abyss was not meant to destroy. It was meant to contain destruction itself.",
                charlsResponse: "Then why do you allow it to consume everything?",
                abyssKingFinal: "Because destruction is inevitable. The Abyss does not take—it only welcomes those who choose to fall into it.",
                outcome: "curious"
            },
            {
                text: "The Abyss is power. I want it for myself.",
                abyssKingResponse: "Ah… finally, someone who understands. You do not wish to destroy it. You do not fear it. But do you have the will to claim it?",
                charlsResponse: "If power is all that matters, then I will take it.",
                abyssKingFinal: "Then step forward… and prove you are worthy.",
                outcome: "power"
            }
        ]
    },
    midway: {
        defiant: {
            abyssKing: "You cling to the illusion of light, yet you stand here, in the heart of darkness. Do you not see the contradiction in your resolve?",
            charls: "Light and darkness are choices, not destinies. And I have made mine.",
            abyssKingFinal: "Then let us see if you can withstand the weight of your choice."
        },
        curious: {
            abyssKing: "Long ago, the gods abandoned this world. The Abyss was all that remained, a force that could consume or create, depending on the hands that held it.",
            charls: "Then why did you choose to let it consume?",
            abyssKingFinal: "Because I learned the truth… that in the end, all things fall to the Abyss. It is only a matter of time."
        },
        power: {
            abyssKing: "You remind me of myself, long ago. Desperate, ambitious… but lacking the will to act without hesitation.",
            charls: "I do not hesitate. If the Abyss is meant to rule, then I will be the one to wield it.",
            abyssKingFinal: "Then come. Let the Abyss claim you, or let it break you."
        }
    }
};

// Display Dialogue
function displayDialogue(character, dialogue, choices = [], nextCallback = null) {
    const dialogueBox = document.getElementById("dialogue-box");
    const dialogueText = document.getElementById("dialogue-text");

    // Ensure the dialogue box is visible
    dialogueBox.style.display = "block";

    // Set the character name and dialogue text
    dialogueText.innerHTML = `
        <span class="character-name">${character}</span><br>
        <span class="dialogue-text">${dialogue}</span>
    `;

    // Clear existing buttons
    const choicesContainer = document.createElement("div");
    choicesContainer.classList.add("choices");
    dialogueBox.querySelectorAll(".choices").forEach(container => container.remove());

    // Add choice buttons with styled labels if provided
    const labels = ["A", "B", "C"];
    choices.forEach((choice, index) => {
        const choiceContainer = document.createElement("div");
        choiceContainer.classList.add("choice-container");

        const label = document.createElement("div");
        label.classList.add("choice-label");
        label.innerText = labels[index]; // Assign labels A, B, C

        const button = document.createElement("button");
        button.classList.add("choice");
        button.innerText = choice.text;
        button.onclick = () => handleChoice(choice);

        choiceContainer.appendChild(label);
        choiceContainer.appendChild(button);
        choicesContainer.appendChild(choiceContainer);
    });

    // Append choices to the dialogue box
    if (choices.length > 0) {
        dialogueBox.appendChild(choicesContainer);
    }

    // Add "Next" button if a callback is provided
    const nextButton = document.createElement("button");
    nextButton.classList.add("next-button");
    nextButton.innerText = "Next";
    nextButton.style.display = nextCallback ? "block" : "none";
    nextButton.onclick = nextCallback;

    // Remove any existing next button and append the new one
    dialogueBox.querySelectorAll(".next-button").forEach(button => button.remove());
    dialogueBox.appendChild(nextButton);
}

// Handle Choice
function handleChoice(choice) {
    displayDialogue("Abyss King", choice.abyssKingResponse, [], () => {
        displayDialogue("Charls", choice.charlsResponse, [], () => {
            displayDialogue("Abyss King", choice.abyssKingFinal, [], () => {
                handleMidway(choice.outcome);
            });
        });
    });
}

// Handle Midway Dialogue
function handleMidway(outcome) {
    const midwayDialogue = dialogues.midway[outcome];
    displayDialogue("Abyss King", midwayDialogue.abyssKing, [], () => {
        displayDialogue("Charls", midwayDialogue.charls, [], () => {
            displayDialogue("Abyss King", midwayDialogue.abyssKingFinal, [], triggerFinalChoice);
        });
    });
}

// Trigger Final Choice
function triggerFinalChoice() {
    const choiceBox = document.getElementById("choice-box");
    choiceBox.style.display = "block";
}

// Handle Endings
function chooseEnding(choice) {
    if (choice === 'good') {
        alert("Good Ending: Charls seals the Mask, saving the world.");
    } else if (choice === 'neutral') {
        alert("Neutral Ending: Charls keeps the power, but at what cost?");
    } else {
        alert("Bad Ending: Charls embraces the Abyss and becomes the next dark ruler.");
    }
    window.location.href = "POST GAME.html"; // Leads to free exploration mode
}

// Movement Update
function updateMovement() {
    if (moveUp) charlsY -= speed;
    if (moveDown) charlsY += speed;
    if (moveLeft) charlsX -= speed;
    if (moveRight) charlsX += speed;

    requestAnimationFrame(updateMovement);
}

// Draw Scene
function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(finalBattleBg, 0, 0, canvas.width, canvas.height); // Draw background
    ctx.drawImage(charls, charlsX, charlsY, 100, 100); // Draw Charls
    if (abyssKingHP > 0) ctx.drawImage(abyssKing, bossX, bossY, 180, 180); // Draw Abyss King

    requestAnimationFrame(drawScene);
}

// Show Introduction Screen
function showIntro() {
    const introScreen = document.getElementById("intro-screen");
    const gameCanvas = document.getElementById("gameCanvas");
    const mobileControls = document.getElementById("mobile-controls");

    setTimeout(() => {
        introScreen.style.display = "none";
        gameCanvas.style.display = "block";
        mobileControls.style.display = "flex";

        bgMusic.play();
        drawScene(); // Ensure the background is drawn before dialogue starts
        startOpeningDialogue();
    }, 3000); // Show intro for 3 seconds
}

// Start Opening Dialogue
function startOpeningDialogue() {
    const opening = dialogues.opening;
    displayDialogue("Abyss King", opening.abyssKing, opening.choices);
}

// Start Game
function startGame() {
    drawScene();
    updateMovement();
}

// Initialize Game
window.onload = () => {
    console.log("Game initialized");
};