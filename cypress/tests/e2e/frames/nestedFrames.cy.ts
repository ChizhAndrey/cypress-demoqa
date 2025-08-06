
describe('Nested frames', function() {

    beforeEach(() => {
        cy.visit('/nestedframes');
    })
    it('Should correctly render text in parent and nested iframe', function() {
        cy.getIframeBody('#frame1')
            .should('have.text', 'Parent frame')
            .within(() => {
                cy.getIframeBody('iframe')
                    .find('p')
                    .should('have.text', 'Child Iframe');
            })
    })
})