
describe('Tabs', function() {

    beforeEach(() => {
        cy.visit('/tabs');
    })

    it('Should handle tab switching correctly', function() {
        const activeNavTab = '#demo-tab-what';
        const inactiveNavTab = '#demo-tab-origin';
        const contentActiveTab = '#demo-tabpane-what';
        const contentInactiveTab = '#demo-tabpane-origin';

        //Check the initial state of the active tab title
        cy.get(activeNavTab)
            .should('have.attr', 'aria-selected', 'true')
            .and('contain.class', 'active')
            .and('have.css', 'color', 'rgb(73, 80, 87)');
        
        //Check the initial state of the active tab text
        cy.get(contentActiveTab)
            .should('be.visible')
            .and('have.attr', 'aria-hidden', 'false')
            .and('contain.class', 'active')
            .and('contain.class', 'show')
            .and('contain.text', 'Lorem Ipsum is simply dummy text');

        //Check the initial state of inactive tab title
        cy.get(inactiveNavTab)
            .should('have.attr', 'aria-selected', 'false')
            .and('not.contain.class', 'active')
            .and('have.css', 'color', 'rgb(0, 123, 255)');
        
        //Check initial state of inactive tab text
        cy.get(contentInactiveTab)
            .should('not.be.visible')
            .and('have.attr', 'aria-hidden', 'true')
            .and('not.contain.class', 'active')
            .and('not.contain.class', 'show');

        //Switching to origin tab
        cy.get(inactiveNavTab).click();

        //Check properties after switching
        cy.get(inactiveNavTab)
            .should('have.attr', 'aria-selected', 'true')
            .and('contain.class', 'active')
            .and('have.css', 'color', 'rgb(73, 80, 87)');
        
        cy.get(contentInactiveTab)
            .should('be.visible')
            .and('have.attr', 'aria-hidden', 'false')
            .and('contain.class', 'active')
            .and('contain.class', 'show')
            .and('contain.text', 'Contrary to popular belief, Lorem Ipsum');

        
        cy.get(activeNavTab)
            .should('have.attr', 'aria-selected', 'false')
            .and('not.contain.class', 'active')
            .and('have.css', 'color', 'rgb(0, 123, 255)');
        
        cy.get(contentActiveTab)
            .should('not.be.visible')
            .and('have.attr', 'aria-hidden', 'true')
            .and('not.contain.class', 'active')
            .and('not.contain.class', 'show');
    })
})