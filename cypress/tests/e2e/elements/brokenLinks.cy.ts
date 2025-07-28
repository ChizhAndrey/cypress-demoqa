
describe('Broken Images', function() {

    beforeEach(() => {
        cy.visit('/broken');
    })

    it('Confirm images load successfully', function() {
        cy.get('h1')
            .contains('Broken Links - Images')
            .parent()
            .within(() => {
                cy.get('img').each(($img: JQuery<HTMLImageElement>) => {
                    cy.wrap($img)
                        .should('be.visible')
                        .and('have.prop', 'naturalWidth')
                        .should('be.greaterThan', 0);
                });
            })
    })
})