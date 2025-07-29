
describe('Dynamic Properties', function() {

    beforeEach(() => {
        cy.visit('/dynamic-properties');
    })

    it('Confirm that the buttons properties will change after 5 seconds', function() {
        cy.get('#enableAfter').should('be.disabled');
        cy.get('#colorChange')
            .should('not.have.class', 'text-danger')
            .and('have.css', 'color', 'rgb(255, 255, 255)');
        cy.get('#visibleAfter').should('not.exist');

        //Increase the waiting time to 5 seconds
        cy.get('#enableAfter', {timeout: 5000}).should('not.be.disabled');
        cy.get('#colorChange')
            .should('have.class', 'text-danger')
            .and('have.css', 'color', 'rgb(220, 53, 69)');
        cy.get('#visibleAfter').should('be.visible');
    })
})