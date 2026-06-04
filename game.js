// Water facts for the end page
const waterFacts = [
    "Every 2 minutes, a child dies from a water-related disease.",
    "1 in 4 people worldwide lack access to clean, safe drinking water.",
    "It takes 37.5 liters of water to produce a single cup of coffee.",
    "Over 2 billion people live in water-stressed countries.",
    "A person can survive about 3 weeks without food, but only 3 days without water.",
    "About 97% of Earth's water is salt water, leaving only 3% as fresh water.",
    "In some developing countries, collecting water can take 6+ hours per day.",
    "Clean water and sanitation could prevent 4% of global deaths."
];

// Initialize game on game.html
if (document.body.classList.contains('game-page')) {
    let timeLeft = 30;
    let score = 0;
    let gameActive = true;

    // Start timer
    const timerElement = document.getElementById('timer');
    const collectBtn = document.getElementById('collectBtn');
    const scoreElement = document.getElementById('score');
    const scoreDisplay = document.querySelector('.score-display');
    const canWater = document.getElementById('canWater');
    const canBody = document.querySelector('.can-body');
    const waterAnimationContainer = document.getElementById('waterAnimationContainer');
    const waterDropsWrapper = document.querySelector('.water-drops');
    
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameActive = false;
            collectBtn.disabled = true;
            
            // Redirect to end page with score
            setTimeout(() => {
                window.location.href = `end.html?score=${score}`;
            }, 1500);
        }
    }, 1000);

    // Update score and jerry can fill immediately
    function updateScore() {
        score++;
        scoreElement.textContent = score;
        scoreDisplay.classList.remove('pulse');
        void scoreDisplay.offsetWidth;
        scoreDisplay.classList.add('pulse');
        const fillPercentage = Math.min(score * 1.5, 100);
        canWater.style.height = fillPercentage + '%';
        if (fillPercentage >= 100) {
            canBody.classList.add('overflow-active');
        } else {
            canBody.classList.remove('overflow-active');
        }
    }

    // Collect water function
    window.collectWater = function() {
        if (!gameActive) return;
        
        // Position the animation start under the score box
        positionWaterContainer();
        triggerWaterAnimation();
        updateScore();
        
        // Button feedback
        collectBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            collectBtn.style.transform = 'scale(1)';
        }, 100);
    };

    // Position animation container below the score box
    function positionWaterContainer() {
        const scoreBox = scoreDisplay;
        waterAnimationContainer.style.top = `${scoreBox.offsetTop + scoreBox.offsetHeight + 12}px`;
    }

    // Water animation function
    function triggerWaterAnimation() {
        const drop = document.createElement('div');
        drop.className = 'drop active';
        const dropEnd = calculateDropEnd();
        drop.style.setProperty('--drop-end', `${dropEnd}px`);
        waterDropsWrapper.appendChild(drop);
        
        drop.addEventListener('animationend', () => {
            drop.remove();
        });
    }

    function calculateDropEnd() {
        const containerRect = waterAnimationContainer.getBoundingClientRect();
        const canRect = canBody.getBoundingClientRect();
        const dropHeight = 16;
        const endTop = canRect.bottom - containerRect.top - dropHeight;
        return Math.max(endTop, 0);
    }

    // Attach button listener for play
    collectBtn.addEventListener('click', window.collectWater);
}

// Initialize end page
if (document.body.classList.contains('end-page')) {
    // Get score from URL
    const urlParams = new URLSearchParams(window.location.search);
    const finalScore = urlParams.get('score') || '0';
    
    document.getElementById('finalScore').textContent = finalScore;
    
    // Display random water fact
    const randomFact = waterFacts[Math.floor(Math.random() * waterFacts.length)];
    document.getElementById('waterFact').textContent = `${randomFact} (Source: charitywater.org)`;
}
