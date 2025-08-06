
describe('Modal dialogs', function() {

    beforeEach(() => {
        cy.visit('/modal-dialogs');
    })

    it('Should verify text content in small and large modal dialogs', function() {
        cy.get('#showSmallModal').click();
        cy.get('div[role="dialog"] .modal-content').within(() => {
            cy.get('.modal-header .modal-title.h4').should('have.text', 'Small Modal');
            cy.get('.modal-body').should('have.text', 'This is a small modal. It has very less content');
            cy.get('#closeSmallModal').click();
        })
    
        cy.get('#showLargeModal').click();
        cy.get('div[role="dialog"] .modal-content').within(() => {
            cy.get('.modal-header .modal-title.h4').should('have.text', 'Large Modal');
            cy.get('.modal-body').should('include.text', 'Lorem Ipsum passages, and more recently with desktop');
            cy.get('#closeLargeModal').click();
        })
    })
})