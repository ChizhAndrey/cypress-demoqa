export {};

declare global {
    namespace Cypress {
        interface Chainable {}
        interface ResolvedConfigOptions {
            hideXHRAndFetch?: boolean;
            hideExc?: boolean;
        }
    }
}




