import { randomRangeInt, Vec3 } from "cc";
import { Constant } from "./Constant";
import { Globals } from "./Globals";
import { SwordQi } from "./SwordQi";
import { GameContext } from "./GameContext";
import { Hole } from "./Hole";
import { Arrow } from "./Arrow";
import { Explosion } from "./Explosion";
import { WaterBlast } from "./WaterBlast";
import { Player } from "./Player";
import { AudioManager } from "./AudioManager";
import { PetCat } from "./PetCat";
import { CharData } from "./CharData";
import { Item } from "./Item";

export class UseSkill{

  // 发送剑气
  static shootSwordQi(position: Vec3, scaleX: number) {
    AudioManager.Instance.playSound('SkillSounds/sword2', 0.6)
    const ndPlayer1Skill0 = Globals.getNode(Constant.PrefabUrl.SWORD_SPLASH, GameContext.ndWeaponParent);
    ndPlayer1Skill0.worldPosition = position;
    ndPlayer1Skill0.scale = (new Vec3(scaleX * 0.2, 0.2, 0));
    // ndPlayer1Skill0.setScale(this.ndAni.scale);aaaa
    const pk0 = ndPlayer1Skill0.getComponent(SwordQi);
    pk0.isMoving = true;
    pk0.isMoveLeft = scaleX < 0 ? true : false;
  }

  // 发送乱剑
  static shootSwordGroup(position: Vec3, scaleX: number) {
    AudioManager.Instance.playSound('SkillSounds/sword3', 0.6)
    const ndPlayer1Skill1 = Globals.getNode(Constant.PrefabUrl.SWORD_GROUP, GameContext.ndWeaponParent);
    ndPlayer1Skill1.worldPosition = position
    ndPlayer1Skill1.scale = (new Vec3(scaleX * 0.8, 0.8, 0));
    const pk1 = ndPlayer1Skill1.getComponent(SwordQi);
    pk1.isMoving = false;
  }

  // 释放黑洞
  static shootHole(position: Vec3) {
    AudioManager.Instance.playSound('SkillSounds/stone2', 1);
    // const ndPlayer2Skill1 = Globals.getNode(Constant.PrefabUrl.PLAYER2_SKILL1, GameContext.ndWeaponParent);
    // ndPlayer2Skill1.worldPosition = position;
    const ndRock = Globals.getNode(Constant.PrefabUrl.ROCK, GameContext.ndWeaponParent);
    ndRock.worldPosition = position;
    const pk = ndRock.getComponent(WaterBlast);
    pk.isAbstract = true;
    pk.isMoving = false;
    pk.existTimer = 3;
    pk.isRatation = true;
    pk.attractionRange = 500;  // 吸引力范围
    pk.attractionForce = 300;  // 吸引力大小
  }

  // 扔石头
  static throwStone(position: Vec3, scaleX: number) {
    AudioManager.Instance.playSound('SkillSounds/stone1', 1);
    const ndPlayer2Skill0 = Globals.getNode(Constant.PrefabUrl.PLAYER2_SKILL0, GameContext.ndWeaponParent);
    ndPlayer2Skill0.worldPosition = position;
    const pk = ndPlayer2Skill0.getComponent(Hole);
    pk.isMoveLeft = scaleX < 0 ? true : false;
    pk.isMoving = true;
    pk.attractionForce = 150;
    pk.attractionRange = 80;
  }

  // 射箭
  static shootArrow(position: Vec3, scaleX: number) {
    AudioManager.Instance.playSound('SkillSounds/arrow')
    const ndArrow = Globals.getNode(Constant.PrefabUrl.ARROW, GameContext.ndWeaponParent);
    ndArrow.worldPosition = position;
    ndArrow.scale = (new Vec3(scaleX, 1, 0));
    const pk = ndArrow.getComponent(Arrow);
    pk.isMoving = true;
    pk.speed = 10;
    pk.isMoveLeft = scaleX < 0 ? true : false;
    pk.isSkill = false;
    pk.isHit = false;
    pk.type = Arrow.bulletType.ARROW;
  }

  // 发送闪电箭
  static shootElectorArrow(position: Vec3, scaleX: number) {
    AudioManager.Instance.playSound('SkillSounds/thunder')
    const ndPlayer3Skill0 = Globals.getNode(Constant.PrefabUrl.PLAYER3_SKILL0, GameContext.ndWeaponParent);
    ndPlayer3Skill0.worldPosition = position;
    ndPlayer3Skill0.scale = (new Vec3(scaleX * 2.5, 2.5, 0));
    const pk = ndPlayer3Skill0.getComponent(Arrow);
    pk.isMoving = true;
    pk.speed = 10;
    pk.isMoveLeft = scaleX < 0 ? true : false;
    pk.isSkill = true;
    pk.isHit = false;
    pk.type = Arrow.bulletType.ELECTOR_ARROW;
  }

  // 发送闪电
  static shootThunderStrike(position: Vec3) {
    AudioManager.Instance.playSound('SkillSounds/thunder')
    const ndThunderStrike = Globals.getNode(Constant.PrefabUrl.THUNDER_STRIKE, GameContext.ndWeaponParent0);
    ndThunderStrike.worldPosition = position;
    ndThunderStrike.getComponent(Explosion).playThunderStrike();
  }

  static shootThunderSplash(position: Vec3, scaleX: number) {
    AudioManager.Instance.playSound('SkillSounds/thunder')
    const ndThunderStrike = Globals.getNode(Constant.PrefabUrl.PLAYER3_SKILL1, GameContext.ndWeaponParent);
    ndThunderStrike.worldPosition = position;
    ndThunderStrike.scale = (new Vec3(scaleX * 2, 2, 0));
    ndThunderStrike.getComponent(Explosion).playThunderSplash();
  }

  // 发送火焰球
  static shootFireBall(position: Vec3, scaleX: number) {
    AudioManager.Instance.playSound('SkillSounds/fireball', 1);
    // console.log("shootFireBall", position);
    
    const ndFireBall = Globals.getNode(Constant.PrefabUrl.FIRE_BALL, GameContext.ndWeaponParent);
    // console.log("ndFireBall", ndFireBall);
    
    ndFireBall.worldPosition = position;
    ndFireBall.scale = (new Vec3(scaleX * 4, 4, 0));
    const pk = ndFireBall.getComponent(Arrow);
    pk.isMoving = true;
    pk.isSkill = false;
    pk.isMoveLeft = scaleX < 0 ? true : false;
    pk.speed = 6;
    pk.isHit = false;
    pk.type = Arrow.bulletType.FIRE_BALL;
  }

  // 释放水球
  static shootWaterBall(position: Vec3, scaleX: number) {
    AudioManager.Instance.playSound('SkillSounds/water1', 1);
    const ndWaterBall = Globals.getNode(Constant.PrefabUrl.WATER_BALL, GameContext.ndWeaponParent);
    ndWaterBall.worldPosition = position;
    ndWaterBall.scale = (new Vec3(scaleX * 1, 1, 0));
    const pk = ndWaterBall.getComponent(WaterBlast);
    pk.isMoveLeft = scaleX < 0 ? true : false;
    pk.isMoving = true;
    pk.speed = 2;
    pk.existTimer = 2;
    pk.isAbstract = false;
    pk.isRatation = false;
  }


  // 释放水龙卷
  static shootWaterBlast(position: Vec3, scaleX: number) {
    AudioManager.Instance.playSound('SkillSounds/water2', 1);
    const ndWaterBlast = Globals.getNode(Constant.PrefabUrl.WATER_BLAST, GameContext.ndWeaponParent0);
    ndWaterBlast.worldPosition = position;
    const pk = ndWaterBlast.getComponent(WaterBlast);
    pk.isMoveLeft = scaleX < 0 ? true : false;
    pk.existTimer = 3;
    pk.isMoving = true;
    pk.speed = 1;
    pk.existTimer = 3;
    pk.isAbstract = true;
    pk.isRatation = false;
    pk.attractionRange = 150;  // 吸引力范围
    pk.attractionForce = 400;  // 吸引力大小
  }

  static redExplosion(position: Vec3, scale: number) {
    AudioManager.Instance.playSound('SkillSounds/explosion', 1);
    const ndRedExplosion = Globals.getNode(Constant.PrefabUrl.RED_EXPLOSION, GameContext.ndWeaponParent0);
    ndRedExplosion.worldPosition = position;
    ndRedExplosion.scale = (new Vec3(scale, scale, 0));
    ndRedExplosion.getComponent(Explosion).playRedExplosion();
  }

  // 召唤宠物猫
  static summonCat(position: Vec3) {
    AudioManager.Instance.playSound('SkillSounds/petcat', 0.8);
    const ndPetCat = Globals.getNode(Constant.PrefabUrl.PET_CAT, GameContext.ndPlayerParents);
    ndPetCat.worldPosition = position;
    const petData = CharData.petConfig[101];
    ndPetCat.getComponent(PetCat).setValue(petData.petId, petData.hp, petData.ap, petData.speed, petData.add_hp, petData.type, petData.chaseDistance, petData.attackRange, petData.attackTime);
  }

  // 召唤角色援助
  static summonPlayer(position: Vec3, scaleX: number) {
    AudioManager.Instance.playSound('SkillSounds/playercat', 1);
    const number = randomRangeInt(1, 5);
    const ndPlayer = Globals.getNode(Constant.PrefabUrl[`PLAYER${number}`], GameContext.ndEnemyParents);
    ndPlayer.worldPosition = new Vec3 (position.x + 15 *scaleX, position.y, 0);
    ndPlayer.scale = (new Vec3(scaleX * 2, 2, 0));
    const pk = ndPlayer.getComponent(Player);
    pk.setValue(100, 100, 0, 0, 1, true, number);
  }

  // 发送豌豆
  static shootPea(position: Vec3, scaleX: number) {

    const ndPea = Globals.getNode(Constant.PrefabUrl.PEA, GameContext.ndWeaponParent);
    ndPea.worldPosition = position;
    // ndPea.scale = (new Vec3(scaleX * 0.5, 0.5, 0));
    const pk = ndPea.getComponent(Arrow);
    pk.isMoving = true;
    pk.isSkill = false;
    pk.isMoveLeft = scaleX < 0 ? true : false;
    pk.speed = 6;
    pk.isHit = false;
    pk.type = Arrow.bulletType.PEA;
  }

  // 产生豌豆爆炸
  static peaExplosion(position: Vec3, scaleX: number) {
    const ndRedExplosion = Globals.getNode(Constant.PrefabUrl.PEA_EXPLOSION, GameContext.ndWeaponParent);
    ndRedExplosion.worldPosition = position;
    ndRedExplosion.scale = (new Vec3(scaleX, scaleX, 0));
    ndRedExplosion.getComponent(Explosion).playPeaExplosion();
  }

  // 生产太阳
  static createSun(position: Vec3) {
    const ndSun = Globals.getNode(Constant.PrefabUrl.SUN, GameContext.ndWeaponParent);
    ndSun.worldPosition = position;
    ndSun.getComponent(Item).existTime = 4;
    ndSun.getComponent(Item).isUsed = false;
    // ndSun.scale = (new Vec3(scaleX * 2, scaleX * 2, 0));
  }

  // 死亡掉落金币
  static dropCoin(position: Vec3) {
    const ndCoin = Globals.getNode(Constant.PrefabUrl.COIN, GameContext.ndWeaponParent);
    ndCoin.worldPosition = position;
    ndCoin.getComponent(Item).existTime = 10;
    ndCoin.getComponent(Item).isUsed = false;
  }
}