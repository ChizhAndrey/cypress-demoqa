
Cypress.Commands.add("getIframeDocument", (selector) => {
    return cy.get(selector)
                .its('0.contentDocument')
                .should('exist');
}) 

Cypress.Commands.add("getIframeBody", (selector) => {
    return cy.getIframeDocument(selector)
                .its("body")
                .should("not.be.undefined")
                .then<JQuery<HTMLBodyElement>>(cy.wrap);
})