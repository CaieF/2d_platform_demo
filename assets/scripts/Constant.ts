export class Constant {
  static readonly ColliderGroup = {
    DEFAULT: 1 << 0,
    PLAYER: 1 << 1,
    WALL: 1 << 2,
    ENEMY: 1 << 3
  }

  static readonly CharStatus = {
    IDLE: 0,
    RUN: 1,
    JUMP: 2,
    ATTACK: 3,
    TAKEDAMAGE: 4,
    DEATH: 5
  }

  static readonly ColliderTag = {
    PLAYER: 1,
    PLAYER_ATTACK1: 2,
  }

}