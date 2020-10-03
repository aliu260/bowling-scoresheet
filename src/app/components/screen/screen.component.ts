import {Component, OnInit} from '@angular/core';
import {Player} from '../../models/player.model';
import {Frame} from "../../models/frame.model";
import {FinalFrame} from "../../models/final-frame.model";

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent {
  players: Player[] = [];
  playerNameEntry: string;
  currentPlayer: number;
  currentFrame: number;
  currentRoll: number;
  selectedRoll: number[];
  isStarted: boolean = false;

  constructor() { }

  addPlayer(): void {
    let frames = [];
    for (let i = 0; i < 9; i++) {
      frames.push(new Frame());
    }
    frames.push(new FinalFrame());
    this.players.push(new Player({name: this.playerNameEntry, frames}));
    this.playerNameEntry = '';
  }

  startGame(): void{
    this.currentPlayer = 0;
    this.currentFrame = 0;
    this.currentRoll = 1;
    this.selectedRoll = [this.currentPlayer, this.currentFrame, this.currentRoll];
    this.isStarted = true;
  }

  onUpdate(event, pNum: number, fNum: number, rNum: number): void {
    let entry = event.target.value;
    let targetFrame = this.players[pNum].frames[fNum];
    if (entry === 'X') {  // Parse a "strike" entry
      targetFrame.isStrike = true;
      targetFrame.isSpare = false;
      entry = 10;
      if (fNum !== 9) {  // Check if it's frame 10
        targetFrame.roll2 = 0;
        targetFrame.roll1 = entry;
      } else {
        let finalFrame = targetFrame as FinalFrame;
        if (rNum === 1) {
          finalFrame.roll1 = entry;
        } else {  // If roll 2 was a strike, so was roll 1, so roll 3 should be skipped
          finalFrame.roll2 = entry;
          finalFrame.roll3 = 0;
          rNum = 3;
          this.currentRoll = 3;
        }
      }
    } else if (entry === '/') {  // Parse a "spare" entry
      targetFrame.isStrike = false;
      targetFrame.isSpare = true;
      if (rNum === 1) {
        targetFrame.roll1 = 0;
        //  If a spare is entered on the first roll, it treats roll 1 as 0 pins and roll 2 as 10, and skips to the next player
        if (this.currentPlayer === pNum && this.currentFrame === fNum && this.currentRoll ===  rNum) {
          rNum = 2;
          this.currentRoll = 2;
        }
      }
      targetFrame.roll2 = 10 - targetFrame.roll1;
    } else {
      entry = parseInt(entry);
      if (fNum !== 9) {
        targetFrame.isStrike = false;
        targetFrame.isSpare = false;
      }
      if(rNum === 1) {
        targetFrame.roll1 = entry;
      } else if (rNum === 2) {
        targetFrame.roll2 = entry;
        if (targetFrame.roll1 + entry >= 10) {  // if an invalid total for the frame is set, default to spare
          targetFrame.isSpare = true;
          targetFrame.roll2 = 10 - targetFrame.roll1;
        }
        // 3rd roll in final frame only allowed if spare or one strike is bowled
        if (targetFrame instanceof FinalFrame && (targetFrame.isStrike || targetFrame.roll1 + targetFrame.roll2 < 10)) {
          rNum = 3;
          this.currentRoll = 3;
          targetFrame.roll3 = 0;
        }
      } else if (targetFrame instanceof FinalFrame){
        targetFrame.roll3 = entry;
      }
    }

    // update the frame and cumulative total
    this.updateTotal(this.players[pNum]);
    this.goNext(pNum, fNum, rNum);
  }
  onSelect(pNum: number, fNum: number, rNum: number): void {
    this.selectedRoll = [pNum, fNum, rNum];
  }

  isSelected(pNum: number, fNum: number, rNum: number): boolean {
    return this.selectedRoll && (this.selectedRoll[0] === pNum) && (this.selectedRoll[1] === fNum) && (this.selectedRoll[2] === rNum);
  }

  keyPress(event: any) {
    const pattern = /[0-9/X]/;
    let inputChar = event.key;
    let allowedKeys = ['Backspace', 'Delete', 'Enter'];

    if (!pattern.test(inputChar) && !allowedKeys.includes(inputChar) ) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  updateTotal(player: Player): void {
    for (let i = 0; i < 9; i++) {
      let sum = 0;
      let targetFrame = player.frames[i];
      if (targetFrame.isStrike) {
        sum += 10;
        let nextFrame = player.frames[i+1];
        if (nextFrame.isStrike) {
          sum += 10;
          if (i + 1 === 9) {  // special case for strike in the 9th frame
            sum += nextFrame.roll2;
          } else {
            sum += player.frames[i + 2].roll1;
          }
        } else {
          sum += nextFrame.roll1 + nextFrame.roll2;
        }
      } else if (targetFrame.isSpare) {
        sum += 10;
        sum += player.frames[i+1].roll1;
      } else {
        sum = targetFrame.roll1 + targetFrame.roll2;
      }
      targetFrame.fTotal = sum;
    }
    // update frame 10
    let sum = 0;
    let targetFrame = player.frames[9] as FinalFrame;
    // total all 3 rolls' base values
    sum += targetFrame.roll1 + targetFrame.roll2 + targetFrame.roll3;
    if (targetFrame.isStrike) {  // add bonus points for strike
      sum += targetFrame.roll2 + targetFrame.roll3;
    } else if (targetFrame.isSpare) {  // add bonus points for spare
      sum += targetFrame.roll3;
    }
    targetFrame.fTotal = sum;
    // get cumulative total
    player.total = 0;
    for (let frame of player.frames) {
      if (frame.fTotal) {
        player.total += frame.fTotal;
      }
    }
  }

  goNext(pNum: number, fNum: number, rNum: number) {
    if (pNum !== this.currentPlayer || fNum !== this.currentFrame || rNum !== this.currentRoll) {
      this.selectedRoll = [this.currentPlayer, this.currentFrame, this.currentRoll];
    } else {
      // this section occurs when the edited roll is the same as the "next" one
      if (this.currentFrame === 9) {
        if (this.currentRoll !== 3) {
          this.currentRoll++;
        } else {
          this.currentPlayer++;
          this.currentRoll = 1;
        }
        // check for new player's turn, happens on roll two or strike
      } else if (this.currentRoll === 2 || this.players[pNum].frames[fNum].isStrike) {
        this.currentRoll = 1;
        // increment next player
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        // check if roll back to first player
        if (this.currentPlayer === 0) {
          this.currentFrame++;
        }
      } else {
        this.currentRoll++;
      }
      // increment selectedRoll to the next roll as well
      this.selectedRoll = [this.currentPlayer, this.currentFrame, this.currentRoll];
    }
  }

  reset(): void {
    this.selectedRoll = [];
    this.players = [];
    this.isStarted = false;
  }
}
