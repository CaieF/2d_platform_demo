export class Constant {
  // 游戏状态
  static readonly GameStatus = {
    RUNNING: 0, // 运行
    PAUSE: 1, // 暂停
    LOADING: 2, // 加载
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
    ENEMY_ATTACK: 1 << 5,
    ITEM: 1 << 6,
    PET_ATTACK: 1 << 7,
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
    PLAYER5_AVATAR: 'Player5Avatar', // 角色5头像
    // PLAYER1_SKILL1: 'Player1Skill1', // 角色1技能1
    PLAYER2_SKILL0: 'Player2Skill0', // 角色2技能0
    PLAYER3_SKILL0: 'Player3Skill0', // 角色3技能0
    PLAYER3_SKILL1: 'Player3Skill1', // 角色3技能1
    SKILL_BAR1: 'SkillBar1', // 角色1技能栏
    SKILL_BAR2: 'SkillBar2', // 角色2技能栏
    SKILL_BAR3: 'SkillBar3', // 角色3技能栏
    SKILL_BAR4: 'SkillBar4', // 角色4技能栏
    SKILL_BAR5: 'SkillBar5', // 角色5技能栏
    PET_CAT: 'PetCat', // 宠物猫
    BOSS1: 'Boss1', // boss1
    BOSS2: 'Boss2', // boss2
    SWORD_SPLASH: 'SwordSplash', // 剑气
    SWORD_GROUP: 'SwordGroup', // 剑气群
    ARROW: 'Arrow', // 箭矢
    FIRE_BALL: 'FireBall', // 火球
    THUNDER_STRIKE: 'ThunderStrike', // 闪电
    WATER_BLAST: 'WaterBlast', // 水龙卷
    WATER_BALL: 'WaterBall', // 水球
    ROCK: 'Rock', // 岩石
    RED_EXPLOSION: 'RedExplosion', // 红色爆炸
    PEA: 'pea', // 豌豆
    PEA_EXPLOSION: 'peaExplosion', // 豌豆爆炸
    SUN: 'sun', // 太阳
    COIN: 'coin', // 金币
    SKELETON: 'Skeleton', // 骷髅
    SKELETON2: 'Skeleton2', // 骷髅2 
    SKELETON3: 'Skeleton3', // 骷髅3
    BIG_SKELETON: 'BigSkeleton', // 大骷髅
    PET1: 'Pet1', // 宠物1
    PET2: 'Pet2', // 宠物2
    PET3: 'Pet3', // 宠物3
    PET4: 'Pet4', // 宠物4
    PET5: 'Pet5', // 宠物5
    PET1_AVATAR: 'Pet1Avatar', // 角色1头像
    PET2_AVATAR: 'Pet2Avatar', // 角色2头像
    PET3_AVATAR: 'Pet3Avatar', // 角色3头像
    PET4_AVATAR: 'Pet4Avatar', // 角色4头像
    PET5_AVATAR: 'Pet5Avatar', // 角色5头像
  }

  static readonly ColliderTag = {
    PLAYER: 1,
    PLAYER_ATTACK1: 2,
    PLATER_FOOTER: 3,
    PLAYER_ATTACK2: 4, // 要击退效果的攻击类型
    PLAYER_ATTACK3: 5, // 击中就消失的攻击类型
    ENEMY:10,
    ENEMY_ATTACK1:11,
    ENEMY_ATTACK2:12, // 击退效果的攻击
    // Pet_ATTACK1: 31, // 宠物攻击
    // Pet_ATTACK2: 34, // 击退效果的攻击
    // Pet_ATTACK3: 35, // 击中就消失的攻击
    ITEM_CURE: 21, // 恢复
    ITEM_COIN: 22, // 金币
  }

  
}