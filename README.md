# TriviaGame
# JavaScript Assignment 2

### Overview

This assignment involves creating a Trivia game using JavaScript for the logic and jQuery to manipulate HTML. 

### The Submission contains Option Two: Advanced Assignment (Timed Questions) 

![Advanced](Images/2-advanced.jpg)

* The trivia game shows one question until the player selects an answer or time runs out. Each question restarts a timer.

* If the player selects the correct answer, a win screen is shown for a few seconds, then the next question is displayed without user input.

* The scenario is the same with different screens shown for wrong answers and time-outs. When these occur, the correct answer is also displayed.

* Once all questions have been displayed, the final screen showing the number of correct answers, incorrect answers, unanswered questions, and an option to restart the game is displayed.

### General Logic Applied

* Bootstrap 4 is used to manage the screens. In order to show the variety of screens, HTML elements are toggled between visible and invisible states.

* A data structure of associated arrays was used to tie the various elements of the game together, i.e. questions, answer choices, and a correct answer.

* Questions may be added, the number of choices per question increased or decreased, the game timer increased or decreased, and the amount of time to display the result without any modification of logic. Just make the changes to the appropriate variables.
