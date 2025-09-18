# More Maps

[![npm version](https://badge.fury.io/js/@5cover/moremaps.svg)](https://badge.fury.io/js/@5cover/moremaps)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript library providing enhanced map implementations for JavaScript, including default value maps and object key maps.

## Features

- **DefaultPrimitiveMap**: A map that provides default values for primitive keys (string, number, bigint, boolean, undefined, symbol, null).
- **DefaultObjectMap**: A map that provides default values for object keys, using custom key-to-primitive converters.
- **ObjectMap**: A map for object keys, internally using primitive keys for efficient storage.
- **mapObject**: Utility functions for creating prototype-less, "map-safe" objects.
- **DefaultMap**: Interface for maps that guarantee a value from `get()`.

All implementations extend or implement the standard `Map` interface where applicable.

## Installation

```bash
npm install @5cover/moremaps
```

## Usage

### DefaultPrimitiveMap

```typescript
import DefaultPrimitiveMap from '@5cover/moremaps';

const map = new DefaultPrimitiveMap<string, number>((key) => key.length);

console.log(map.get('hello')); // 5 (default value)
map.set('world', 10);
console.log(map.get('world')); // 10
```

### DefaultObjectMap

```typescript
import DefaultObjectMap from '@5cover/moremaps';

const map = new DefaultObjectMap<{ id: number }, number, string>(
  () => 0, // default factory
  (key) => JSON.stringify(key), // key to primitive
  (prim) => JSON.parse(prim) // primitive to key
);

console.log(map.get({ id: 1 })); // 0 (default)
map.set({ id: 1 }, 42);
console.log(map.get({ id: 1 })); // 42
```

### ObjectMap

```typescript
import { ObjectMap } from '@5cover/moremaps';

const map = new ObjectMap<{ id: number }, string, number>(
  (key) => key.id, // key to primitive
  (prim) => ({ id: prim }) // primitive to key
);

map.set({ id: 1 }, 'one');
console.log(map.get({ id: 1 })); // 'one'
```

### mapObject

```typescript
import * as mapObject from '@5cover/moremaps';

const obj = mapObject.create<string, number>();
obj.key = 42;
console.log(Object.getPrototypeOf(obj)); // null

const assigned = mapObject.assign({ a: 1, b: 2 });
console.log(assigned.a); // 1
```

## API

For detailed API documentation, see the TypeScript definitions in the `dist/` folder or explore the source code in `src/`.

## Contributing

Contributions are welcome! Please ensure code follows the project's linting and testing standards.

Run tests:

```bash
npm test
```

Build:

```bash
npm run build
```

## License

MIT License. See [LICENSE](LICENSE) for details.
