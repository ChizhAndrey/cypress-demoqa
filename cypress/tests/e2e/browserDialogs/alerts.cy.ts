
describe('Interacting with alerts', function() {

    beforeEach(() => {
        cy.visit('/alerts' , {
            onBeforeLoad(win) {
                if('alert' in win) cy.stub(win, 'alert').as('alert');
            }
        });
    })

    it('Should show alert with correct message when button is clicked', function() {
        cy.get('#alertButton').click();
        cy.get('@alert')
            .should('have.been.calledOnce')
            .its('firstCall.args.0')
            .should('be.equal', 'You clicked a button');
    })

    it('Should show alert with correct message after 5 seconds delay when button is clicked', function() {
        cy.get('#timerAlertButton').click();
        cy.get('@alert', { timeout: 5000 })
            .should('have.been.calledOnce')
            .its('firstCall.args.0')
            .should('be.equal', 'This alert appeared after 5 seconds');
    })
})