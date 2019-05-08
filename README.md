# Totally Trivial Trivia

### Overview

This application is a game of Trivia. Questions are displayed, along with a 
timer for answering. If the player selects the correct answer, a win screen
is displayed for a few seconds. If the player selected the incorrect answer,
a wrong screen is displayed for a few seconds.

Running out of time, shows an out of time screen, and is counted as an
unanswered question.

Once all questions have been displayed, a final screen with the score of right,
wrong, and unanswered questions is displayed. The user is give the option to
restart the game.

### General Approach

* Bootstrap 4 is used to manage the screens. In order to show the variety of 
screens, HTML elements are toggled between visible and invisible states.

* A data structure of associated arrays was used to tie the various elements of 
the game together, i.e. questions, answer choices, and a correct answer.

* Questions may be added, the number of choices per question increased or 
decreased, the game timer increased or decreased, and the amount of time to 
display the result without any modification of logic. Just make the changes to the 
appropriate variables.

### Link to the deployed game

[GitHub](https://rossnr3.github.io/TriviaGame/ "Totally Trivial Trivia")

