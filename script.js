// --- QUESTION BANK (Add your 1000+ questions here) ---
const questionBank = [
    // CG GS
    { q: "Who is considered the first martyr of Chhattisgarh?", options: ["Veer Narayan Singh", "Gundadhur", "Surendra Sai", "Hanuman Singh"], ans: 0 },
    { q: "Chitrakote Falls is located on which river?", options: ["Mahanadi", "Shivnath", "Indravati", "Hasdeo"], ans: 2 },
    { q: "Which district is known as the 'Rice Bowl of Chhattisgarh'?", options: ["Raipur", "Durg", "Janjgir-Champa", "Bastar"], ans: 2 },
    { q: "The famous 'Raut Nacha' is primarily performed by which community?", options: ["Gond", "Yadav (Yaduvanshi)", "Baiga", "Halba"], ans: 1 },
    { q: "Bhilai Steel Plant was established with the collaboration of which country?", options: ["UK", "USA", "USSR (Russia)", "Germany"], ans: 2 },
    // India GS
    { q: "Which article of the Indian Constitution deals with the Right to Equality?", options: ["Article 14-18", "Article 19-22", "Article 23-24", "Article 32"], ans: 0 },
    { q: "Who was the first Governor-General of independent India?", options: ["C. Rajagopalachari", "Lord Mountbatten", "Dr. Rajendra Prasad", "Jawaharlal Nehru"], ans: 1 },
    { q: "Which is the longest river in India?", options: ["Godavari", "Yamuna", "Brahmaputra", "Ganga"], ans: 3 },
    { q: "The Tropic of Cancer passes through how many Indian states?", options: ["6", "7", "8", "9"], ans: 2 },
    { q: "Who founded the Maurya Empire?", options: ["Ashoka", "Chandragupta Maurya", "Bindusara", "Bimbisara"], ans: 1 }
    // ... Add up to 1000 questions following this format
];

// --- APP STATE ---
let userName = "";
let battleQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let battleTimer;
let totalTime = 180; // 3 minutes = 180 seconds
let isBattleActive = false;

// --- DOM ELEMENTS ---
const screens = {
    register: document.getElementById('screen-register'),
    lobby: document.getElementById('screen-lobby'),
    battle: document.getElementById('screen-battle'),
    result: document.getElementById('screen-result')
};

// --- NAVIGATION ---
function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
        setTimeout(() => screen.classList.add('hidden'), 400); // Wait for fade out
    });
    
    setTimeout(() => {
        screens[screenName].classList.remove('hidden');
        // Small delay to trigger CSS transition
        setTimeout(() => screens[screenName].classList.add('active'), 50);
    }, 400);
}

// --- 1. REGISTRATION ---
function registerUser() {
    const input = document.getElementById('username').value.trim();
    if (!input) {
        alert("Please enter your name commander!");
        return;
    }
    userName = input;
    document.getElementById('display-name').innerText = userName;
    document.getElementById('user-info').classList.remove('hidden');
    
    showScreen('lobby');
    startLobbyCountdown();
}

// --- 2. LOBBY & COUNTDOWN TO 10:00 AM ---
function startLobbyCountdown() {
    const countdownEl = document.getElementById('countdown');
    const startBtn = document.getElementById('btn-start-battle');

    setInterval(() => {
        const now = new Date();
        let target = new Date();
        target.setHours(10, 0, 0, 0);

        // If it's past 10 AM today, next battle is tomorrow 10 AM
        if (now.getTime() > target.getTime()) {
            target.setDate(target.getDate() + 1);
        }

        const diff = target - now;

        // If it is EXACTLY 10:00 AM (within a 5-minute window)
        if (now.getHours() === 10 && now.getMinutes() < 5) {
            countdownEl.innerText = "BATTLE IS LIVE!";
            countdownEl.classList.add('text-green-400');
            startBtn.disabled = false;
            startBtn.classList.remove('bg-gray-600', 'cursor-not-allowed');
            startBtn.classList.add('bg-gradient-to-r', 'from-green-500', 'to-green-700', 'hover:from-green-400', 'hover:to-green-600');
            startBtn.innerText = "ENTER BATTLE NOW";
            return;
        }

        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        countdownEl.innerText = 
            `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }, 1000);
}

// --- 3. BATTLE LOGIC ---
function startBattle() {
    // 1. Pick 20 random questions from the bank
    let shuffled = [...questionBank].sort(() => 0.5 - Math.random());
    battleQuestions = shuffled.slice(0, 20); // Pick 20 (or less if bank is smaller than 20)
    
    // 2. Reset state
    currentQuestionIndex = 0;
    score = 0;
    totalTime = 180; 
    isBattleActive = true;

    // 3. UI Updates
    showScreen('battle');
    loadQuestion();
    startBattleTimer();
}

function startBattleTimer() {
    const timeEl = document.getElementById('time-left');
    const timerBar = document.getElementById('timer-bar');

    battleTimer = setInterval(() => {
        if (totalTime <= 0) {
            clearInterval(battleTimer);
            endBattle();
            return;
        }
        
        totalTime--;
        
        // Update Text
        const m = Math.floor(totalTime / 60);
        const s = totalTime % 60;
        timeEl.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        
        // Update Bar Width
        const percentage = (totalTime / 180) * 100;
        timerBar.style.width = `${percentage}%`;

        // Color shift to red when time is low
        if(totalTime < 30) {
            timeEl.classList.add('animate-pulse');
        }

    }, 1000);
}

function loadQuestion() {
    if (currentQuestionIndex >= battleQuestions.length) {
        endBattle();
        return;
    }

    const qData = battleQuestions[currentQuestionIndex];
    document.getElementById('q-current').innerText = currentQuestionIndex + 1;
    document.getElementById('question-text').innerText = qData.q;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = ''; // Clear previous

    qData.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = "option-btn w-full text-left p-4 bg-gray-700 rounded-lg text-lg font-medium shadow-sm hover:shadow-md";
        btn.innerText = opt;
        btn.onclick = () => handleAnswer(index, btn);
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(selectedIndex, btnElement) {
    if (!isBattleActive) return;
    
    const qData = battleQuestions[currentQuestionIndex];
    const isCorrect = (selectedIndex === qData.ans);
    
    // Disable all buttons to prevent double click
    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach(b => b.onclick = null);

    if (isCorrect) {
        btnElement.classList.add('correct');
        score++;
    } else {
        btnElement.classList.add('wrong');
        // Highlight correct answer
        allButtons[qData.ans].classList.add('correct');
    }

    // Wait 1 second, then move to next question
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 1000);
}

// --- 4. END RESULT ---
function endBattle() {
    isBattleActive = false;
    clearInterval(battleTimer);
    document.getElementById('final-score').innerText = score;
    showScreen('result');
}
