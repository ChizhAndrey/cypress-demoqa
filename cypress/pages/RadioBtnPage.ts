
class RadioBtnPage {
    elements = {
        successMessage: () => cy.get('.text-success'),
    }

    visit() {
        cy.visit('/radio-button');
        return this;
    }

    getRadioBtnById(id: string): Cypress.Chainable<HTMLInputElement> {
        return cy.get(`input[type='radio'][id='${id}']`);
    }

    getLabelForInputId(id: string): Cypress.Chainable<HTMLLabelElement> {
        return cy.get(`label[for='${id}']`);
    }

    checkRadioBtn(id: string) {
        // input перекрыт, выбираем радио через label
        this.getLabelForInputId(id).click();
        return this;
    }

    assertTextSuccessHaveText(text: string) {
        this.elements.successMessage().should('have.text', text);
        return this;
    }
}

const radioBtnPage = new RadioBtnPage();

export { radioBtnPage };