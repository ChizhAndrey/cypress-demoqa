import { faker } from '@faker-js/faker';

const studentGenders = ['Male', 'Female', 'Other'] as const;

const studentSubjects = [
    'Hindi', 'Maths', 'Computer Science', 'History', 'Economics', 
    'Physics', 'English', 'Chemistry', 'Biology', 'Social Studies', 'Arts'
] as const;

const studentHobbies = ['Sports', 'Reading', 'Music'] as const;

const statesAndCities = {
    'NCR': ['Delhi', 'Gurgaon', 'Noida'],
    'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
    'Haryana': ['Karnal', 'Panipat'],
    'Rajasthan': ['Jaipur', 'Jaiselmer']
} as const;


type StudentGender = typeof studentGenders;
type StudentSubject = typeof studentSubjects;
type StudentHobby = typeof studentHobbies;
type StateAndCity = typeof statesAndCities;
type State = keyof StateAndCity;

interface StudentData<State extends keyof StateAndCity>{
    firstName: string,
    lastName: string,
    gender: StudentGender[number],
    email: string,
    mobileNumber: string,
    birthDate: Date,
    subjects: StudentSubject[number][],
    hobbies: StudentHobby[number][],
    picture: string,
    currentAddress: string,
    state: State,
    city: StateAndCity[State][number],
}

class PracticeForm {
    elements = {
        practiceForm: () => cy.get('.practice-form-wrapper'),
        userForm: () => cy.get('#userForm'),
        firstNameField: () => cy.get('#firstName'),
        lastNameField: () => cy.get('#lastName'),
        userEmailField: () => cy.get('#userEmail'),
        genderWrapper: () => cy.get('#genterWrapper'),
        userNumberField: () => cy.get('#userNumber'),
        reactDatePicker: () => cy.get('.react-datepicker'),
        dateOfBirthSelectField: () => cy.get('#dateOfBirthInput'),
        monthPicker: () => cy.get('.react-datepicker__month-select'),
        yearPicker: () => cy.get('.react-datepicker__year-select'),
        monthListBox: () => cy.get('.react-datepicker__month'),
        subjectsField: () => cy.get('#subjectsInput'),
        hobbiesWrapper: () => cy.get('#hobbiesWrapper'),
        uploadPictureField: () => cy.get('#uploadPicture'),
        currentAddressField: () => cy.get('#currentAddress'),
        stateCityWrapper: () => cy.get('#stateCity-wrapper'),
        statePicker: () => cy.get('#state'),
        cityPicker: () => cy.get('#city'),
        submitBtn: () => cy.get('#submit'),
        modalDialog: () => cy.get('div[role="document"].modal-dialog'),
        modalTable: () => cy.get('div[role="document"].modal-dialog').find('table'),
    }

    visit() {
        cy.visit('/automation-practice-form');
        this.elements.practiceForm().should('be.visible');
        return this;
    }

    enterFirstName(firstName: StudentData<State>['firstName']) {
        this.elements.firstNameField().clear().type(firstName);
        return this;
    }

    enterLastName(lastName: StudentData<State>['lastName']) {
        this.elements.lastNameField().clear().type(lastName);
        return this;
    }

    enterEmail(email: StudentData<State>['email']) {
        this.elements.userEmailField().clear().type(email);
        return this;
    }

    selectGender(gender: StudentData<State>['gender']) {
        this.elements.genderWrapper().within(() => {
            // Input is being covered by label
            cy.get(`input[name='gender'][value=${gender}]`)
                .invoke('attr', 'id')
                .then((id: string) => {
                    cy.get(`label[for='${id}']`).click();
                });
        })

        return this;
    }

    enterUserNumber(number: StudentData<State>['mobileNumber']) {
        this.elements.userNumberField().clear().type(number);
        return this;
    }

    selectDateOfBirthByDatePicker(birthDate: StudentData<State>['birthDate']) {
        const { year, month, dayWithMonth } = this.formatDateForSelection(birthDate);

        // Avoid .clear() — it breaks the page on DemoQA by clearing #app due to a JS bug
        //this.elements.dateOfBirthSelectField().clear().focus();

        this.elements.dateOfBirthSelectField().focus();
        this.selectMonthOfBirth(month)
            .selectYearOfBirth(year)
            .selectDayOfBirth(dayWithMonth);

        return this;
    }

    enterSubjects(subjects: StudentData<State>['subjects']) {
        // Avoid .clear() — it breaks the page on DemoQA by clearing #app due to a JS bug
        //this.elements.subjectsField().clear();
        subjects.forEach(subject => this.elements.subjectsField().type(`${subject}{enter}`));
        return this;
    }

    selectHobbies(hobbies: StudentData<State>['hobbies']) {
        hobbies.forEach(hobby => {
            this.elements.hobbiesWrapper()
                .find('label')
                .contains(hobby)
                .click()
        });

        return this;
    }

    uploadPicture(fileName: StudentData<State>['picture']) {
        const fixturesFolder = Cypress.config('fixturesFolder');
        this.elements.uploadPictureField().selectFile(`${fixturesFolder}/${fileName}`);
        return this;
    }

    enterCurrentAddress(address: StudentData<State>['currentAddress']) {
        this.elements.currentAddressField().clear().type(address);
        return this;
    }

    selectStateAndCity<S extends keyof StateAndCity>(state: S, city: StateAndCity[S][number]) {
        this.elements.stateCityWrapper().within(() => {
            this.elements.statePicker()
                .click()
                .find('div')
                .contains(state)
                .click();
            
            this.elements.cityPicker()
                .click()
                .find('div')
                .contains(city)
                .click();
        });

        return this;
    }

    submitForm() {
        this.elements.submitBtn().click();
        return this;
    }

    fillForm(student: StudentData<State>) {
        practiceFormPage
            .enterFirstName(student.firstName)
            .enterLastName(student.lastName)
            .enterEmail(student.email)
            .selectGender(student.gender)
            .enterUserNumber(student.mobileNumber)
            .selectDateOfBirthByDatePicker(student.birthDate)
            .enterSubjects(student.subjects)
            .selectHobbies(student.hobbies)
            .uploadPicture(student.picture)
            .enterCurrentAddress(student.currentAddress)
            .selectStateAndCity(student.state, student.city);

        return this;
    }

    assertModalTableData(studentData: StudentData<State>) {
        this.elements.modalTable().within(() => {
            cy.get('td').contains('Student Name').next().should('have.text', `${studentData.firstName} ${studentData.lastName}`);
            cy.get('td').contains('Student Email').next().should('have.text', studentData.email);
            cy.get('td').contains('Gender').next().should('have.text', studentData.gender);
            cy.get('td').contains('Mobile').next().should('have.text', studentData.mobileNumber.slice(0, 10)); // ???
            cy.get('td').contains('Date of Birth').next().should('have.text', this.formatDate(studentData.birthDate));
            cy.get('td').contains('Subjects').next().should('have.text', studentData.subjects.join(', '));
            cy.get('td').contains('Hobbies').next().should('have.text', studentData.hobbies.join(', '));
            cy.get('td').contains('Picture').next().should('have.text', studentData.picture);
            cy.get('td').contains('Address').next().should('have.text', studentData.currentAddress);
            cy.get('td').contains('State and City').next().should('have.text', `${studentData.state} ${studentData.city}`);
        })

        return this;
    }

    private formatDate(date: Date) {
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        const year = date.getFullYear();
        const month = months[date.getMonth()];
        const day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();

        return `${day} ${month},${year}`;
    }

    private selectMonthOfBirth(month: string) {
        this.elements.monthPicker().select(month);
        return this;
    }

    private selectYearOfBirth(year: string) {
        this.elements.yearPicker().select(year);
        return this;
    }

    private selectDayOfBirth(dayWithMonth: string) {
        this.elements.monthListBox().within(() => {
            cy.get('.react-datepicker__day')
                .filter(`[aria-label*='${dayWithMonth}']`)
                .click();
        })

        return this;
    }

    private formatDateForSelection(date: StudentData<State>['birthDate'])  {
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        function nthNumber(number: number) {
            return number > 0 ? ['th', 'st', 'nd', 'rd'][(number > 3 && number < 21) || number % 10 > 3 ? 0 : number % 10] : '';
        };

        return {
            year: `${date.getFullYear()}`,
            month: `${months[date.getMonth()]}`,
            dayWithMonth: `${months[date.getMonth()]} ${date.getDate()}${nthNumber(date.getDate())}`,
        }
    }

    createStudents(count: number): StudentData<State>[] {

        function randomStudentGender(): StudentGender[number] {
            const rand = faker.number.int({ min: 1, max: 100 });
            if (rand <= 45) return 'Male';
            if (rand <= 90) return 'Female';
            return 'Other'; // 10%; 
        }

        function randonStudentFirstName(gender: StudentGender[number]): StudentData<State>['firstName'] {
            if (gender === 'Male') {
                return faker.person.firstName('male');
            } else if (gender === 'Female') {
                return faker.person.firstName('female');
            } else {
                return faker.person.firstName(); 
            }
        }

        function randomStudentLastName(gender: StudentGender[number]): StudentData<State>['lastName'] {
            if (gender === 'Male') {
                return faker.person.lastName('male');
            } else if (gender === 'Female') {
                return faker.person.lastName('female');
            } else {
                return faker.person.lastName(); 
            }
        }

        function createStudentData() {
            const gender = randomStudentGender();
            const firstName = randonStudentFirstName(gender);
            const lastName = randomStudentLastName(gender);
            const state = faker.helpers.arrayElement(Object.keys(statesAndCities) as Array<keyof StateAndCity>);

            const studentsData: StudentData<typeof state> = {
                gender,
                firstName,
                lastName,
                state,
                email: faker.internet.email({firstName, lastName}),
                mobileNumber: `91${faker.string.numeric(8)}`,
                birthDate: faker.date.birthdate({min: 1922, max: 2008, mode: 'year'}),
                subjects: faker.helpers.arrayElements(studentSubjects, { min: 0, max: studentSubjects.length}),
                hobbies: faker.helpers.arrayElements(studentHobbies, { min: 0, max: studentHobbies.length}),
                picture: 'studentPhoto.jpg',
                currentAddress: `${faker.location.city()}, ${faker.location.streetAddress({ useFullAddress: true })}`,
                city: faker.helpers.arrayElement(statesAndCities[state]),
            }

            return studentsData;
        }

        return faker.helpers.multiple(createStudentData, { count });
    }
}

const practiceFormPage = new PracticeForm();

export { practiceFormPage };
export type { StudentData };