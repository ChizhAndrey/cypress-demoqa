import { faker } from "@faker-js/faker";
const { _ } = Cypress; 

type StudentGender = "Male" | "Female" | "Other";
type StudentSubject = "Hindi"| "Maths"| "Computer Science"| "History"| "Economics"| "Physics"| "English"| "Chemistry"| "Biology"| "Social Studies"| "Arts";
type StudentHobby = "Sports"| "Reading"| "Music";
type StateAndCity = {
    "NCR": ["Delhi", "Gurgaon", "Noida"],
    "Uttar Pradesh": ["Agra", "Lucknow", "Merrut"],
    "Haryana": ["Karnal", "Panipat"],
    "Rajasthan": ["Jaipur", "Jaiselmer"]
};

interface StudentData<State extends keyof StateAndCity>{
    firstName: string,
    lastName: string,
    gender: StudentGender,
    email: string,
    mobileNumber: string,
    birthDate: Date,
    studentSubjects: StudentSubject[],
    studentHobbies: StudentHobby[],
    studentPicture: string,
    currentAddress: string,
    state: State,
    city: StateAndCity[State][number],
}

class PracticeForm {
    elements = {
        userForm: () => cy.get("#userForm"),
        firstNameField: () => cy.get("#firstName"),
        lastNameField: () => cy.get("#lastName"),
        userEmailField: () => cy.get("#userEmail"),
        genderWrapper: () => cy.get("#genterWrapper"), //???
        userPhoneNumberField: () => cy.get("#userNumber"),
        dateOfBirthSelectionContainer: () => cy.get("#dateOfBirth"),
        dateOfBirthSelectionField: () => cy.get("#dateOfBirthInput"),
        subjectsField: () => cy.get("#subjectsInput"),
        hobbiesWrapper: () => cy.get("#hobbiesWrapper"), ///???
        fileUploadField: () => cy.get("input[type='file']"),
        currentAddressField: () => cy.get("#currentAddress"),
        stateSelectionField: () => cy.get("#state"),
        citySelectionField: () => cy.get("#city"),
        modalDialogBox: () => cy.get("div[class='modal-dialog modal-lg'][role='document']"),
        modalTitle: () => cy.get("#example-modal-sizes-title-lg"),
        modalTable: () => cy.get("div[class='modal-dialog modal-lg'][role='document']").find("table"),
        modalCloseButton: () => cy.get("#closeLargeModal"),
    }

    visit() {
        cy.visit("/automation-practice-form");
    }

    enterFirstName(firstName: string) {
        this.elements.firstNameField().clear().type(firstName);
    }

    enterLastName(lastName: string) {
        this.elements.lastNameField().clear().type(lastName);
    }

    enterUserEmail(userEmail: string) {
        this.elements.userEmailField().clear().type(userEmail);
    }

    selectGender(gender: string) {
        this.elements.genderWrapper().within(() => {
            cy.get(`input[name='gender'][value=${gender}]`).next().click(); ///???
        })
    }

    enterUserPhoneNumber(phoneNumber: string) {
        this.elements.userPhoneNumberField().clear().type(phoneNumber);
    }


    selectDateOfBirth(birthDate: Date) {
        const { year, month, dayWithMonth } = this.formatDateForSelection(birthDate);

        this.elements.dateOfBirthSelectionField().clear().click();
        this.selectMonthOfBirth(month);
        this.selectYearOfBirth(year);
        this.selectDayOfBirth(dayWithMonth);
    }

    enterSubjects(subjects: string[]) {
        this.elements.subjectsField().clear();
        subjects.forEach(subject => this.elements.subjectsField().type(`${subject}{enter}`));
    }

    selectHobbies(hobbies: string[]) {
        hobbies.forEach(hobby => this.elements.hobbiesWrapper()
            .find("label")
            .contains(hobby)
            .click());
    }

    uploadFile(fileName: string) {
        this.elements.fileUploadField().selectFile(`cypress/fixtures/${fileName}`);
    }

    enterCurrentAddress(address: string) {
        this.elements.currentAddressField().clear().type(address);
    }

    selectState(state: string) {
        this.elements.stateSelectionField().within(() => {
            cy.root().click();
            cy.get("div").contains(state).click();
        })
    }

    selectCity(city: string) {
        this.elements.citySelectionField().within(() => {
            cy.root().click();
            cy.get("div").contains(city).click();
        })
    }

    submitForm() {
        this.elements.userForm().submit();
    }

    checkModalTitle(title: string) {
        this.elements.modalDialogBox().within(() => {
            this.elements.modalTitle().should("have.text", title);
        })
    }

    checkModalTableData(studentData: StudentData<keyof StateAndCity>) {
        this.elements.modalTable().find("tbody").then(() => {
            cy.get("tr").contains("Student Name").parent().contains(`${studentData.firstName} ${studentData.lastName}`);
            cy.get("tr").contains("Student Email").parent().contains(studentData.email);
            cy.get("tr").contains("Gender").parent().contains(studentData.gender);
            cy.get("tr").contains("Mobile").parent().contains(studentData.mobileNumber);
            cy.get("tr").contains("Date of Birth").parent().contains(this.formatDateForTableValidation(studentData.birthDate));
            cy.get("tr").contains("Subjects").parent().contains(studentData.studentSubjects.join(", "));
            cy.get("tr").contains("Hobbies").parent().contains(studentData.studentHobbies.join(", "));
            cy.get("tr").contains("Picture").parent().contains(studentData.studentPicture);
            cy.get("tr").contains("Address").parent().contains(studentData.currentAddress);
            cy.get("tr").contains("State and City").parent().contains(`${studentData.state} ${studentData.city}`);
        })
    }

    closeModalDialogBox() {
        this.elements.modalDialogBox().within(() => this.elements.modalCloseButton().click());
        this.elements.modalDialogBox().should("not.exist");
    }

    private selectMonthOfBirth(month: string) {
        this.elements.dateOfBirthSelectionContainer().within(() => {
            cy.get(".react-datepicker__month-select").select(month);
        })
    }

    private selectYearOfBirth(year: string) {
        this.elements.dateOfBirthSelectionContainer().within(() => {
            cy.get(".react-datepicker__year-select").select(year);
        })
    }

    private selectDayOfBirth(dayWithMonth: string) {
        this.elements.dateOfBirthSelectionContainer().within(() => {
            cy.get(`[aria-label*="${dayWithMonth}"]`).click();
        })
    }

    private formatDateForSelection(date: Date) {
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

        function nthNumber(number: number) {
            return number > 0 ? ["th", "st", "nd", "rd"][(number > 3 && number < 21) || number % 10 > 3 ? 0 : number % 10]: "";
        };

        return {
            year: `${date.getFullYear()}`,
            month: `${months[date.getMonth()]}`,
            dayWithMonth: `${months[date.getMonth()]} ${date.getDate()}${nthNumber(date.getDate())}`,
        }
    }

    private formatDateForTableValidation(date: Date) {
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

        const year = date.getFullYear();
        const month = months[date.getMonth()];
        const day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();

        return `${day} ${month},${year}`;
    }

    createStudentData(count: number): StudentData<keyof StateAndCity>[] {
        const studentData: StudentData<keyof StateAndCity>[] = []; 
    
        const genders: StudentGender[] = ["Male", "Female", "Other"];
        const subjects: StudentSubject[] = ["Hindi", "Maths", "Computer Science", "History", "Economics", "Physics", "English", "Chemistry", "Biology", "Social Studies", "Arts"];
        const hobbies: StudentHobby[] = ["Sports", "Reading", "Music"];
        const stateAndCity: StateAndCity = {
            "NCR": ["Delhi", "Gurgaon", "Noida"],
            "Uttar Pradesh": ["Agra", "Lucknow", "Merrut"],
            "Haryana": ["Karnal", "Panipat"],
            "Rajasthan": ["Jaipur", "Jaiselmer"]
        };

        for(let i = 0; i < count; i++) {
            const gender = _.sample(genders)!;
            const firstName = (gender === "Other") ? faker.name.firstName() : (gender === "Male") ? faker.name.lastName("male") : faker.name.lastName("female");
            const lastName = (gender === "Other") ? faker.name.lastName() : (gender === "Male") ? faker.name.lastName("male") : faker.name.lastName("female");
            const state = _.sample(Object.keys(stateAndCity)) as keyof typeof stateAndCity;

            studentData.push({
                gender,
                firstName,
                lastName,
                state,
                email: faker.internet.email(firstName, lastName),
                mobileNumber: faker.phone.number("91########"),
                birthDate: faker.date.birthdate({min: 1922, max: 2008, mode: "year"}),
                studentSubjects: _.uniq(_.times(4, () => _.sample(subjects)!)),
                studentHobbies: _.uniq(_.times(4, () => _.sample(hobbies)!)),
                studentPicture: "studentPhoto.jpg",
                currentAddress: `${faker.address.cityName()}, ${faker.address.streetAddress()}`,
                city: _.sample(stateAndCity[state])!,
            })
        }
        
        return studentData;
    }
}


export default new PracticeForm();