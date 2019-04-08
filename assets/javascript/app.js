/*******************************************************************************
 * Script for Totally Trivial Trivia Game
*******************************************************************************/

$(document).ready(function() {          // Wait on document to load

    let initialGame = true;             // Switch for inital game played

    /***************************************************************************
     * These arrays control the game logic and must remain synchronized. 
     * Typically these would be obtained from a database kept on the server. 
     * If new questions are added, add them to the bottom of the
     * questions array, add four choices for each new question to the choices 
     * array, and add the index of the correct answer for each new question 
     * to the answers array. 
    ***************************************************************************/
    const questions = [
        "In the year 1900 in the U.S. what were the most popular first names given to boy and girl babies?",
        "When did the Liberty Bell get its name?",
        "Who holds the record for the most victories in a row on the professional golf tour?",
        "Who is third behind Hank Aaron and Babe Ruth in major league career home runs?",
        "In 1990, in what percentage of U.S. married couples did the wife earn more than the husband?",
        "During the 1980s for six consecutive years what breed of dog was most popular in the U.S.?",
        "The first black American pictured on a U.S. postage stamp was who?",
        "The Brownie Box Camera introduced by Eastman Kodak in 1900 had a retail price of what?",
        "The Philadelphia mint started putting a 'P' mint mark on quarters when?",
        "Before becoming George Bush's Secretary of Defense, what was Dick Cheney's position?",
    ];
    const choices = [
        ["William and Elizabeth", "Joseph and Catherine", "John and Mary", "George and Anne"],
        ["when it was made, in 1701", "when it rang on July 4, 1776",
            "in the 19th century when it became a symbol of the abolition of slavery",
            "none of the above"],
        ["Jack Nicklaus", "Arnold Palmer", "Byron Nelson", "Ben Hogan"],
        ["Reggie Jackson", "Harmon Killebrew", "Willie Mays", "Frank Robinson"],
        ["8", "18", "38", "58"],
        ["cocker spaniel", "German shepherd", "Labrador retriever", "poodle"],
        ["Frederick Douglass", "Booker T. Washington", "Louis Armstrong", "Joe Louis"],
        ["$1", "$5", "$10", "$20"],
        ["1960", "1980", "1990", "never"],
        ["senator from Idaho", "governor of New Hampshire", 
            "secretary of defense under Ronald Reagan", "congressman from Wyoming"],
    ];
    const answers = [2, 2, 2, 2, 1, 0, 3, 0, 1, 3];

    /***************************************************************************
     * Variables used with the above arrays to access and control them.
    ***************************************************************************/
    let questionIndex = -1;                 // common index to all arrays
    let selected = [];                      // array tracks questions selected
    const maxRandomAttempts = 3;            // tries to select question randomly
    const choiceIDs = [                     // Element ids for answer choices
        "choice-1", "choice-2", "choice-3", "choice-4"
    ];

    /***************************************************************************
     * Variables to control timers - units are seconds
    ***************************************************************************/
    const gameInterval = 15;                // Time to finish a game
    const responseTimeout = 3;              // Time to display right/wrong ans
    const timerInterval = 1;                // Timer increments   
    let gameTimer = null;                   // Returned setTimeout variable
    let gameClock = 0;                      // Time remaining 

    /***************************************************************************
     * Variables to report scores
    ***************************************************************************/
    let answeredCorrectly = 0;              // right answers
    let answeredIncorrectly = 0;            // wrong answers
    let unansweredQuestions = 0;            // no answer - time ran out

    /***************************************************************************
     * Handle the game over condition
    ***************************************************************************/
    // Game Over - show results
    function gameOver() {
        toggleTimer();
        $("#correct-ans").text(`Correct Answers: ${answeredCorrectly}`);
        $("#incorrect-ans").text(`Incorrect Answers: ${answeredIncorrectly}`);
        $("#unanswered").text(`Unanswered: ${unansweredQuestions}`);
        toggleStartOver();                              // show results div
    }

    /***************************************************************************
     * Functions that handle the selection and display of questions
    ***************************************************************************/
    // Select a trivia question. Questions are selected randomly. Duplicate 
    // questions are eliminated. Once all questions are asked, the game ends.
    // Return: integer; -1 = all questions asked; otherwise index of question.
    function selectQuestion() {
        let idx = 0;                            // temp index

        // Attempt to make random selection
        for (let i = 0; i < maxRandomAttempts; i++) {
            idx = Math.floor(Math.random() * questions.length);
            if (selected[idx]) {                // previously selected?
                continue;                       // yes - bypass
            } else {                            // unasked question
                selected[idx] = true;           // turn on selected
                return idx;                     // return question index
            }
        }

        // Question not selected randomly, try sequentially
        for (idx = 0; idx < questions.length; idx++) {    
            if (!selected[idx]) {
                selected[idx] = true;
                return idx;                     // return 1st found
            }            
        }
        return -1;                              // All questions asked
    }

    //  Prepare the next question. Select a question randomly. If all questions
    //  have been selected, the game is over. If not, update the question and
    //  answer choices on the page.
    function nextQuestion() {
        questionIndex = selectQuestion();               // select next question
        if (questionIndex < 0) {                        // all questions asked?
            unansweredQuestions = questions.length      // Calculate unanswered  
                - answeredCorrectly - answeredIncorrectly;          
            gameOver();
        }

        // Update question box and choices
        $("#current-question").text(questions[questionIndex]);    
        for (let i = 0; i < choiceIDs.length; i++) {    
            $(`#${choiceIDs[i]}`).text(choices[questionIndex][i]);
        }
    }

    /***************************************************************************
     * Functions that process the user's selection of answers to the trivia
     * question.
    ***************************************************************************/
    // Continue the game.
    // Start a timer to delay for a few seconds, hide the calling element, 
    // select the next question, and reset the game clock.
    function continueGame(toggleFunction) {
        setTimeout(function() {                 // set delay
            toggleFunction();                   // call passed function to hide
            nextQuestion();                     // select next question
            toggleQuestion();                   // ...and show it
            resetGameClock();                   // restart the timer
        }, responseTimeout * 1000);
    }

    // User ran out of time.
    // No answer selected. Stop the timer, and show the correct answer for a few
    // seconds. Continue the game.
    function outOfTime() {
        clearInterval(gameTimer);
        let answer = choices[questionIndex][answers[questionIndex]];
        $("#timeout-answer").text(`The Correct Answer is: ${answer}`);
        toggleQuestion();
        toggleOutOfTime();
        continueGame(toggleOutOfTime);
    }

    // User selected correct answer. 
    // Stop the timer, delay a few seconds, and continue the game.
    function rightAnswer() {
        clearInterval(gameTimer);               // stop timer
        answeredCorrectly++;                    // increment score
        toggleQuestion();                       // hide question box
        toggleRightAnswer();                    // show right answer response
        continueGame(toggleRightAnswer);
    }

    // User selected incorrect answer. 
    // Stop the timer, and show the correect answer for a few seconds. Continue
    // the game.
    function wrongAnswer() {
        clearInterval(gameTimer);               // stop timer
        answeredIncorrectly++;                  // increment score
        let answer = choices[questionIndex][answers[questionIndex]];
        $("#correct-answer").text(`The Correct Answer is: ${answer}`);
        toggleQuestion();                       // hide question box
        toggleWrongAnswer();                    // show wrong answer response
        continueGame(toggleWrongAnswer);
    }

    // User clicked an answer. 
    // Determine if it is correct or incorrect.
    function validateChoice(choiceIndex) {
        if (choiceIndex === answers[questionIndex]) {
            rightAnswer();
        } else {
            wrongAnswer();
        }
    }

    /***************************************************************************
     * Show and hide elements using toggleClass. Order of calls from other game
     * functions is important to ensure the display functions correctly.
     * 
     * NOTE: INITIALLY ALL ELEMENTS TOGGLED ARE SET TO NOT DISPLAY!!!
    ***************************************************************************/
    // Toggle Start
    function toggleStart() {
        $("#start-game").toggleClass("d-none");    
    }

    // Toggle Start Over
    function toggleStartOver() {
        $("#start-over").toggleClass("d-none");
    }

    // Toggle timer
    function toggleTimer() {
        $("#time-box").toggleClass("d-none");       
    }

    // Toggle question and choices
    function toggleQuestion() {
        $("#question-box").toggleClass("d-none");   
    }

    // Toggle wrong answer
    function toggleWrongAnswer() {
        $("#wrong-answer").toggleClass("d-none");
    }

    // Toggle right answer
    function toggleRightAnswer() {
        $("#right-answer").toggleClass("d-none");
    }

    // TOggle out of time
    function toggleOutOfTime() {
        $("#out-of-time").toggleClass("d-none");
    }

    /***************************************************************************
     * Timer functions
    ***************************************************************************/       
    // Display and update time remaining in the game. Handle an out of time
    // condition if time has run out.
    function updateGameTimer() {
        gameClock--;
        $("#time-remaining").text(`Time Remaining: ${gameClock} Seconds`);
        if (gameClock <= 0) {
            outOfTime();
        }
    }

    // Reset the game clock and start an interval timer
    function resetGameClock() {
        gameClock = gameInterval;                       
        gameTimer = setInterval(updateGameTimer, (1000 * timerInterval));
    }

    /***************************************************************************
     * Event Handlers
    ***************************************************************************/   
   // User clicked Start to start a new game
   // Initialize the game. Change the start procedure from the first game to
   // successive games. Select the first question, reset the clock and start
   // the timer.
   function startGame() {
        answeredCorrectly = 0;                          // reset scores
        answeredIncorrectly = 0;
        if (initialGame) {                              // initial game?
            toggleStart();                              // yes - hide start
            initialGame = false;                        // turn off switch                         
        } else {                                        // no - successive game
            toggleStartOver();                          // hide start over
        }
        toggleTimer();                                  // Show timer
        selected.length = 0;                            // Empty selected array
        nextQuestion();                                 // Obtain & format question
        toggleQuestion();                               // Show question & answers
        resetGameClock();                               // reset clock; start timer
    }

    // One of the question choices was clicked. Obtain the choice's id and 
    // look it up in the array of choiceIDs. Pass the index of the choice to
    // the validation function.
    function choiceClicked(event) {
        let id = $(this).attr("id");
        let choiceIndex = choiceIDs.indexOf(id);
        validateChoice(choiceIndex);
    }

    // Mouse enters choice - highlight
    // Highlights the answer to be selected
    function enterChoice() {
        $(this).css("background-color", "pink");
    }

    // Mouse leaves choice - clear highlight
    // User has moved the mouse out of the choice
    function leaveChoice() {
        $(this).css("background-color", "rgb(243, 237, 148)");
    }
    
    /***************************************************************************
     * Initialize the game.
     * Set event handlers, update the time remaining element to ensure the 
     * initial time shown is in synch with the timer interval variable,
     * show the start button, and wait on the user to click Start.
    ***************************************************************************/
    $("#start-game").on("click", startGame);                // Initial Start
    $("#start-over").on("click", startGame);                // Follow-on games
    for (let i = 0; i < choiceIDs.length; i++) {            // Answers
        $(`#${choiceIDs[i]}`).on("mouseenter", enterChoice);
        $(`#${choiceIDs[i]}`).on("mouseleave", leaveChoice);
        $(`#${choiceIDs[i]}`).on("mouseup", choiceClicked);
    }
    $("#time-remaining").text(`Time Remaining: ${gameInterval} Seconds`);

    toggleStart();                                          // show Start
});