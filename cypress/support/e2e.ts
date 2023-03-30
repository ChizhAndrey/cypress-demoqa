// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************


import './commands'

// Hide fetch/XHR requests
if (Cypress.config("hideXHRAndFetch")) { 
    const app = window.top; 
    
    if(app) {
        if (!app.document.head.querySelector("[data-hide-command-log-request]")) { 
            const style = app.document.createElement("style"); 
            style.innerHTML = ".command-name-request, .command-name-xhr {display: none}"; 
            style.setAttribute("data-hide-command-log-request", ""); 
            app.document.head.appendChild(style); 
        } 
    }
}

//Hide uncaught exceptions
if(Cypress.config("hideExc")) {
    const app = window.top; 

    Cypress.on("uncaught:exception", (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    })

    if(app) {
        if(!app.document.head.querySelector("[data-hide-unhandled-exception-log]")) {
            const style = app.document.createElement("style");
            style.innerHTML = ".command-name-uncaught-exception {display: none}";
            style.setAttribute("data-hide-unhandled-exception-log", "");
            app.document.head.appendChild(style);
        }
    }
}
