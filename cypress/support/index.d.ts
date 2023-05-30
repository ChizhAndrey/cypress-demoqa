export {};

declare global {
    namespace Cypress {
        interface Chainable {
            getIframeDocument(s: "iframe"): Cypress.Chainable<Document>,
            getIframeDocument(s: string): Cypress.Chainable<Document>,
            getIframeBody(s: "iframe"): Cypress.Chainable<JQuery<HTMLBodyElement>>,
            getIframeBody(s: string): Cypress.Chainable<JQuery<HTMLBodyElement>>,
            drag(targetAlias: string, options?: Options): Chainable<boolean>,
        }
        interface ResolvedConfigOptions {
            hideXHRAndFetch?: boolean;
            hideExc?: boolean;
        }
        interface ClickOptions {
            clicks?: number,
        }
    }
}




