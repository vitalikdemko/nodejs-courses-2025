class Person {
  constructor(public first: string, public last: string) {}
  getFullName() {
    return `${this.first} ${this.last}`;
  }
}

// -------------------------------------------
// 1️⃣  Reflect.apply
// -------------------------------------------
function greet(this: Person, salutation: string) {
  return `${salutation}, ${this.getFullName()}!`;
}
const bob = new Person("Bob", "Builder");
console.log("Reflect.apply →", Reflect.apply(greet, bob, ["Howdy"])); // Howdy, Bob Builder!

// -------------------------------------------
// 2️⃣  Reflect.construct
// -------------------------------------------
const alice = Reflect.construct(Person, ["Alice", "Wonderland"]) as Person;
console.log("Reflect.construct →", alice.getFullName()); // Alice Wonderland

// -------------------------------------------
// 3️⃣  Reflect.defineProperty
// -------------------------------------------
const settings = {};
Reflect.defineProperty(settings, "theme", {
  value: "dark",
  writable: true,
  configurable: true,
});
console.log("Reflect.defineProperty →", settings); // { theme: 'dark' }

// -------------------------------------------
// 4️⃣  Reflect.deleteProperty
// -------------------------------------------
Reflect.deleteProperty(settings, "theme");
console.log("Reflect.deleteProperty →", settings); // {}

// -------------------------------------------
// 5️⃣  Reflect.get
// -------------------------------------------
const obj = { x: 42 };
console.log("Reflect.get →", Reflect.get(obj, "x")); // 42

// -------------------------------------------
// 6️⃣  Reflect.getOwnPropertyDescriptor
// -------------------------------------------
const desc = Reflect.getOwnPropertyDescriptor(obj, "x");
console.log("Reflect.getOwnPropertyDescriptor →", desc);

// -------------------------------------------
// 7️⃣  Reflect.getPrototypeOf
// -------------------------------------------
console.log("Reflect.getPrototypeOf →", Reflect.getPrototypeOf(obj) === Object.prototype); // true

// -------------------------------------------
// 8️⃣  Reflect.has
// -------------------------------------------
console.log("Reflect.has →", Reflect.has(obj, "x")); // true
console.log("Reflect.has (inherited) →", Reflect.has(bob, "getFullName")); // true

// -------------------------------------------
// 9️⃣  Reflect.isExtensible
// -------------------------------------------
console.log("Reflect.isExtensible (before) →", Reflect.isExtensible(obj)); // true

// -------------------------------------------
// 🔒  Demonstrate preventExtensions, then show isExtensible flips
// -------------------------------------------
Reflect.preventExtensions(obj);                    // 10️⃣  Reflect.preventExtensions
console.log("Reflect.preventExtensions → done");
console.log("Reflect.isExtensible (after) →", Reflect.isExtensible(obj)); // false

// Attempting to add a property now silently fails in non‑strict mode
(obj as any).y = 99;
console.log("Property added after preventExtensions? →", (obj as any).y); // undefined

// -------------------------------------------
// 11  Reflect.ownKeys
// -------------------------------------------
const complex = { a: 1, [Symbol("sym")]: 2 };
console.log("Reflect.ownKeys →", Reflect.ownKeys(complex)); // ['a', Symbol(sym)]

// -------------------------------------------
// 12  Reflect.set
// -------------------------------------------
const target = {};
Reflect.set(target, "answer", 42);
console.log("Reflect.set →", (target as {answer: number}).answer); // 42

// -------------------------------------------
// 13  Reflect.setPrototypeOf
// -------------------------------------------
const proto = { protoProp: "👍" };
Reflect.setPrototypeOf(target, proto);
console.log("Reflect.setPrototypeOf →", (target as any).protoProp); // 👍
