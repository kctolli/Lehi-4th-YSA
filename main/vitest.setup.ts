import '@testing-library/jest-dom/vitest';

// jsdom is missing a few browser APIs that antd touches on mount. Guarded so the
// file is a no-op under the default `node` test environment.
if (typeof window !== 'undefined') {
    if (!window.matchMedia) {
        window.matchMedia = (query: string) =>
            ({
                matches: false,
                media: query,
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => false
            }) as unknown as MediaQueryList;
    }

    if (!window.ResizeObserver) {
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    }
}
