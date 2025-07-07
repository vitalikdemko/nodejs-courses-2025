type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export function Route(method: Method, path = '') {
  return function (target: any, key: string) {
    const routes =
      Reflect.getMetadata('mini:routes', target.constructor) ?? [];
    routes.push({ method, path, handlerName: key });
    Reflect.defineMetadata('mini:routes', routes, target.constructor);
  };
}

export const Get = (p = '') => Route('get', p);
export const Post = (p = '') => Route('post', p);
export const Delete = (path = '') => Route('delete', path);
