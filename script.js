// DOM Elements
const typingText = document.querySelector(".typing-text p");
const inputField = document.querySelector(".input-field");
const timeTag = document.querySelector(".timer-value");
const wpmTag = document.querySelectorAll(".wpm-value");
const accuracyTag = document.querySelectorAll(".accuracy-value");
const restartBtn = document.querySelector(".restart");
const timeSelect = document.querySelector("#time");
const difficultySelect = document.querySelector("#difficulty");
const charactersTag = document.querySelector(".characters");
const errorsTag = document.querySelector(".errors");

// Variables
let timer;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = 0;
let mistakes = 0;
let isTyping = false;
let totalChars = 0;

// Paragraph collections by difficulty
const paragraphs = {
    easy: [
        "Durga is building his skills to become a full stack developer in the future.",
        "Every evening, Durga practices typing and programming to get better.",
        "Durga is passionate about web design, backend logic, and learning new tools.",
        "Durga's college often gives chances to present creative tech ideas.",
        "With dedication and practice, Durga is becoming a confident coder."
    ],
    medium: [
        "Durga Sankar Das, an aspiring full stack developer from Global Group of Institutions, spends hours perfecting his craft — from frontend elegance to backend logic.",
        "Consistency, curiosity, and confidence,” he believes, “are the keys to mastering any programming language, even C++!",
        "While he had no prior experience in programming, his journey is now filled with projects, presentations, and continuous learning.",
        "Despite initial nervousness during interviews, Durga's structured responses and strong English skills always make an impression.",
        "From PowerPoint creativity to building fully functional typing websites — Durga's growth reflects both passion and purpose."
    ],
    hard: [
        "The intricate relationship between technological advancement and socioeconomic disparities presents a multifaceted challenge requiring interdisciplinary collaboration to establish equitable frameworks for development.",
        "Neuroscientists hypothesize that metacognition—our awareness of cognitive processes—may emerge from specialized neural networks in the prefrontal cortex that monitor and evaluate other brain activities.",
        "Implementing cryptographic protocols with quantum-resistant algorithms has become imperative as quantum computing threatens traditional encryption methods, potentially compromising cybersecurity infrastructure globally.",
        "The anthropogenic acceleration of carbon dioxide emissions has precipitated unprecedented climate fluctuations, manifesting in extreme weather events, biodiversity loss, and disruption of ecological equilibria worldwide.",
        "Philosophical discussions regarding artificial consciousness often distinguish between functionalism—where consciousness emerges from specific computational arrangements—and phenomenological approaches emphasizing subjective experience."
    ]
};

// Function to load a random paragraph based on difficulty
function loadParagraph() {
    const difficulty = difficultySelect.value;
    const ranIndex = Math.floor(Math.random() * paragraphs[difficulty].length);
    typingText.innerHTML = "";
    
    // Split selected paragraph into characters and create span for each
    paragraphs[difficulty][ranIndex].split("").forEach(char => {
        let span = `<span>${char}</span>`;
        typingText.innerHTML += span;
    });
    
    // Set first character as active
    typingText.querySelectorAll("span")[0].classList.add("active");
    
    // Focus input field on click
    document.addEventListener("click", () => inputField.focus());
    typingText.addEventListener("click", () => inputField.focus());
    inputField.focus();
}

// Function to handle typing
function initTyping() {
    const characters = typingText.querySelectorAll("span");
    const typedChar = inputField.value.charAt(charIndex);
    
    if (charIndex < characters.length && timeLeft > 0) {
        // Start timer once user starts typing
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        
        // If user hasn't typed anything or backspace is pressed
        if (typedChar == null) {
            charIndex--;
            // Remove incorrect class when backspace is pressed
            if (characters[charIndex].classList.contains("incorrect")) {
                mistakes--;
            }
            characters[charIndex].classList.remove("correct", "incorrect");
        } else {
            // Check if typed character matches the target character
            if (characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
            totalChars++;
        }
        
        // Remove active class from previous and add to current character
        characters.forEach(span => span.classList.remove("active"));
        if (charIndex < characters.length) {
            characters[charIndex].classList.add("active");
        }
        
        // Calculate WPM
        // WPM formula: (total characters / 5) / time in minutes
        // 5 characters = average word length
        const timeElapsed = (maxTime - timeLeft) / 60;
        const wpm = Math.round((charIndex - mistakes) / 5 / (timeElapsed || 1));
        // Prevent showing infinity or negative values
        wpmTag.forEach(tag => tag.innerText = wpm > 0 ? wpm : 0);
        
        // Calculate accuracy
        const accuracy = Math.round(((charIndex - mistakes) / (charIndex || 1)) * 100);
        accuracyTag.forEach(tag => tag.innerText = accuracy);
        
        // Update characters and errors count
        charactersTag.innerText = charIndex;
        errorsTag.innerText = mistakes;
    } else {
        // Stop timer if all characters are typed
        clearInterval(timer);
        inputField.value = "";
    }
}

// Timer function
function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        
        // Calculate WPM as time passes
        const timeElapsed = (maxTime - timeLeft) / 60;
        const wpm = Math.round((charIndex - mistakes) / 5 / (timeElapsed || 1));
        wpmTag.forEach(tag => tag.innerText = wpm > 0 ? wpm : 0);
    } else {
        // Stop timer when time is up
        clearInterval(timer);
        inputField.disabled = true;
    }
}

// Function to reset the game
function resetGame() {
    loadParagraph();
    clearInterval(timer);
    timeLeft = parseInt(timeSelect.value);
    maxTime = timeLeft;
    charIndex = mistakes = isTyping = 0;
    totalChars = 0;
    inputField.value = "";
    inputField.disabled = false;
    timeTag.innerText = timeLeft;
    wpmTag.forEach(tag => tag.innerText = 0);
    accuracyTag.forEach(tag => tag.innerText = 0);
    charactersTag.innerText = 0;
    errorsTag.innerText = 0;
    inputField.focus();
}

// Event Listeners
timeSelect.addEventListener("change", () => {
    timeLeft = parseInt(timeSelect.value);
    maxTime = timeLeft;
    timeTag.innerText = timeLeft;
});

difficultySelect.addEventListener("change", resetGame);
restartBtn.addEventListener("click", resetGame);
inputField.addEventListener("input", initTyping);

// Initialize on load
loadParagraph();
