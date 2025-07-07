export function Controller(prefix = '') {
  return function (target: any) {
    Reflect.defineMetadata('mini:prefix', prefix, target);
  };
}