
describe('Progress bar', function() {

    beforeEach(() => {
        cy.visit('/progress-bar');
    })

    it('Should start, pause at stop point, resume, and complete successfully', function() {
        const stopPoint = 50;

        //Checking initial properties
        cy.get('#progressBarContainer').within(() => {
            cy.get('div[role="progressbar"]')
                .should('have.attr', 'aria-valuenow', 0)
                .and('contain.class', 'bg-info')
                .and('have.css', 'background-color', 'rgb(23, 162, 184)');

            //Start progressbar
            cy.get('button')
                .contains('Start')
                .click();

            //Stop progressbar at 40%
            cy.get('div[role="progressbar"]', { timeout: 10000 })
                .should('have.attr', 'aria-valuenow', stopPoint)
                .get('button')
                .contains('Stop')
                .click();

            //Resuming progressbar
            cy.get('button').contains('Start').click();

            //Checking properties on completion
            cy.get('div[role="progressbar"]', { timeout: 10000 })
                .should('have.attr', 'aria-valuenow', 100)
                .and('have.class', 'bg-success')
                .and('have.css', 'background-color', 'rgb(40, 167, 69)');

            cy.get('#startStopButton').should('not.exist');
            cy.get('#resetButton').should('exist');
        })
    })

    it('Should take initial state after reset', function() {

        // Checking initial properties
        cy.get('#progressBarContainer').within(() => {
            cy.get('div[role="progressbar"]')
                .should('have.attr', 'aria-valuenow', 0)
                .and('contain.class', 'bg-info')
                .and('have.css', 'background-color', 'rgb(23, 162, 184)');

            // Start progressbar
            cy.get('button')
                .contains('Start')
                .click();

            // Checking properties on completion
            cy.get('div[role="progressbar"]', {timeout: 10000})
                .should('have.attr', 'aria-valuenow', 100)
                .and('contain.class', 'bg-success')
                .and('have.css', 'background-color', 'rgb(40, 167, 69)');

            cy.get('#startStopButton').should('not.exist');

            // Reset progressbar
            // Without wait, progress auto-starts — possible event handler conflict
            cy.wait(100);
            cy.get('#resetButton').click();
        
            // Checking properties after reset
            cy.get('button').should('have.text', 'Start');
            cy.get('div[role="progressbar"]')
                .should('have.attr', 'aria-valuenow', 0)
                .and('contain.class', 'bg-info')
                .and('have.css', 'background-color', 'rgb(23, 162, 184)');
        })
    })
})