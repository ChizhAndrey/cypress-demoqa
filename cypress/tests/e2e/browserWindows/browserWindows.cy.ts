
describe('Browser windows', function() {

    beforeEach(() => {
        cy.visit('/browser-windows', {
            onBeforeLoad(win) {
                if('open' in win) cy.spy(win, 'open').as('open');
            }
        });
    });


    it('Should open a new tab with sample page and display correct header', function() {
        cy.get('#tabButton').click();
        cy.get('@open')
            .should('be.calledOnceWith', '/sample')
            .its('firstCall.returnValue')
            .should('be.an', 'window')
            .and((childWindow: Window) => {
                const header = childWindow.document.getElementById('sampleHeading');
                const headerText = header?.innerText;
                expect(headerText).to.equal('This is a sample page');
            });
    })

    it('Should open a new window with sample page and display correct header', function() {
        cy.get('#windowButton').click();
        cy.get('@open')
            .should('have.been.calledOnceWith', '/sample', '_blank')
            .its('firstCall.returnValue')
            .should('be.an', 'window')
            .and((childWindow: Window) => {
                const header = childWindow.document.getElementById('sampleHeading');
                const headerText = header?.innerText;
                expect(headerText).to.equal('This is a sample page');
            });
    })

    it('Should open a message window and display correct text', function() {
        cy.get('#messageWindowButton').click();

        cy.get('@open')
            .should('have.been.calledOnceWith', '', 'MsgWindow')
            .its('firstCall.returnValue')
            .should('be.an', 'window')
            .and((childWindow: Window) => {
                const body = childWindow.document.body;
                const bodyText = body?.innerText;
                expect(bodyText).to.contain('Knowledge increases by sharing but not by saving.');
            })
    })
})