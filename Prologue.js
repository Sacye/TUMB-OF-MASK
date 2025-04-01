const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load images
const templeBg = new Image();
templeBg.src = "Tombofmask.png";  

const elder1 = new Image();
elder1.src = "Hermit Eldren Normal.png";  

const elder2 = new Image();
elder2.src = "Hermit Eldren Normal.png";  

const abyssKing = new Image();
abyssKing.src = "Abys king.png";  

// Background Music
let bgMusic = document.getElementById("bg-music");
bgMusic.volume = 0.5;
bgMusic.play();

// Sound Effects shake
const templeShakeSfx = new Audio("templeShake.mp3");

// Sound Effect for Abyss King
const abyssKingSfx = new Audio("Abys king 1.mp3");

let sceneStep = 0;
const dialogue = [
    "'The time has come, Lirien... The Abyss grows stronger.-Elder Veylan: '",
    "'We must seal the Tomb of Mask before it’s too late!-Elder Lirien:'",
    "'FOOLS! You think your magic can stop ME?!-Abyss King:'",
    "The temple shakes violently as the seal is completed..."
];

// Debug canvas rendering
function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Debug: Draw a rectangle to confirm canvas rendering
    ctx.fillStyle = "red";
    ctx.fillRect(10, 10, 100, 50);

    // Draw background image
    ctx.drawImage(templeBg, 0, 0, canvas.width, canvas.height);

    if (sceneStep === 0) {
        ctx.drawImage(elder1, canvas.width * 0.3, canvas.height * 0.5, 100, 100);
        ctx.drawImage(elder2, canvas.width * 0.6, canvas.height * 0.5, 100, 100);
    } else if (sceneStep === 2) {
        ctx.drawImage(abyssKing, canvas.width * 0.45, canvas.height * 0.4, 150, 150);
    }

    requestAnimationFrame(drawScene);
}

// Add play/pause functionality for background music with image toggle
function toggleMusic() {
    const musicButton = document.getElementById("music-toggle");
    if (bgMusic.paused) {
        bgMusic.play();
        musicButton.classList.remove("play");
    } else {
        bgMusic.pause();
        musicButton.classList.add("play");
    }
}

// Enhance temple shaking effect
function playShakeEffect() {
    templeShakeSfx.play();
    canvas.classList.add("shake");
    setTimeout(() => canvas.classList.remove("shake"), 500); // Remove shake effect after 500ms
}

// Adjust dialogue box position dynamically
function updateDialoguePosition() {
    const dialogueBox = document.getElementById("dialogue-box");
    if (sceneStep === 0) {
        dialogueBox.style.left = "30%"; // Near Elder Veylan
        dialogueBox.style.bottom = "60%"; // Move higher above Elder Veylan
        dialogueBox.setAttribute("data-position", "left"); // Triangle points left
    } else if (sceneStep === 1) {
        dialogueBox.style.left = "20%"; // Near Elder Lirien
        dialogueBox.style.bottom = "60%"; // Move higher above Elder Lirien
        dialogueBox.setAttribute("data-position", "right"); // Triangle points right
    } else if (sceneStep === 2) {
        dialogueBox.style.left = "50%"; // Near Abyss King
        dialogueBox.style.bottom = "75%"; // Move higher above Abyss King
        dialogueBox.setAttribute("data-position", "center"); // Triangle points center
    }
}

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

// Update nextDialogue to use typewriter effect
function nextDialogue() {
    sceneStep++;
    const dialogueText = document.getElementById("dialogue-text");
    const dialogueBox = document.getElementById("dialogue-box");
    dialogueBox.classList.remove("show-next"); // Hide "Next" button
    if (sceneStep < dialogue.length) {
        updateDialoguePosition();
        if (sceneStep === 2) abyssKingSfx.play(); // Play Abyss King's sound
        if (sceneStep === 3) playShakeEffect(); // Play shaking sound and effect
        typeWriter(dialogue[sceneStep], dialogueText); // Use typewriter effect
    } else {
        dialogueBox.style.display = "none";
        window.location.href = "CHAPTER 1.html"; // Move to next chapter
    }
}

// Detect mobile devices and toggle control button visibility
function toggleControlButton() {
    const musicButton = document.getElementById("music-toggle");
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    musicButton.style.display = isMobile ? "block" : "none";
}

// Adjust startPrologue to position dialogue box initially and delay background music
function startPrologue() {
    const dialogueBox = document.getElementById("dialogue-box");
    dialogueBox.style.display = "block";
    updateDialoguePosition();

    // Display the introduction dialogue first
    typeWriter(dialogue[0], document.getElementById("dialogue-text"), () => {
        // Play background music after the introduction is complete
        bgMusic.play().then(() => {
            console.log("Background music started successfully after introduction.");
        }).catch((error) => {
            console.error("Failed to play background music:", error);
            // Show the music toggle button to allow manual play
            const musicButton = document.getElementById("music-toggle");
            musicButton.style.display = "block";
            musicButton.innerText = "Play Music";
        });
    });
}

// Automatically play background music with fallback
function autoPlayMusic() {
    bgMusic.play().then(() => {
        console.log("Background music started successfully.");
    }).catch(() => {
        console.warn("Autoplay blocked. Prompting user to play music manually.");
        const musicButton = document.getElementById("music-toggle");
        musicButton.style.display = "block"; // Show the music toggle button
        musicButton.innerText = "Play Music"; // Update button text
        musicButton.onclick = () => {
            bgMusic.play().then(() => {
                console.log("Background music started after user interaction.");
                musicButton.style.display = "none"; // Hide button after successful play
            }).catch((error) => {
                console.error("Failed to play background music:", error);
            });
        };
    });
}

// Add error handling for templeBg
templeBg.onload = function () {
    console.log("Background image loaded successfully.");
    drawScene();
    startPrologue();
};

templeBg.onerror = function () {
    console.error("Failed to load background image. Check the file path: Tombofmask.png");
};

// Add error handling for other images
elder1.onerror = () => console.error("Failed to load elder1 image. Check the file path: Oldman.png");
elder2.onerror = () => console.error("Failed to load elder2 image. Check the file path: Oldman.png");
abyssKing.onerror = () => console.error("Failed to load Abyss King image. Check the file path: Abys king.png");

// Function to check query parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Play sound if "playSound" query parameter is present
window.onload = function () {
    toggleControlButton();

    // Initialize bgMusic after DOM is fully loaded
    bgMusic = document.getElementById("bg-music");

    // Attempt to autoplay music
    autoPlayMusic();

    templeBg.onload = function () {
        drawScene();
        startPrologue();
    };
};
