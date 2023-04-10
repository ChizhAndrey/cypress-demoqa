interface TextBoxUserData {
    userName?: string,
    userEmail?: string,
    currentAddress?: string,
    permanentAddress?: string
};

class TextBoxPage {
    elements = {
        userForm: () => cy.get("#userForm"),
        userName: () => cy.get("#userName.form-control"),
        userEmail: () => cy.get("#userEmail.form-control"),
        currentAddress: () => cy.get("#currentAddress.form-control"),
        permanentAddress: () => cy.get("#permanentAddress.form-control"),
        submitButton: () => cy.get("#submit"),
        output: () => cy.get("#output"),
        outputName: () => cy.get("#name"),
        outputEmail: () => cy.get("#email"),
        outputCurrentAddress: () => cy.get("#currentAddress"),
        outputPermanentAddress: () => cy.get("#permanentAddress"),
        outoutContainer: () => cy.get("#output").find("div"),
        outputFields: () => cy.get("#output").find("div").children(),
    };

    visit() {
        cy.visit("/text-box");
    }

    enterUserName(name: string) {
        return this.elements.userName().clear().type(name);
    }

    enterUserEmail(email: string) {
        return this.elements.userEmail().clear().type(email);
    }

    enterCurrentAddress(address: string) {
        return this.elements.currentAddress().clear().type(address);
    }

    enterPermanentAddress(address: string) {
        return this.elements.permanentAddress().clear().type(address);
    }

    submit() {
        return this.elements.submitButton().click();
    }

    fillAndSubmitTextBox(data: TextBoxUserData) {
        this.elements.userForm().within(() => {
            this.enterUserName(data.userName ? data.userName : `{selectAll}{backspace}`);
            this.enterUserEmail(data.userEmail ? data.userEmail : `{selectAll}{backspace}`);
            this.enterCurrentAddress(data.currentAddress ? data.currentAddress : `{selectAll}{backspace}`);
            this.enterPermanentAddress(data.permanentAddress ? data.permanentAddress : `{selectAll}{backspace}`);
            this.submit();
        });
    }

    checkOutput(data: TextBoxUserData) {
        this.elements.output().within(() => {
            this.elements.outputName().should("include.text", data.userName);
            this.elements.outputEmail().should("include.text", data.userEmail);
            this.elements.outputCurrentAddress().should("include.text", data.currentAddress);
            this.elements.outputPermanentAddress().should("include.text", data.permanentAddress);
        });
    }

    submitTextBoxWithEmptyFields() {
        this.elements.userForm().within(() => {
            this.elements.userName().clear();
            this.elements.userEmail().clear();
            this.elements.currentAddress().clear();
            this.elements.permanentAddress().clear();
            this.submit();
        });
    }
}

const textBoxPage = new TextBoxPage();

export { textBoxPage, TextBoxUserData };