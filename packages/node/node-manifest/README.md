# @relab/node-manifest

The package allows storing the application manifest for the project and using it as needed. 

## Requirements

- Node 18+
- Zod 3+

## Installation

### NPM

```
npm install --save @relab/node-manifest
```

### PNPM

```
npm add @relab/node-manifest
```

## Default project schema

```json5
{
  "name": "<project name>", // Project name
  "description": "<project description>", // Description of the project
  "service": "<service name>", // (optional) Service name - useful, for example, when your app is part of Kubernetes app
  "package": { // (optional) Package description
    "name": "", // Package name
    "description": "", // (optional) Package description
    "version": "", // Package version
  }
}
```

## Usage

### Default schema

`./manifest.json`

```json
{
  "name": "Test",
  "description": "Test app",
  "service": "test",
  "package": {
    "name": "@company/test",
    "description": "Package for test app",
    "version": "1.1.0"
  }
}
```

`./manifest.ts`

```typescript
import { DefaultManifestSchema, manifest as parse } from '@relab/node-manifest'
export const manifest = parse(DefaultManifestSchema)()
```
Somewhere in your app:

```typescript
import manifest from './manifest'

console.log(manifest.name)
console.log(manifest.description)
// ...
```

### Custom schema

`./manifest.json`

```json
{
  "name": "Test",
  "description": "Test app",
  "service": "test",
  "package": {
    "name": "@company/test",
    "description": "Package for test app",
    "version": "1.1.0"
  }
}
```

`./manifest.ts`

```typescript
import { DefaultManifestSchema, manifest as parse } from '@relab/node-manifest'
export const manifest = parse(DefaultManifestSchema)()
```
Somewhere in your app:

```typescript
import manifest from './manifest'

console.log(manifest.name)
console.log(manifest.description)
// ...
```

### Custom manifest file name

`./manifest.json`

```json
{
  "title": "Test",
  "version": "1.1.0"
}
```

`./manifest.ts`

```typescript
import { manifest as parse } from '@relab/node-manifest'
import { z } from 'zod'

const MyManifestSchema = z.object({
    title: z.string(),
    version: z.string(),
})

export const manifest = parse(MyManifestSchema)()
```
Somewhere in your app:

```typescript
import manifest from './manifest'

console.log(manifest.title)
console.log(manifest.version)
```

## License

Released under [MIT](/LICENSE) by [Sergey Zwezdin](https://github.com/sergeyzwezdin).
