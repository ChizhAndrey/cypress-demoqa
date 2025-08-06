
describe('Interacting with confirms', function() {
    it('Should display "Ok" result when confirm is accepted', function() {
        cy.visit('/alerts' , {
            onBeforeLoad(win) {
                if('confirm' in win) {
                    cy.stub(win, 'confirm')
                        .as('confirm')
                        .returns(true);
                }      
            }
        });

        cy.get('#confirmButton').click();
        cy.get('@confirm').should('have.be.calledOnceWith', 'Do you confirm action?');
        cy.get('#confirmResult').should('have.text', 'You selected Ok');
    })

    it('Should display "Cancel" result when confirm is dismissed', function() {
        cy.visit('/alerts' , {
            onBeforeLoad(win) {
                if('confirm' in win) {
                    cy.stub(win, 'confirm')
                        .as('confirm')
                        .returns(false);
                }      
            }
        });

        cy.get('#confirmButton').click();
        cy.get('@confirm').should('have.be.calledOnceWith', 'Do you confirm action?');
        cy.get('#confirmResult').should('have.text', 'You selected Cancel');
    })
})