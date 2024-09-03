import { Asset, error, JsonAsset, Prefab, resources, SpriteFrame, TextAsset } from "cc";

export class ResUtil {
  static loadRes (url: string, callback: Function) {
      resources.load(url, (err: Error, res: any) => {
          if (err) {
            error(err.message);
            callback && callback(res, err);
            return;
          }
          callback && callback(res, null);
      });
  }

  static loadPrefab (url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        this.loadRes(url, (res: any, err: Error) => {
          if (err) {
            reject();
          } else {
            resolve(res as Prefab)
          }
        })
    });
  }

  static loadJson(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadRes(url, (res: any, err: Error) => {
        if (err) {
          reject();
        } else {
          resolve(res as JsonAsset)
        }
      })
    });
  }

  static loadText(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadRes(url, (res: any, err: Error) => {
        if (err) {
          reject();
        } else {
          resolve(res as TextAsset)
        }
      })
    });
  }

  static loadSpriteFrame(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadRes(url, (res: any, err: Error) => {
        if (err) {
          reject();
        } else {
          resolve(res as SpriteFrame)
        }
      })
    });
  }

  static loadSpriteFrameDir(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resources.loadDir(url, (err: Error, data: Asset[]) => {
        resources.loadDir(url, (err: Error, data: Asset[]) => {
          if (err) {
            reject();
          } else {
            resolve(data as SpriteFrame[]);
          }
        })
      })
    })
  }
}