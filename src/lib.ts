export {};

declare global {
  interface Window {
    Payrex: any;
  }
}

const PAYREXJS_BASE_URL = "https://js.payrexhq.com";
const PAYREXJS_BASE_URL_REGEX = /^https:\/\/js\.payrexhq\.com$/;

let payrexPromise:any = null;

let onErrorListener: (() => void) | null = null;
let onLoadListener: (() => void) | null = null;

const onError = (reject:any) => {
  return () => {
    reject(
      new Error('There is a problem loading PayRex.js')
    );
  }
}

const onLoad = (
  resolve: any,
  reject: any
) => () => {
  if (window.Payrex) {
    resolve(window.Payrex);
  } else {
    reject(new Error('Payrex.js not available'));
  }
};

const injectScript = (): HTMLScriptElement => {
  const script = document.createElement('script');
  const scriptContainer = document.head || document.body;

  script.src = PAYREXJS_BASE_URL;

  if (!scriptContainer) {
    throw new Error(
      'document.body should not be null. Payrex.js requires a <body> element.'
    );
  }

  scriptContainer.appendChild(script);

  return script;
};

const findScriptFromDom = () => {
  const scripts = document.querySelectorAll<HTMLScriptElement>(
    `script[src^="${PAYREXJS_BASE_URL}"]`
  );

  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];

    if (!PAYREXJS_BASE_URL_REGEX.test(script.src)) {
      continue;
    }

    return script;
  }

  return null;
};

export const loadScript = (): any => {
  if (isPromiseExisting()) {
    return payrexPromise;
  }

  payrexPromise = new Promise((resolve, reject) => {
    if (isServerSideRendering()) {
      resolve(null);

      return;
    }

    if (window.Payrex) {
      resolve(window.Payrex);

      return;
    }

    try {
      let script = findScriptFromDom();

      if (!script) {
        script = injectScript();
      } else if (script && onLoadListener !== null && onErrorListener !== null) {
        // This is a logic to relink the listeners if the retry logic kicked in

        script.removeEventListener('load', onLoadListener);
        script.removeEventListener('error', onErrorListener);

        // if script exists, but we are reloading due to an error,
        // reload script to trigger 'load' event
        script.parentNode?.removeChild(script);
        script = injectScript();
      }

      onLoadListener = onLoad(resolve, reject);
      onErrorListener = onError(reject);

      script.addEventListener('load', onLoadListener);
      script.addEventListener('error', onErrorListener);
    } catch (error) {
      reject(error);

      return;
    }
  });

  // Resets payrexPromise on error
  return payrexPromise.catch((error:any) => {
    payrexPromise = null;

    return Promise.reject(error);
  });
};

const isPromiseExisting = () => {
  return payrexPromise != null;
}

const isServerSideRendering = () => {
  return typeof window === 'undefined' || typeof document === 'undefined';
}