export class Constant {
  
  static readonly ColliderGroup = {
    DEFAULT: 1 << 0,
    PLAYER: 1 << 1,
    WALL: 1 << 2,
    ENEMY: 1 << 3,
    PLAYER_ATTACK: 1 << 4,
    ENEMY_ATTACK: 1 << 5
  }


  static readonly CharStatus = {
    IDLE: 0,
    RUN: 1,
    JUMP: 2,
    ATTACK: 3,
    TAKEDAMAGE: 4,
    DEATH: 5
  }

  static readonly PrefabUrl = {
    DAMAGE_TEXT: 'DamageText',
    PLAYER1: 'Player1',
    PLAYER2: 'Player2',
    PLAYER1_AVATAR: 'Player1Avatar',
    PLAYER2_AVATAR: 'Player2Avatar',
    SKELETON: 'Skeleton'
  }

  static readonly ColliderTag = {
    PLAYER: 1,
    PLAYER_ATTACK1: 2,
    PLATER_FOOTER: 3,

    ENEMY:10,
    ENEMY_ATTACK1:11
  }

}