import 'reflect-metadata';

const INJECTION_TOKENS_KEY = 'custom:inject_tokens';

export function Inject(token: any) {
  return function (target: any, parameterIndex: number) {
    const existingInjectedTokens = Reflect.getMetadata(INJECTION_TOKENS_KEY, target) || [];
    existingInjectedTokens[parameterIndex] = token;
    Reflect.defineMetadata(INJECTION_TOKENS_KEY, existingInjectedTokens, target);
  };
}

export function getCustomInjectTokens(target: any): Record<number, any> {
  return Reflect.getMetadata(INJECTION_TOKENS_KEY, target) || {};
}