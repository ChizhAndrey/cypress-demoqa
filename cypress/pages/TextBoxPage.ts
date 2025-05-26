interface TextBoxUserData {
    userName?: string,
    userEmail?: string,
    currentAddress?: string,
    permanentAddress?: string
};

type FormField = 
    'userName' | 
    'userEmail' | 
    'currentAddress' | 
    'permanentAddress';

type OutputField =
    'outputUserName' |
    'outputUserEmail' |
    'outputCurrentAddress' |
    'outputPermanentAddress';

function isFormField(val: any): val is FormField {
    const validFields: Record<FormField, true> = {
        userName: true,
        userEmail: true,
        currentAddress: true,
        permanentAddress: true
    };

    return val in validFields;
}

function isOutputFormField(val: any): val is OutputField {
    const validFields: Record<OutputField, true> = {
        outputUserName: true,
        outputUserEmail: true,
        outputCurrentAddress: true,
        outputPermanentAddress: true
    };

    return val in validFields;
}

class TextBoxPage {
    elements = {
        userForm: () => cy.get("#userForm"),
        userName: () => cy.get("#userName"),
        userEmail: () => cy.get("#userEmail"),
        currentAddress: () => cy.get("#currentAddress"),
        permanentAddress: () => cy.get("#permanentAddress"),
        submitButton: () => cy.get("#submit"),
        output: () => cy.get("#output"),
        outputUserName: () => cy.get("#name"),
        outputUserEmail: () => cy.get("#email"),
        outputCurrentAddress: () => cy.get("#currentAddress"),
        outputPermanentAddress: () => cy.get("#permanentAddress"),
        outputContainer: () => cy.get("#output").find("div"),
        outputFields: () => cy.get("#output").find("div").children(),
    };

    visit() {
        cy.visit("/text-box");
        this.elements.userForm().should("be.visible");

        return this;
    }

    enterField(field: FormField, value?: string) {
        this.elements[field]().clear();
        if(value !== undefined) this.elements[field]().type(value);

        return this;
    }

    submitForm() {
        this.elements.submitButton().click();

        return this;
    }

    fillForm(data: TextBoxUserData) {
        const entries = Object.entries(data);

        for(const [key, val] of entries) {
            if(isFormField(key)) {
                this.enterField(key, val);
            }
        }

        /* this.elements.userForm().within(() => {
            this.enterField('userName', data.userName);
            this.enterField('userEmail', data.userEmail);
            this.enterField('currentAddress', data.currentAddress);
            this.enterField('permanentAddress', data.permanentAddress);
        }); */

        return this;
    }

    fillAndSubmitForm(data: TextBoxUserData) {
        return this.fillForm(data).submitForm();
    }

    checkOutputField(outputField: OutputField, value?: string) {
        this.elements[outputField]().should('exist');

        if(value !== undefined) {
            this.elements[outputField]().should('contain.text', value);
        }

        return this;
    }

    checkOutputFields(data: TextBoxUserData) {
        const entries = Object.entries(data);

        for(const [key, val] of entries) {
            let field = `output${Cypress._.capitalize(key)}`;

            if(isOutputFormField(field)) {
                this.checkOutputField(field, val);
            }
        }

        /* this.elements.output().within(() => {
            this.checkOutputField('outputUserName', data.userName);
            this.checkOutputField('outputUserEmail', data.userEmail);
            this.checkOutputField('outputCurrentAddress', data.currentAddress);
            this.checkOutputField('outputPermanentAddress', data.permanentAddress);
        }); */

        return this;
    }

    clearInputFields() {
        this.elements.userName().clear();
        this.elements.userEmail().clear();
        this.elements.currentAddress().clear();
        this.elements.permanentAddress().clear();

        return this;
    }

    assertNoOutput() {
        this.elements.outputFields().should('not.be.exist');
        return this;
    }

    assertEmailErrorState(val: string) {
        this.elements.userEmail()
            .should('have.value', val)
            .and('have.class', 'field-error')
            .and("have.css", "border", "1px solid rgb(255, 0, 0)");

        return this;
    }
}

const textBoxPage = new TextBoxPage();

export { textBoxPage };
export type { TextBoxUserData };