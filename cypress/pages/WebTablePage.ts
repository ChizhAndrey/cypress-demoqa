import { faker } from "@faker-js/faker";
import { checkTableRowsForSubstring } from "../support/utilityFunctions";
const { _ } = Cypress;  //(Lodash)


interface UserData {
    firstName: string, 
    lastName: string, 
    userEmail: string, 
    age: number, 
    salary: number, 
    department: string,
}

type THC = "firstName" | "lastName" | "age" | "email" | "salary" | "department";

class WebTablePage {
    elements = {
        addNewRecordButton: () => cy.get("#addNewRecordButton"),
        firstNameField: () => cy.get("#firstName"),
        lastNameField: () => cy.get("#lastName"),
        emailField: () => cy.get("#userEmail"),
        ageField: () => cy.get("#age"),
        salaryField: () => cy.get("#salary"),
        departmentField: () => cy.get("#department"),
        submitButton: () => cy.get("#submit"),
        tableRows: () => cy.get(".rt-tr-group").children(),
        searchBox: () => cy.get("#searchBox"),
        firstNameHeader: () => cy.get(".rt-resizable-header:contains('First Name')"),
        pageSizeSelect: () => cy.get("select[aria-label='rows per page']"),
        pageSizeOptions: () => cy.get("select[aria-label='rows per page'] option"),
        pageChangeInput: () => cy.get("input[aria-label='jump to page']"),
        buttonPreviousPage: () => cy.get("button:contains('Previous')"),
        buttonNextPage: () => cy.get("button:contains('Next')"),
    }

    visit() {
        cy.visit("/webtables");
    }

    enterFirstNameToRegForm(firstName: string) {
        this.elements.firstNameField().clear().type(firstName);
    }

    enterLastNameToRegForm(lastName: string) {
        this.elements.lastNameField().clear().type(lastName);
    }

    enterEmailToRegForm(email: string) {
        this.elements.emailField().clear().type(email);
    }

    enterAgeToRegForm(age: number) {
        this.elements.ageField().clear().type(`${age}`);
    }

    enterSalaryToRegForm(salary: number) {
        this.elements.salaryField().clear().type(`${salary}`);
    }

    enterDepartmentToRegForm(department: string) {
        this.elements.departmentField().clear().type(department);
    }

    submit() {
        this.elements.submitButton().click();
    }

    fillAndSubmitRegForm(data: UserData) {
        this.enterFirstNameToRegForm(data.firstName);
        this.enterLastNameToRegForm(data.lastName);
        this.enterEmailToRegForm(data.userEmail);
        this.enterAgeToRegForm(data.age);
        this.enterSalaryToRegForm(data.salary);
        this.enterDepartmentToRegForm(data.department);
        this.submit();
    }

    createUserDataFromTableRow(data: string[]): UserData {
        return {
            firstName: data[0],
            lastName: data[1],
            userEmail: data[3],
            age: parseInt(data[2], 10),
            salary: parseInt(data[4], 10),
            department: data[5]
        }
    }

    createArrayObjectsFromTableRows($rows: JQuery<HTMLElement>) {
        const rowsArray: UserData[] = [];

        $rows.each((i, row) => {
            //Если строка пустая - пропускаем
            if(!row.classList.contains("-padRow")) {
                //Создаем из строки массив значений ячеек
                const rowArray = Array.from(row.children).map(cell => cell.textContent);

                //Создаем из массива объект и пушим в массив
                rowsArray.push(this.createUserDataFromTableRow(rowArray));
            }
        })

        return cy.wrap(rowsArray, {log: false});
    }

    deleteRowFromTable(userEmail: string) {
        this.elements.tableRows()
            .contains(userEmail)
            .parent()
            .find("span[title='Delete']")
            .click();  
    }

    updateRowInTable(userEmail: string) {
        this.elements.tableRows()
            .contains(userEmail)
            .parent()
            .find("span[title='Edit']")
            .click();
    }

    filterTableRowsBySearchWord(searchWord: string) {
        this.elements.searchBox()
            .clear()
            .type(searchWord);
    }

    checkTableRowsContainSearchWord(searchWord: string) {
        this.elements.tableRows().then($rows => checkTableRowsForSubstring($rows, searchWord));
    }

    sortTableByFirstName(sortOrder: "asc" | "desc") {
        switch(sortOrder) {
            case "asc": {
                this.elements.firstNameHeader()
                    .click()
                    .then(thc => {
                        expect(thc.attr("class")).to.include("-sort-asc");
                    });
                break;
            }

            case "desc": {
                this.elements.firstNameHeader()
                    .then(thc => {
                        _.times(2, () => cy.wrap(thc).click())
                    }).then(thc => {
                        expect(thc.attr("class")).to.include("-sort-desc");
                    })
                break;
            }
        }
    }

    checkColumnIsSortedInOrder(thc: THC, order: "asc" | "desc") {
        this.elements.tableRows().then($rows => {
            this.createArrayFromTableColumn($rows, thc).then(arr => {
                expect(arr).to.have.ordered.members(_.orderBy(arr, [], order));
            })
        })
    }

    createArrayFromTableColumn($rows: JQuery<HTMLElement>, thc: THC) {
        const arr: string[] = [];

        $rows.each((i, row) => {
            if(row.classList.contains("-padRow")) {
                return;
            }

            switch(thc) {
                case "firstName":
                    arr.push(row.children[0].textContent);
                    break;
            }
        })

        return cy.wrap(arr);
    }

    checkScalingOfNumberOfRowsInTable() {
        this.elements.pageSizeOptions().then($options => {
            $options.each(i => {
                this.elements.pageSizeSelect()
                    .select(i)
                    .should("have.value", ($options[i] as HTMLInputElement).value); 

                cy.get(".rt-tr-group").children()
                    .should("have.length", ($options[i] as HTMLInputElement).value);
            })
        })
    }

    fillTableWithGeneratedData(count: number) {
        const usersData = this.createUsersDataForWebTable(count);
        usersData.forEach(user => {
            this.elements.addNewRecordButton().click();
            this.fillAndSubmitRegForm(user);
        })
    }

    goToPreviousTablePage() {
        this.elements.buttonPreviousPage().click();
    }

    goToNextTablePage() {
        this.elements.buttonNextPage().click();
    }

    changePageByInput(pageNumber: number) {
        this.elements.pageChangeInput().type(`${pageNumber}`);
    }

    private createUsersDataForWebTable(count: number): UserData[] {
        const usersArray: UserData[] = [];

        for(let i = 0; i < count; i++) {
            const user: UserData = {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                userEmail: faker.internet.email(),
                age: faker.datatype.number({
                    "min": 18,
                    "max": 70
                }),
                salary: Math.round(faker.datatype.number({
                    "min": 1000,
                    "max": 40000
                }) / 1000) * 1000,
                department: faker.name.jobArea()
            }
    
            usersArray.push(user);
        }
    
        return usersArray;
    }
}

export default new WebTablePage();