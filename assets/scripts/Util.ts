import { BoxCollider2D, Collider2D, EPhysics2DDrawFlags, ERigidBody2DType, Label, math, Node, PhysicsSystem2D, randomRangeInt, RigidBody2D, Size, TiledLayer, TiledMap, tween, UITransform, v3, Vec2, Vec3 } from "cc";
import { Constant } from "./Constant";
import { Globals } from "./Globals";

export class Util {
  
  // 给墙体添加碰撞组件
  static setWall(Map: TiledMap) {
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
}