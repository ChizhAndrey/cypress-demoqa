
Cypress.Commands.add('clickUntil', (selector, conditionFn, maxAttempts = 3) => {
  let attempt = 0;

  const clickAndCheck = () => {
    if (attempt >= maxAttempts) {
      cy.log(`Достигнут лимит попыток: ${maxAttempts}`);
      return;
    }

    cy.get(selector).click(); 

    conditionFn().then((result) => {
      attempt++;

      if (result !== true) {
        clickAndCheck();
      }
    });
  };

  clickAndCheck();
});

Cypress.Commands.add('getIframeDocument', (selector) => {
    return cy.get(selector)
                .its('0.contentDocument')
                .should('exist');
}) 

Cypress.Commands.add('getIframeBody', (selector) => {
  return cy.getIframeDocument(selector).its('body');
})

Cypress.Commands.overwrite<'click', 'element'>('click', (originalFn, element, x, y, options) => {
    if(options && options.clicks) {
        options.log = false;     

        Cypress._.times(options.clicks - 1, () => {
            originalFn(element, x, y, options);
        });

        Cypress.log({
            $el: element,
            name: 'click',
            message: `Clicked ${options.clicks} times`,
            consoleProps: () => {
                return {
                    'Options': options,
                }
            }
        });
    }

    return originalFn(element, x, y, options);
})