import { random, resources } from "cc";
import { Constant } from "./Constant";

export class CharData {

  // 玩家id
  static readonly PlayersId = {
    Player1: 0,
    Player2: 1,
    Player3: 2,
    Player4: 3,
    Player5: 4,
  }


  // 总数据汇总
  static readonly playerConfig = {
    [this.PlayersId.Player1]: {
        prefabUrl: Constant.PrefabUrl.PLAYER1,  // 预制体地址
        avatarUrl: Constant.PrefabUrl.PLAYER1_AVATAR,  // 头像地址
        skillBarUrl: Constant.PrefabUrl.SKILL_BAR1,  // 技能条地址
        hp: 150,  // 血量
        speed: 12,  // 移动速度
        jump_speed: 10, // 跳跃速度
        atk1Offset: 14, // 攻击距离
        sk0Cd: 2,  // 技能0冷却时间
        sk1Cd: 3,  // 技能1冷却时间
        sk2Cd: 1,  // 技能2冷却时间
        sk3Cd: 1,  // 技能3冷却时间
    },
    [this.PlayersId.Player2]: {
        prefabUrl: Constant.PrefabUrl.PLAYER2,
        avatarUrl: Constant.PrefabUrl.PLAYER2_AVATAR,
        skillBarUrl: Constant.PrefabUrl.SKILL_BAR2,
        hp: 200,
        speed: 10,
        jump_speed: 9,
        atk1Offset: 21,
        sk0Cd: 2,
        sk1Cd: 2,
        sk2Cd: 1,
        sk3Cd: 1,
    },
    [this.PlayersId.Player3]: {
        prefabUrl: Constant.PrefabUrl.PLAYER3,
        avatarUrl: Constant.PrefabUrl.PLAYER3_AVATAR,
        skillBarUrl: Constant.PrefabUrl.SKILL_BAR3,
        hp: 100,
        speed: 14,
        jump_speed: 11,
        sk0Cd: 2,
        sk1Cd: 3,
        sk2Cd: 1,
        sk3Cd: 1,
    },
    [this.PlayersId.Player4]: {
        prefabUrl: Constant.PrefabUrl.PLAYER4,
        avatarUrl: Constant.PrefabUrl.PLAYER4_AVATAR,
        skillBarUrl: Constant.PrefabUrl.SKILL_BAR4,
        hp: 120,
        speed: 11,
        jump_speed: 10,
        sk0Cd: 1,
        sk1Cd: 1,
        sk2Cd: 1,
        sk3Cd: 1,
        atk1Offset: 32,
    },
    [this.PlayersId.Player5]: {
        prefabUrl: Constant.PrefabUrl.PLAYER5,
        avatarUrl: Constant.PrefabUrl.PLAYER5_AVATAR,
        skillBarUrl: Constant.PrefabUrl.SKILL_BAR5,
        hp: 100,
        speed: 8,
        jump_speed: 9,
        sk0Cd: 1,
        sk1Cd: 1,
        sk2Cd: 1,
        sk3Cd: 1,
        atk1Offset: 7.5
    },
  };

  // 怪物id
  static readonly EnemysId = {
    Enemy1: 1,
    Enemy2: 2,
    Enemy3: 3,
    Boss1: 101,
    Boss2: 102,
  }


  static readonly enemyConfig = {
    [this.EnemysId.Enemy1]: {
        prefabUrl: Constant.PrefabUrl.SKELETON,  // 预制体
        enemyId: 1, // 怪物id
        name: '骷髅怪',  // 怪物名称
        hp: 2,  // 血量
        minSpeed: 8,  // 移动速度
        maxSpeed: 12, // 移动速度
        chaseDistance: 200,  // 追击距离
        attackRange: 70,  // 攻击距离
        exp: 100,  // 经验值
        ap: 5,  // 攻击力
        attackNumber: 1,  // 攻击方式数
        isBoss: false,    // 是否是boss
        HitColliderOffsetX: 8.5  // 碰撞体偏移量
    },
    [this.EnemysId.Enemy2]: {
        prefabUrl: Constant.PrefabUrl.SKELETON2,
        enemyId: 2,
        name: '黑骷髅怪',
        hp: 15,
        minSpeed: 8,
        maxSpeed: 12,
        chaseDistance: 300,
        attackRange: 70,
        exp: 20,
        ap: 10,
        attackNumber: 1,
        isBoss: false,
        HitColliderOffsetX: 3
     },
     [this.EnemysId.Enemy3]: {
        prefabUrl: Constant.PrefabUrl.SKELETON3,
        enemyId: 3,
        name: '绿骷髅',
        hp: 12,
        minSpeed: 14,
        maxSpeed: 16,
        chaseDistance: 300,
        attackRange: 70,
        exp: 30,
        ap: 15,
        attackNumber: 1,
        isBoss: false,
        HitColliderOffsetX: 0
      },
    [this.EnemysId.Boss1]: {
        prefabUrl: Constant.PrefabUrl.BOSS1,
        enemyId: 101,
        name: '女巨人',
        hp: 500,
        minSpeed: 14,
        maxSpeed: 16,
        chaseDistance: 400,
        attackRange: 200,
        exp: 50,
        ap: 30,
        attackNumber: 3,
        isBoss: true,
        HitColliderOffsetX: 0
    },
    [this.EnemysId.Boss2]: {
        prefabUrl: Constant.PrefabUrl.BOSS2,
        enemyId: 102,
        name: '凯之巨人',
        hp: 600,
        minSpeed: 10,
        maxSpeed: 12,
        chaseDistance: 400,
        attackRange: 200,
        exp: 50,
        ap: 30,
        attackNumber: 3,
        isBoss: true,
        HitColliderOffsetX: 0
    }
  }

  static readonly PetsId = {
    Pet1: 0,
    Pet2: 1,
    Pet3: 2,
    Pet4: 3,
    Pet5: 4,

    Pet101: 101,
  }

  // 宠物类型
  static readonly PetType = {
    Attack: 1,  // 攻击型
    Cure: 2,     // 治疗型
    Defence: 3,    // 防御型
    Summon: 4,    // 召唤型
    Help: 5,    // 增益型
  }

  static readonly petConfig = {
    [this.PetsId.Pet1]: {
        prefabUrl: Constant.PrefabUrl.PET1,
        avatarUrl: Constant.PrefabUrl.PET1_AVATAR,
        petId: 0,
        name: '挽豆射手',
        hp: 500,
        speed: 8,
        ap: 2,
        chaseDistance: 300,  // 追击距离
        attackRange: 200,  // 攻击距离
        petType: '攻击型',
        type: this.PetType.Attack,
        DragonAssetPath: 'Ani/Pet/pet1/peashooter_ske',
        DragonAtlasAssetPath: 'Ani/Pet/pet1/peashooter_t',
        lv: 1, // 等级
        attackTime: 1, // 攻击间隔
    },
    [this.PetsId.Pet2]: {
        prefabUrl: Constant.PrefabUrl.PET2,
        avatarUrl: Constant.PrefabUrl.PET2_AVATAR,
        petId: 1,
        name: '龙日葵',
        hp: 5000,
        speed: 8,
        ap: 0,
        chaseDistance: 0,  // 追击距离
        attackRange: 0,
        petType: '治疗型',
        type: this.PetType.Cure,
        DragonAssetPath: 'Ani/Pet/pet2/sunflower_ske',
        DragonAtlasAssetPath: 'Ani/Pet/pet2/sunflower_t',
        lv: 1, // 等级
        attackTime: 5, // 攻击间隔
    },
    [this.PetsId.Pet3]: {
        prefabUrl: Constant.PrefabUrl.PET3,
        avatarUrl: Constant.PrefabUrl.PET3_AVATAR,
        petId: 2,
        name: '强坚果',
        hp: 2000,
        speed: 8,
        ap: 100,
        chaseDistance: 500,  // 追击距离
        attackRange: 10,
        petType: '防御型',
        type: this.PetType.Defence,
        DragonAssetPath: 'Ani/Pet/pet3/nut_ske',
        DragonAtlasAssetPath: 'Ani/Pet/pet3/nut_t',
        lv: 1, // 等级
        attackTime: 0, // 攻击间隔
    },
    [this.PetsId.Pet4]: {
        prefabUrl: Constant.PrefabUrl.PET4,
        avatarUrl: Constant.PrefabUrl.PET4_AVATAR,
        petId: 3,
        name: '曾哥',
        hp: 1000,
        speed: 15,
        ap: 50,
        chaseDistance: 200,  // 追击距离
        attackRange: 50,
        petType: '攻击型',
        type: this.PetType.Attack,
        DragonAssetPath: 'Ani/Pet/pet4/gloomshroom_ske',
        DragonAtlasAssetPath: 'Ani/Pet/pet4/gloomshroom_t',
        lv: 1, // 等级
        attackTime: 0.35, // 攻击间隔
    },
    [this.PetsId.Pet5]: {
        prefabUrl: Constant.PrefabUrl.PET5,
        avatarUrl: Constant.PrefabUrl.PET5_AVATAR,
        petId: 4,
        name: '原批',
        hp: 100,
        speed: 7,
        ap: 0,
        chaseDistance: 0,  // 追击距离
        attackRange: 0,
        petType: '增益型',
        type: this.PetType.Help,
        DragonAssetPath: 'Ani/Pet/pet5/op_ske',
        DragonAtlasAssetPath: 'Ani/Pet/pet5/op_t',
        lv: 1, // 
        attackTime: null, // 攻击间隔
     },
    [this.PetsId.Pet101]: {
      prefabUrl: Constant.PrefabUrl.PET_CAT,
      petId: 101,
      name: '小小喵',
      hp: 100,
      speed: 7,
      ap: 50,
      chaseDistance: 400,  // 追击距离
      attackRange: 15,
      petType: '召唤型',
      type: this.PetType.Summon,
      // DragonAssetPath: 'Ani/Pet/cat_ske',
      // DragonAtlasAssetPath: 'Ani/Pet/cat_t',
      lv: 1, // 等级
      attackTime: 0.35, // 攻击间隔
    }
  }

  static readonly GoodsId = {
    Good1: 0,
    Good2: 1,
  }

  static readonly GoodsConfig = {
    [this.GoodsId.Good1]: {
      goodId: 0,
      name: '角色恢复药水',
      effect: '恢复角色一定血量',
      price: 200,
    },
    [this.GoodsId.Good2]: {
      goodId: 1,
      name: '宠物恢复药水',
      effect: '恢复宠物一定血量',
      price: 100,
    }
  }
}