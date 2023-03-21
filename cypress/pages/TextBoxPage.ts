interface UserData {
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

    fillAndSubmitTextBox(data: UserData) {
        this.elements.userForm().within(() => {
            this.enterUserName(data.userName);
            this.enterUserEmail(data.userEmail);
            this.enterCurrentAddress(data.currentAddress);
            this.enterPermanentAddress(data.permanentAddress);
            this.submit();
        });
    }

    checkOutput(data: UserData) {
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

export default new TextBoxPage();