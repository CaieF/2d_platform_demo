export class Constant {
  static readonly ColliderGroup = {
    DEFAULT: 1 << 0,
    PLAYER: 1 << 1,
    WALL: 1 << 2
  }

  static readonly PlayerStatus = {
    IDLE: 0,
    RUN: 1,
    JUMP: 2
  }
}