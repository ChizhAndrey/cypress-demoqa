
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