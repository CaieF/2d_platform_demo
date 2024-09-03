import { NodePool, Node, Prefab, instantiate } from "cc";


export class PoolManager {
	private static _instance: PoolManager;
  static get instance() {
    if (!this._instance) {
      this._instance = new PoolManager();
    }
    return this._instance;
  }

  private _nodePools: Record<string, NodePool> = {};

  put(obj: Node) {
    if (!obj) {
      return;
    }
    const key = obj.name;

    let pool = this._nodePools[key];
    // 节点池不存在，创建一个新的节点池
    if (!pool) {
      pool = new NodePool();
      this._nodePools[key] = pool;
    } else {
      // 将obj放入节点池
      pool.put(obj);
    }
  }

  get(pf: Prefab):Node {
    
    if (!pf) {
      return;
    }
    const key = pf.name;

    let target: Node;
    let pool = this._nodePools[key];// 查找
    if (!pool) {
      target = instantiate(pf);
      pool = new NodePool();
      this._nodePools[key] = pool;
    } else {
      if (pool.size() > 0 ) {
        target = pool.get();
      } else {
        target = instantiate(pf)
      }
    }

    return target;
  }
}