export class LocalStorage {
  static setLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  static getLocalStorage(key: string) {
    return localStorage.getItem(key);
  }

  static removeLocalStorage(key: string) {
    return localStorage.removeItem(key);
  }
}
