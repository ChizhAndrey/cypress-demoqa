import { practiceFormPage } from 'cypress/pages/PracticeFormPage'

describe('Student registration form', function() {

    beforeEach(() => {
        practiceFormPage.visit();
    })

    it('Register the student and check the registration data in the modal table', function() {
        const student = Cypress._.sample(practiceFormPage.createStudents(10))!;

        expect(student, 'student should be defined').not.to.be.empty;

        practiceFormPage
            .fillForm(student)
            .submitForm()
            .assertModalTableData(student);
    })
})
