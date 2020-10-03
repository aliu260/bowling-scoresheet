# BowlingScoresheet

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.2.

## Running the Project
Requires Angular CLI version 10+ and [Node.js](https://nodejs.org/en/).

After installing Node.js, can run `npm install -g @angular-cli` to install angular. 

Navigate to the root "bowling-scoresheet" directory. 
First run `npm install` to install packages and dependencies needed to run app.
Run `ng serve` or `npm start` for a dev server. 
Navigate to `http://localhost:4200/` to view and use the app. The app will automatically reload if you change any of the source files.

Note: This app was only developed for and tested in Google Chrome. 
(Should work on most modern browsers, but no guarantees!)

## Playing a Game
1. Input player names into the text entry (2-4 players).
2. Click "start game".
3. Enter pins knocked down into the entry box that appears in the table. Enter `X` for a strike.
    Clicking away or pressing 'Enter' will automatically select the next entry box.
4. If you need to edit a previous roll, click on the number you wish to edit.
5. Click "New game" to start a new game (with new players).
6. Note: The running total is kept in the rightmost "total" column. Points from strikes and spares are only added when the full bonus is known.

## Validation
There are quite possibly cases remaining that are yet unaccounted for, but current implemented validation includes:

- Only values 0-9 and 'X' for strikes or '/' for spares are allowed to be entered.
- Strikes can be entered in either roll for standard frames, but only one is allowed (it will default set to roll 1)
- Any total pins knocked down exceeding 10 for a frame will default to a spare
- The final frame will only register a value for the third roll if a strike or spare was bowled

## Programmer Notes
This was my (Albert Liu's) first angular project, and so I readily apologize for any poorly optimized or implemented code. 
It is fully functional for any typical bowling game for 2-4 players following traditional 10-pin scoring, but there may be edge cases that could break the code if bowling rules are broken that I did not find.
Refreshing the page should reset things to a functional state.

This was developed as part of the BestBuy "code challenge". 
I had no prior experience with front end development, so I figured this could be a good opportunity to learn some angular and html.
With school and other priorities, I had limited time to dedicate to learning Angular and this project; this was started and completed within 30 hours.
This is definitely not "final state" code. Given more time (and more experience with Angular), I would refactor many elements of this code and try to clean it up: Due to learning Angular alongside coding for this project, there are some methods with overlapping functionality, as well as some that may benefit from refactoring into helper functions.  

Additional features that could be considered include starting a new game with the same players, displaying a cumulative running total, more robust validation, and tracking scores from previous games.
Styling was done through Bootstrap, which I also tried to learn about over the course of this project. As a result, the styling is very basic, and this could be another area of improvement.
