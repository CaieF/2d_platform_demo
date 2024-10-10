import { BoxCollider2D, Collider2D, director, EPhysics2DDrawFlags, ERigidBody2DType, Label, math, Node, NodePool, PhysicsSystem2D, randomRangeInt, RigidBody2D, Size, TiledLayer, TiledMap, tween, UITransform, v3, Vec2, Vec3 } from "cc";
import { Constant } from "./Constant";
import { Globals } from "./Globals";
import { GameContext } from "./GameContext";
import { CharData } from "./CharData";

export class Util {
  
  // 给墙体添加碰撞组件
  static setWall(Map: TiledMap) {
    // Map.getComponent(UITransform).setAnchorPoint(0,0); // 设置锚点
    PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.All;
    
    // 获取地图墙体
    let tiledSize:Size = Map.getTileSize(); // 得到每一小块的大小
    const wallLayer: TiledLayer = Map.getLayer('wall'); // 获取墙体
    const wallLayerSize = wallLayer.getLayerSize();

    for (let i = 0; i < wallLayerSize.width; i++) {
        for (let j = 0; j < wallLayerSize.height; j++) {
          // 获取瓦片
          let tiled = wallLayer.getTiledTileAt(i, j, true);
          
          if (tiled.grid !== 0) {
            // 添加刚体
            const rigid = tiled.node.addComponent(RigidBody2D);
            rigid.type = ERigidBody2DType.Static;
            rigid.group =  Constant.ColliderGroup.WALL;
            // 添加碰撞
            const collider = tiled.node.addComponent(BoxCollider2D)
            collider.group = Constant.ColliderGroup.WALL;
            collider.offset = new Vec2(tiledSize.width/2, tiledSize.height/2)
            collider.size.width = tiledSize.width;
            collider.size.height = tiledSize.height;
            collider.apply();
          }
          
        }
    }
  }

  static checkCollider(Collider: Collider2D, enabled: boolean = false) {
    if (Collider) {
      Collider.enabled = enabled;
      // Collider._enabled = enabled;
    }
  }

  // 文本展示
  static showText(text: string, color: string, worldPos: Vec3, parent: Node) {

    const ndText = Globals.getNode(Constant.PrefabUrl.DAMAGE_TEXT, parent)
    

    ndText.getComponent(Label).string = text;

    const newPos = v3(worldPos);
    newPos.add3f(randomRangeInt(-10, 10), 50, 0);
    ndText.setWorldPosition(newPos);
    ndText.getComponent(Label).color = math.color(color);
    
    // 放大 -> 等待 -> 消失
    ndText.setScale(1,1);
    // 缓动
    tween(ndText)
      .to(0.1, { scale: new Vec3(1.5, 1.5, ndText.scale.z)}) // 放大
      .delay(0.5)
      .to(0.1, { scale: new Vec3(0.1, 0.1, ndText.scale.z) }) // 缩小
      .call(() => {
        ndText.destroy();
      })
      .start();
  }

  // 节点移动
  static moveNode(node: Node, moveDirection: number, speed: number) {
    const x = node.position.x + moveDirection * speed;
    const y = node.position.y;
    node.setPosition(x, y);
  }

  // 击退敌人效果
  static applyKnockback(knockbackForce: number, rigid: RigidBody2D, Direction: Vec2) {
    const knockbackDirection = Direction.normalize();
    if (rigid) {
      rigid.applyForceToCenter(knockbackDirection.multiplyScalar(knockbackForce), true);
    }
  }

  // 游戏暂停效果
  static applyPause() {
    GameContext.GameStatus = Constant.GameStatus.PAUSE;
    director.pause();
  }

  // 游戏继续效果
  static applyResume() {
    GameContext.GameStatus = Constant.GameStatus.RUNNING;
    director.resume();
  }

  // 吸引敌人效果
  // static applyAttraction(attractionForce: number, rigid: RigidBody2D, targetPos: Vec3) {
  //   if (rigid) {
  //     const direction = targetPos.sub(rigid.position);
  //     const force = direction.normalize().multiplyScalar(attractionForce);
  //     rigid.applyForceToCenter(force, true);
  //   }
  // }

  // 获取范围的敌人
  static getNearbyEnemies(node: Node, Range: number): Node[] {
    const enemies = GameContext.ndEnemyParents.children; // 获取所有敌人
    return enemies.filter((enemy) => {
        const distance = Vec3.distance(node.worldPosition, enemy.worldPosition); // 计算距离
        return distance < Range; // 检查是否在吸引力范围内
    });
  }

  // 获取玩家位置
  static getPlayerPosition() {
    if (GameContext.ndPlayer) {
      return GameContext.ndPlayer.worldPosition;
    }
    
  }


  // 随机移动
  static rangeMove(deltaTime: number, randomMoveTimer: number, randomMoveTime: number, lv: Vec2) {
    randomMoveTimer += deltaTime;
    if (randomMoveTimer > randomMoveTime) {
      randomMoveTimer = 0;
      lv.x = (Math.random() * 2 - 1) / 10;
    }
    // return lv, randomMoveTimer;
  }

  // 加载角色头像
  static loadPlayerAvatar(ndPlayerMessage: Node) {
    const defaultPlayerId = CharData.Player1.playerId; // 默认角色ID
    const selectedPlayerId = GameContext.selectedPlayerId;
    // 获取角色配置
    const playerConfigData  = CharData.playerConfig[selectedPlayerId] || CharData.playerConfig[defaultPlayerId];
    const playerAvatarPrefabUrl = playerConfigData.avatarUrl;
    // 角色头像
    const playerAvatarNode = Globals.getNode(playerAvatarPrefabUrl, ndPlayerMessage);
    if (playerAvatarNode) {
        playerAvatarNode.setPosition(-30, 0);
    }
  }

  
}