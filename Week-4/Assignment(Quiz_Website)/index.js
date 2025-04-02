const questionElement = document.getElementById("Question");
const questionNoElement = document.getElementById("QuestionNumber");
const optionsContainer = document.getElementById("options-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const hintIcon = document.getElementById("hint-icon");
const hintText = document.getElementById("hint-text");
const paginationContainer = document.getElementById("pagination");
const hintsCountElement = document.getElementById("hints-count");
const resultContainer = document.getElementById("result-container");
const scoreDisplay = document.getElementById("score-display");
const restartBtn = document.getElementById("restart-btn");
const startContainer = document.getElementById("start-container");
const startBtn = document.getElementById("start-btn");
const themeToggle = document.getElementById("theme-toggle");

let hints = 0;
let theme = "dark";
let currentQuestion = 0;
let selectedOptions = new Array(5).fill(null);
let answeredQuestions = new Array(5).fill(false);
let showingResults = false;
let quizStarted = false;

const questions = [
    {
        question: "What does the acronym 'HTTP' stand for?",
        options: [
            { option: "A) Hypertext Transfer Protocol", correct: true },
            { option: "B) High Tech Transfer Protocol", correct: false },
            { option: "C) Hyper Transfer Text Protocol", correct: false },
            { option: "D) Hyperlink Text Protocol", correct: false }
        ],
        hint: "It's the protocol used for transferring web pages on the internet."
    },
    {
        question: "Which company developed the first smartphone with a touchscreen?",
        options: [
            { option: "A) Apple", correct: false },
            { option: "B) Nokia", correct: false },
            { option: "C) IBM", correct: true },
            { option: "D) Samsung", correct: false }
        ],
        hint: "The first touchscreen phone was launched by IBM in 1994, well before the iPhone."
    },
    {
        question: "What does 'AI' stand for in the field of technology?",
        options: [
            { option: "A) Automated Integration", correct: false },
            { option: "B) Artificial Intelligence", correct: true },
            { option: "C) Augmented Input", correct: false },
            { option: "D) Applied Innovation", correct: false }
        ],
        hint: "It's the branch of computer science that focuses on creating machines that can perform tasks that typically require human intelligence."
    },
    {
        question: "Which programming language is primarily used for Android app development?",
        options: [
            { option: "A) Java", correct: true },
            { option: "B) Python", correct: false },
            { option: "C) Ruby", correct: false },
            { option: "D) C#", correct: false }
        ],
        hint: "It's one of the most popular languages for Android and was developed by Sun Microsystems (now owned by Oracle)."
    },
    {
        question: "What is the main function of a GPU in a computer?",
        options: [
            { option: "A) To process images and videos", correct: true },
            { option: "B) To increase the computer's storage", correct: false },
            { option: "C) To handle internet connections", correct: false },
            { option: "D) To run operating systems", correct: false }
        ],
        hint: "GPUs are crucial for rendering graphics, often used in gaming and professional design software."
    }
];

function init() {
    loadFromLocalStorage();
    createPaginationIndicators();
    loadQuestion();
    setupEventListeners();
    updateThemeToggleIcon();
    if (!quizStarted) {
        startContainer.classList.remove('hidden');
    } else {
        startContainer.classList.add('hidden');
    }
}

function loadFromLocalStorage() {
    if (!localStorage.getItem("hints")) {
        hints = 3;
        localStorage.setItem("hints", hints);
    } else {
        hints = parseInt(localStorage.getItem("hints"));
    }
    
    if (!localStorage.getItem("current-question")) {
        localStorage.setItem("current-question", currentQuestion);
    } else {
        currentQuestion = parseInt(localStorage.getItem("current-question"));
    }
    
    if (!localStorage.getItem("theme")) {
        localStorage.setItem("theme", "dark");
        theme = "dark";
    } else {
        theme = localStorage.getItem("theme");
        document.body.classList.remove('dark', 'light');
        document.body.classList.add(theme);
    }
    
    if (localStorage.getItem("selected-options")) {
        selectedOptions = JSON.parse(localStorage.getItem("selected-options"));
    }
    
    if (localStorage.getItem("answered-questions")) {
        answeredQuestions = JSON.parse(localStorage.getItem("answered-questions"));
    }
    
    if (localStorage.getItem("quiz-started")) {
        quizStarted = JSON.parse(localStorage.getItem("quiz-started"));
    }
    
    hintsCountElement.textContent = `Hints: ${hints}`;
}

function createPaginationIndicators() {
    paginationContainer.innerHTML = '';
    
    for (let i = 0; i < questions.length; i++) {
        const indicator = document.createElement('div');
        indicator.dataset.index = i;
        if (i === currentQuestion) {
            indicator.classList.add('active');
        }
        if (answeredQuestions[i]) {
            indicator.style.borderColor = '#4f46e5';
        }
        
        indicator.addEventListener('click', () => {
            navigateToQuestion(i);
        });
        
        paginationContainer.appendChild(indicator);
    }
}

function loadQuestion() {
    questionNoElement.textContent = `Question ${currentQuestion + 1}`;
    questionElement.textContent = questions[currentQuestion].question;
    
    hintText.classList.add('hidden');
    
    generateOptions();
    
    updateNavigationButtons();
    
    updatePaginationIndicators();
}

function generateOptions() {
    optionsContainer.innerHTML = '';
    
    questions[currentQuestion].options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-container';
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.id = `option_${index}`;
        input.name = 'quiz_option';
        
        const label = document.createElement('label');
        label.htmlFor = `option_${index}`;
        label.className = 'flex-1 cursor-pointer';
        label.textContent = option.option;
        
        if (selectedOptions[currentQuestion] === index) {
            optionDiv.classList.add('selected');
            input.checked = true;
            
            if (answeredQuestions[currentQuestion]) {
                if (option.correct) {
                    optionDiv.classList.add('correct');
                } else {
                    optionDiv.classList.add('incorrect');
                }
            }
        }
        
        optionDiv.addEventListener('click', () => {
            selectOption(index, optionDiv);
        });
        
        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        optionsContainer.appendChild(optionDiv);
    });
}

function selectOption(index, optionDiv) {
    if (answeredQuestions[currentQuestion]) return;
    
    const options = optionsContainer.querySelectorAll('.option-container');
    options.forEach(opt => opt.classList.remove('selected'));
    
    optionDiv.classList.add('selected');
    
    const radioBtn = document.getElementById(`option_${index}`);
    radioBtn.checked = true;
    
    selectedOptions[currentQuestion] = index;
    localStorage.setItem("selected-options", JSON.stringify(selectedOptions));
    
    answeredQuestions[currentQuestion] = true;
    localStorage.setItem("answered-questions", JSON.stringify(answeredQuestions));
    
    showAnswerFeedback();
    
    updatePaginationIndicators();
}

function showAnswerFeedback() {
    const options = optionsContainer.querySelectorAll('.option-container');
    
    options.forEach((optionDiv, index) => {
        if (questions[currentQuestion].options[index].correct) {
            optionDiv.classList.add('correct');
        } else if (selectedOptions[currentQuestion] === index) {
            optionDiv.classList.add('incorrect');
        }
    });
}

function updateNavigationButtons() {
    prevBtn.disabled = currentQuestion === 0;
    
    if (currentQuestion === questions.length - 1) {
        nextBtn.textContent = 'Finish';
    } else {
        nextBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
    }
}

function updatePaginationIndicators() {
    const indicators = paginationContainer.querySelectorAll('div');
    
    indicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        
        if (index === currentQuestion) {
            indicator.classList.add('active');
        }
        
        if (answeredQuestions[index]) {
            indicator.style.borderColor = '#4f46e5';
        }
    });
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        localStorage.setItem("current-question", currentQuestion);
        loadQuestion();
    } else {
        showResults();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        localStorage.setItem("current-question", currentQuestion);
        loadQuestion();
    }
}

function navigateToQuestion(index) {
    currentQuestion = index;
    localStorage.setItem("current-question", currentQuestion);
    loadQuestion();
}

function showHint() {
    if (hints > 0) {
        hintText.textContent = questions[currentQuestion].hint;
        hintText.classList.remove('hidden');
        
        hints--;
        localStorage.setItem("hints", hints);
        hintsCountElement.textContent = `Hints: ${hints}`;
    } else {
        alert('You have no hints left!');
    }
}

function showResults() {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
        if (selectedOptions[i] !== null && questions[i].options[selectedOptions[i]].correct) {
            score++;
        }
    }
    
    scoreDisplay.textContent = `Your score: ${score}/${questions.length}`;
    
    resultContainer.classList.remove('hidden');
    showingResults = true;
}

function restartQuiz() {
    currentQuestion = 0;
    selectedOptions = new Array(5).fill(null);
    answeredQuestions = new Array(5).fill(false);
    hints = 3;
    
    localStorage.setItem("current-question", currentQuestion);
    localStorage.setItem("selected-options", JSON.stringify(selectedOptions));
    localStorage.setItem("answered-questions", JSON.stringify(answeredQuestions));
    localStorage.setItem("hints", hints);
    
    resultContainer.classList.add('hidden');
    showingResults = false;
    
    hintsCountElement.textContent = `Hints: ${hints}`;
    
    loadQuestion();
    createPaginationIndicators();
}

function startQuiz() {
    quizStarted = true;
    localStorage.setItem("quiz-started", JSON.stringify(quizStarted));
    startContainer.classList.add('hidden');
}

function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
    updateThemeToggleIcon();
}

function updateThemeToggleIcon() {
    if (theme === 'dark') {
        themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
    } else {
        themeToggle.innerHTML = '<i class="bi bi-moon-fill"></i>';
    }
}

function setupEventListeners() {
    nextBtn.addEventListener('click', nextQuestion);
    prevBtn.addEventListener('click', prevQuestion);
    
    hintIcon.addEventListener('click', showHint);
    
    restartBtn.addEventListener('click', restartQuiz);
    
    startBtn.addEventListener('click', startQuiz);
    
    themeToggle.addEventListener('click', toggleTheme);
    
    document.addEventListener('keydown', (e) => {
        if (showingResults || !quizStarted) return;
        
        if (e.key === 'ArrowRight') {
            nextQuestion();
        } else if (e.key === 'ArrowLeft') {
            prevQuestion();
        } else if (e.key >= '1' && e.key <= '4') {
            const index = parseInt(e.key) - 1;
            const options = optionsContainer.querySelectorAll('.option-container');
            if (options[index]) {
                options[index].click();
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', init);