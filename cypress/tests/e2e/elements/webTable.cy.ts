import { webTablePage, WebTableEmployeeData, TableSize } from "../../../pages/WebTablePage";

describe('Web table', function() {

    beforeEach(() => {
        webTablePage.visit();
    })

    it('Add an employee to the web table using the registration form', function() {
        cy.fixture('dataForWebTableRegForm').then((data: WebTableEmployeeData) => {
            webTablePage
                .fillAndSubmitNewRegForm(data)
                .assertTableRowExists(data);
        })
    })

    it('Remove an employee from the web table', function() {
        const employeeEmail = "alden@example.com";

        webTablePage
            .deleteTableRow(employeeEmail)
            .assertEmployeeNotExists(employeeEmail);
    })

    it('Update an employee data in the web table', function() {
        const employeeEmail = "alden@example.com";

        cy.fixture("dataForWebTableRegForm").then((data: WebTableEmployeeData) => {
            webTablePage
                .updateTableRow(employeeEmail)
                .fillAndSubmitEditRegForm(data)
                .assertEmployeeNotExists(employeeEmail)
                .assertTableRowExists(data);
        })
    })

    it('Filter a web table by search word', function() {
        const searchWord = "erra";

        webTablePage
            .filterTableBySearchWord(searchWord)
            .checkTableRowsContainSearchWord(searchWord);
    })

    it('Sort the web table in ascending order by the «First Name» column', function() {
        webTablePage
            .setColumnSort('firstName', 'asc')
            .assertTableIsSortedAsc('firstName');
    })

    it('Sort the web table in descending order by the «First Name» column', function() {
        webTablePage
            .setColumnSort('firstName', 'desc')
            .assertTableIsSortedDesc('firstName');
    })

    it('Change the number of rows on a web table page', function() {
        const size: TableSize = '20';

        webTablePage
            .changeTablePageSize(size)
            .assertTablePageSize(size);
    })
})