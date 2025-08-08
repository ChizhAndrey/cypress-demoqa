
describe('Date picker', function() {

    function formatDateForSelection(date: Date, withTime?: boolean) {
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        function nthNumber(number: number) {
            return number > 0 ? ['th', 'st', 'nd', 'rd'][(number > 3 && number < 21) || number % 10 > 3 ? 0 : number % 10]: '';
        };
        
        return {
            year: `${date.getFullYear()}`,
            month: `${months[date.getMonth()]}`,
            day: `${date.getDate()}`,
            dayWithMonth: `${months[date.getMonth()]} ${date.getDate()}${nthNumber(date.getDate())}`,
            time: withTime ? `${date.getHours()}:${date.getMinutes()}` : '',
            twelveHourFormatTime: `${date.toLocaleString('ru-RU', {hour: 'numeric', minute: 'numeric', hour12: true})}`,
        }
    }

    beforeEach(() => {
        cy.visit('/date-picker');
    })

    it('Should select date in the date picker', function() {
        const date = '1994-10-14';
        const dateObj = formatDateForSelection(new Date(date));

        cy.get('#datePickerMonthYearInput').click();
        cy.get('.react-datepicker__month-select').select(dateObj.month);
        cy.get('.react-datepicker__year-select').select(dateObj.year);
        cy.get(`.react-datepicker__day[aria-label*='${dateObj.dayWithMonth}']`).click();

        cy.get('#datePickerMonthYearInput')
            .should('have.value', `${date.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2/$3/$1')}`); 
    })

    it('Should select date and time in the date-time picker', function() {
        const dateWithTime = '2007-07-07T06:45:00';
        const dateWithTimeObj = formatDateForSelection(new Date(dateWithTime), true);


        cy.get('#dateAndTimePickerInput').click();
        cy.get('.react-datepicker__month-read-view').click();

        cy.get('.react-datepicker__month-option')
            .contains(dateWithTimeObj.month)
            .click();

        cy.get('.react-datepicker__year-read-view').click();
        cy.get('.react-datepicker__year-option').then($opt => {
            const firstOption = $opt[1].textContent!; //2028
            const lastOption = $opt[$opt.length - 2].textContent!; //2018

            if(dateWithTimeObj.year >= lastOption && dateWithTimeObj.year <= firstOption) {
                cy.get('.react-datepicker__year-option')
                    .contains(dateWithTimeObj.year)
                    .click();
            } else {
                const difference = (dateWithTimeObj.year < lastOption) 
                    ? +lastOption - +dateWithTimeObj.year 
                    : +dateWithTimeObj.year - +firstOption; 

                if(dateWithTimeObj.year < lastOption) {
                    cy.get('.react-datepicker__navigation--years-previous').click(5, 5, {clicks: difference});
                } else {
                    cy.get('.react-datepicker__navigation--years-upcoming').click(5, 5, {clicks: difference});
                }

                cy.get('.react-datepicker__year-option')
                        .contains(dateWithTimeObj.year)
                        .click();
            }
        })

        cy.get(`.react-datepicker__day[aria-label*='${dateWithTimeObj.dayWithMonth}']`).click();

        cy.get('.react-datepicker__time-list-item ')
            .contains(dateWithTimeObj.time)
            .click();
        
        cy.get('#dateAndTimePickerInput')
            .should('have.value', `${dateWithTimeObj.month} ${dateWithTimeObj.day}, ${dateWithTimeObj.year} ${dateWithTimeObj.twelveHourFormatTime}`);
    })
})