import { Frame } from './frame.model';

export class Player {
  name: string;
  frames: Frame[];
  total: number;
  constructor(init: Partial<Player>) {
    Object.assign(this, init);
  }
}
