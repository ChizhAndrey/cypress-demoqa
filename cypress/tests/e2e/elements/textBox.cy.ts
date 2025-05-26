import { textBoxPage, TextBoxUserData} from '../../../pages/TextBoxPage';

describe('Textbox', function() {
    
    beforeEach(() => {
        textBoxPage.visit();
    })

    it('Fill in and submit the form with valid data', function() {
        cy.fixture<TextBoxUserData>('validDataForTextBox').then(data => {
            textBoxPage.fillAndSubmitForm(data).checkOutputFields(data);
        });
    })

    it('Submit the form with empty fields', function() {
        textBoxPage
            .clearInputFields()
            .submitForm()
            .assertNoOutput();
    })

    it('Fill in and submit the form with the wrong email address', function() {
        cy.fixture<TextBoxUserData>('dataForTextBoxWithWrongEmail').then(data => {
            textBoxPage.fillAndSubmitForm(data).assertNoOutput();
            textBoxPage.assertEmailErrorState(data.userEmail);
        })
    })

    it('Resubmit the form after changing data', function() {
        const newData =  { userName: 'John Pee' };

        cy.fixture<TextBoxUserData>('validDataForTextBox').then(data => {
            textBoxPage.fillAndSubmitForm(data).checkOutputFields(data);
            textBoxPage.enterField('userName', newData.userName).submitForm();
            textBoxPage.checkOutputField('outputUserName', newData.userName);
        });
    })
})