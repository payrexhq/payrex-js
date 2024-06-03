import {loadScript} from './lib';

// TODO: Add specific types.

let payrexPromise:any = null;

const getPayrexPromise = () => {
  if (payrexPromise) {
    return payrexPromise;
  }

  payrexPromise = loadScript().catch((error: any) => {
    payrexPromise = null;

    return Promise.reject(error);
  });

  return payrexPromise;
}

// Resolving a promise to ensure that PayRexJS script is loaded at a later time.
Promise.resolve()
  .then(() => {
    return getPayrexPromise()
  })
  .catch((e) => {
    console.log(e);
  });

export type LoadPayRex = (args:any) => any;

export const loadPayrex:any = (...args:any) => {
  return getPayrexPromise().then((locPayrex:any) => {
    const initialized = locPayrex(args)

    return initialized;
  });
};
  