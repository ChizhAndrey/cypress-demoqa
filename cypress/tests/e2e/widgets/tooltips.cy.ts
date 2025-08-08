import 'cypress-real-events';

describe('Tooltips', function() {

    beforeEach(() => {
        cy.visit('/tool-tips');
    })

    it('Should display correct tooltip on hover for each annotated element', function() {
        const verifyTooltip = (selector: string, tooltipId: string, expectedText: string) => {
            cy.get(selector)
                .realHover()
                .get(`div[role="tooltip"]`)
                .should('be.visible')
                .and('have.attr', 'id', tooltipId)
                .get(`div[role="tooltip"] .tooltip-inner`)
                .should('have.text', expectedText);

            // Make sure the tooltip disappears after the cursor leaves
            cy.get('body').realHover({ position: 'topLeft' }); 
            cy.get(`div[role="tooltip"]`).should('not.exist');
        };

        verifyTooltip('#toolTipButton', 'buttonToolTip', 'You hovered over the Button');
        verifyTooltip('#texFieldToolTopContainer', 'textFieldToolTip', 'You hovered over the text field');
        verifyTooltip('a:contains("Contrary")', 'contraryTexToolTip', 'You hovered over the Contrary');
        verifyTooltip('a:contains("1.10.32")', 'sectionToolTip', 'You hovered over the 1.10.32');
    })
})