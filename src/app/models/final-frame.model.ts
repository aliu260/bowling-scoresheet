import {Frame} from './frame.model';

export class FinalFrame extends Frame {
  _roll3: number;
  roll3Display: string;
  set roll2 (val: number) {
    if (this.isStrike) {
      this.roll2Display = 'X';
    } else if (this.isSpare) {
      this.roll2Display = '/';
    } else {
      this.roll2Display = val.toString(10);
    }
    this._roll2 = val;
  }
  get roll2(): number{
    return this._roll2;
  }
  set roll3 (val: number) {
    this.roll3Display = val.toString(10);
    this._roll3 = val;
  }
  get roll3(): number{
    return this._roll3;
  }
}
