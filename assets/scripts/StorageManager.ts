import { sys } from "cc";

export class StorageManager {

  static save(dataName: string, data: any) {
    const stringData = JSON.stringify(data);
    sys.localStorage.setItem(dataName, stringData);
  }

  static get(dataName: string) {
    if (!sys.localStorage.getItem(dataName)) return null
    return JSON.parse(sys.localStorage.getItem(dataName))
  }
}