export class Constant {
  // 游戏状态
  static readonly GameStatus = {
    RUNNING: 0, // 运行
    PAUSE: 1, // 暂停
  }

  // 游戏场景
  static readonly GameScene = {
    Start: 'Start', // 开始场景
    Prepare: 'Prepare', // 准备场景
    Game: 'Game', // 游戏场景
  }
  
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
    DEATH: 5,
    SKILL0: 6,
    SKILL1: 7,
    SKILL2: 8,
    DODGE: 9
  }

  static readonly PrefabUrl = {
    DAMAGE_TEXT: 'DamageText',
    PLAYER1: 'Player1', // 角色1
    PLAYER2: 'Player2', // 角色2
    PLAYER3: 'Player3', // 角色3
    PLAYER4: 'Player4', // 角色4
    PLAYER5: 'Player5', // 角色5
    PLAYER1_AVATAR: 'Player1Avatar', // 角色1头像
    PLAYER2_AVATAR: 'Player2Avatar', // 角色2头像
    PLAYER3_AVATAR: 'Player3Avatar', // 角色3头像
    PLAYER4_AVATAR: 'Player4Avatar', // 角色4头像
    PLAYER5_AVATAR: 'Player5Avatar', // 角色4头像
    PLAYER1_SKILL0: 'Player1Skill0', // 角色1技能0
    PLAYER1_SKILL1: 'Player1Skill1', // 角色1技能1
    PLAYER2_SKILL0: 'Player2Skill0', // 角色2技能0
    PLAYER2_SKILL1: 'Player2Skill1', // 角色2技能1
    PLAYER3_SKILL0: 'Player3Skill0', // 角色3技能0
    PLAYER3_SKILL1: 'Player3Skill1', // 角色3技能1
    SKILL_BAR1: 'SkillBar1', // 角色1技能栏
    SKILL_BAR2: 'SkillBar2', // 角色2技能栏
    SKILL_BAR3: 'SkillBar3', // 角色3技能栏
    SKILL_BAR4: 'SkillBar4', // 角色4技能栏
    SKILL_BAR5: 'SkillBar4', // 角色5技能栏
    ARROW: 'Arrow', // 箭矢
    FIRE_BALL: 'FireBall', // 火球
    THUNDER_STRIKE: 'ThunderStrike', // 闪电
    RED_EXPLOSION: 'RedExplosion', // 红色爆炸
    SKELETON: 'Skeleton' // 骷髅
  }

  static readonly ColliderTag = {
    PLAYER: 1,
    PLAYER_ATTACK1: 2,
    PLATER_FOOTER: 3,
    PLAYER_ATTACK2: 4, // 要击退效果的攻击类型
    PLAYER_ATTACK3: 5, // 击中就消失的攻击类型
    ENEMY:10,
    ENEMY_ATTACK1:11,
  }

  
}