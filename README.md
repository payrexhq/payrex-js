# CommonJS or ES module for PayRex.js

This package allows you to import [Payrex.js](https://docs.payrexhq.com/docs/guide/developer_handbook/payments/integrations/) as a CommonJS module or ES module.

## Minimum requirements
- Node.js: v12.16

## Installation

Use `npm` to install this module:

```bash
npm install payrex-js --save-dev
```

## How to use

`loadPayrex`

This is a function that returns a Promise that resolves with an instance of Payrex resource once Payrex.js has loaded. This method must be called from the client-side and not from the server-side. You should also pass your PayRex Public API key to complete the initialization.

```javascript
import { loadPayrex } from 'payrex-js';

const payrex = await loadPayrex('pk_test_...');
```

NOTE: Replace the PayRex public API key with your own. You can get your own API keys via PayRex [Dashboard](https://dashboard.payrexhq.com). If you don't have a PayRex account, create [one](https://dashboard.payrexhq.com/signup) first.

## TypeScript support

As of this writing, we don't have yet the `types` for this package. We will update our readme once it is available.

## Payrex.js Documentation

- [PayRex Guide](https://docs.payrexhq.com/docs/guide/intro)
- [PayRex Developer Handbook](https://docs.payrexhq.com/docs/guide/developer_handbook/)

