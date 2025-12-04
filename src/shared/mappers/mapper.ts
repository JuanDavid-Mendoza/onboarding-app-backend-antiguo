export default class Mapper {
  public static mapToClass<T extends object>(cls: new () => T, obj: any): T {
    const instance = new cls();

    for (const key of Object.keys(instance)) {
      if (obj.hasOwnProperty(key)) {
        (instance as any)[key] = obj[key];
      }
    }

    return instance;
  }

  public static mapArrayToClass<T extends object>(cls: new () => T, arr: any[]): T[] {
    return arr.map(item => Mapper.mapToClass(cls, item));
  }
}