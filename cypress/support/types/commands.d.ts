declare namespace Cypress {
  interface Chainable {
    /**
     * Кликает по элементу до тех пор, пока conditionFn не вернёт true или не исчерпан лимит попыток
     */
    clickUntil(
      selector: string,
      conditionFn: () => Cypress.Chainable<boolean>,
      maxAttempts?: number
    ): Chainable<void>;
  }
}