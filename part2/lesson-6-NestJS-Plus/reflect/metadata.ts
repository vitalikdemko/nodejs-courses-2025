/********************************************************************
 *  reflect-metadata-demo.ts
 *  Rounds up *all* metadata helpers 💡✨
 *******************************************************************/

import 'reflect-metadata';          // 👈 MUST be first import

// -----------------------------------------------------------------
// 🔧  Utility: log helper so we can label sections nicely
// -----------------------------------------------------------------
const log = (label: string, value: unknown) =>
  console.log(`${label.padEnd(35)} →`, value);

// -----------------------------------------------------------------
//  0️⃣  Custom Decorators (they’ll just add/inspect metadata)
// -----------------------------------------------------------------
const Tagged =
  (tag: string): ClassDecorator =>
    (target) => {
      Reflect.defineMetadata('tag', tag, target);
    };

function Required(target: any, propertyKey: string | symbol) {
  const existing =
    Reflect.getOwnMetadata('requiredProps', target) ?? ([] as string[]);
  existing.push(propertyKey as string);
  Reflect.defineMetadata('requiredProps', existing, target);
}

function ValidateRange(min: number, max: number) {
  return (
    target: any,
    _prop: string | symbol,
    index: number // parameter index
  ) => {
    Reflect.defineMetadata(
      `range:${index}`,
      { min, max },
      target,
      _prop as string | symbol
    );
  };
}

// -----------------------------------------------------------------
//  🏗️  Demo Class with various decorator targets
// -----------------------------------------------------------------
@Tagged('🧑‍🚀 Space Explorer')
class Rocket {
  @Required public name!: string;

  launch(@ValidateRange(0, 100) fuel: number) {
    log('Launching with fuel', fuel);
  }
}

// -----------------------------------------------------------------
// 1️⃣  Reflect.defineMetadata  (already used in decorators)
// -----------------------------------------------------------------
Reflect.defineMetadata('version', 1, Rocket);
log('defineMetadata – version', Reflect.getMetadata('version', Rocket));

// -----------------------------------------------------------------
// 2️⃣  Reflect.hasMetadata / 3️⃣ hasOwnMetadata
// -----------------------------------------------------------------
log('hasMetadata(tag)', Reflect.hasMetadata('tag', Rocket)); // walks prototype
log('hasOwnMetadata(tag)', Reflect.hasOwnMetadata('tag', Rocket)); // direct only

// -----------------------------------------------------------------
// 4️⃣  Reflect.getMetadata / 5️⃣ getOwnMetadata
// -----------------------------------------------------------------
log('getMetadata(tag)', Reflect.getMetadata('tag', Rocket));
log('getOwnMetadata(tag)', Reflect.getOwnMetadata('tag', Rocket));

// -----------------------------------------------------------------
// 6️⃣  Reflect.getMetadataKeys / 7️⃣ getOwnMetadataKeys
// -----------------------------------------------------------------
log('getMetadataKeys(Rocket)', Reflect.getMetadataKeys(Rocket));
log('getOwnMetadataKeys(Rocket)', Reflect.getOwnMetadataKeys(Rocket));

// -----------------------------------------------------------------
// 8️⃣  Reflect.deleteMetadata
// -----------------------------------------------------------------
Reflect.deleteMetadata('version', Rocket);
log('deleteMetadata(version)', Reflect.hasMetadata('version', Rocket));

// -----------------------------------------------------------------
// 🧪  Bonus ‑ Inspecting metadata emitted by TypeScript itself
//      (requires "emitDecoratorMetadata": true in tsconfig)
// -----------------------------------------------------------------
const types = Reflect.getMetadata('design:paramtypes', Rocket.prototype, 'launch');
log('design:paramtypes of launch', types?.map((t: any) => t.name)); // ["Number"]

log('requiredProps (own)', Reflect.getOwnMetadata('requiredProps', Rocket.prototype));

// -----------------------------------------------------------------
// 9️⃣  Reflect.decorate   – manual decorator application
// -----------------------------------------------------------------
class Empty {}
Reflect.decorate([Tagged('🪐 Planetary')], Empty);
log('decorate(tag)', Reflect.getMetadata('tag', Empty));

// 🔟  Reflect.metadata helper – sugar over defineMetadata + decorate
@Reflect.metadata('role', '🚀 API demo')
class MetaSugar {}
log('metadata(role)', Reflect.getMetadata('role', MetaSugar));

// -----------------------------------------------------------------
console.log('\n✔️  All reflect‑metadata calls demonstrated!\n');