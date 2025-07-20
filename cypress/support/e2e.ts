import './commands/commands';

beforeEach(() => {
    if (Cypress.config('hideXHRAndFetch')) {
        
        // Hide fetch/XHR requests from Command Log
        cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });

        
    }
})

const handleUncaughtException: Cypress.UncaughtExceptionCallback = (err) => {
  console.warn('Ignored uncaught exception:', err.message);

  // Returning false here prevents Cypress from failing the test
  return false;
}

if(Cypress.config('hideUncaughtExc')) {
    const app = window.top; 

    // Ignore uncaught exceptions
    Cypress.on('uncaught:exception', handleUncaughtException);

    // Hide uncaught exception in UI
    if(app) {
        if(!app.document.head.querySelector("[data-hide-unhandled-exception-log]")) {
            const style = app.document.createElement("style");
            style.innerHTML = ".command-name-uncaught-exception {display: none}";
            style.setAttribute("data-hide-unhandled-exception-log", "");
            app.document.head.appendChild(style);
        }
    }
}
