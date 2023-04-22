import practiceFormPage from "../pages/PracticeFormPage";

describe("Student registration form", function() {
    beforeEach(() => {
        practiceFormPage.visit();
    })

    describe("Automated creation of tests based on generated data", function() {
        practiceFormPage.createStudentData(5).forEach((studentData, id) => {
            it(`[ID: ${id + 1}] Fill in and submit the student registration form`, function(){
                practiceFormPage.enterFirstName(studentData.firstName);
                practiceFormPage.enterLastName(studentData.lastName);
                practiceFormPage.enterUserEmail(studentData.email);
                practiceFormPage.selectGender(studentData.gender);
                practiceFormPage.enterUserPhoneNumber(studentData.mobileNumber);
                practiceFormPage.selectDateOfBirth(studentData.birthDate); 
                practiceFormPage.enterSubjects(studentData.studentSubjects)
                practiceFormPage.selectHobbies(studentData.studentHobbies)
                practiceFormPage.uploadFile(studentData.studentPicture);
                practiceFormPage.enterCurrentAddress(studentData.currentAddress);
                practiceFormPage.selectState(studentData.state);
                practiceFormPage.selectCity(studentData.city);
                practiceFormPage.submitForm();
                
                practiceFormPage.checkModalTitle("Thanks for submitting the form");
                practiceFormPage.checkModalTableData(studentData);
                practiceFormPage.closeModalDialogBox();
            })
        })
    })
})