export class Frame {
  _roll1: number;
  _roll2: number;
  roll1Display: string;
  roll2Display: string;
  fTotal: number;
  isStrike = false;
  isSpare = false;

  set roll1 (val: number) {
    if (this.isStrike) {
      this.roll1Display = 'X';
    } else {
      this.roll1Display = val.toString(10);
    }
    this._roll1 = val;
  }

  get roll1(): number{
    return this._roll1;
  }

  set roll2 (val: number) {
    if (this.isStrike) {
      this.roll2Display = '';
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

}

