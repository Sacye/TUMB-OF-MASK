// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    const gameMenu = document.getElementById("game-menu");
    const settingsBtn = document.querySelector(".left-buttons img:nth-child(1)"); // Settings button
    let sharedAudio = window.sharedAudio;

    // Ensure sharedAudio is initialized
    if (!sharedAudio) {
        sharedAudio = new Audio("Eleven.mp3");
        sharedAudio.loop = true;
        sharedAudio.muted = localStorage.getItem("audioMuted") === "true"; // Check mute state
        window.sharedAudio = sharedAudio; // Store globally
    }

    // Function to stop the audio
    function stopAudio() {
        sharedAudio.pause(); // Pause the audio
    }

    // Function to toggle mute/unmute
    function toggleMute() {
        sharedAudio.muted = !sharedAudio.muted; // Toggle mute state
        localStorage.setItem("audioMuted", sharedAudio.muted); // Save state

        // Update the button icon
        settingsBtn.src = sharedAudio.muted ? "Unmute.png" : "Mute.png";
        settingsBtn.alt = sharedAudio.muted ? "Unmute" : "Mute";

        // Ensure audio playback stops if muted
        if (sharedAudio.muted) {
            stopAudio(); // Stop the audio when muted
        } else {
            sharedAudio.play().catch((error) => {
                console.error("Audio playback failed:", error);
            });
        }
    }

    // Attach toggleMute to the settings button
    if (settingsBtn) {
        settingsBtn.addEventListener("click", toggleMute);
    }

    // Button functionalities
    document.querySelector(".game-menu button:nth-child(1)").addEventListener("click", function () {
        //window.location.href = "MAINGAME.html";
    });

    // Removed event listener for Previous Game button

    document.querySelector(".game-menu button:nth-child(2)").addEventListener("click", function () {
        window.location.href = "Information.html";
    });

    // Left-side buttons
    document.querySelector(".left-buttons img:nth-child(2)").addEventListener("click", function () {
        window.location.href = "Contacts.html";
    });

    // Right-side button (Gallery)
    document.querySelector(".right-button img").addEventListener("click", function () {
        window.location.href = "Gallery.html";
    });
});