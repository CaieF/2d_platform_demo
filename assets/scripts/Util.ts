import { BoxCollider2D, EPhysics2DDrawFlags, ERigidBody2DType, PhysicsSystem2D, RigidBody2D, Size, TiledLayer, TiledMap, UITransform, Vec2 } from "cc";
import { Constant } from "./Constant";

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
}