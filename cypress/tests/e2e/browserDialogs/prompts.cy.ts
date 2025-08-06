
describe('Interacting with prompts', function() {
    it('Should display entered name after prompt is filled and confirmed', function() {
        cy.visit('/alerts' , {
            onBeforeLoad(win) {
                if('prompt' in win) {
                    cy.stub(win, 'prompt')
                        .as('prompt')
                        .returns('Andrey Chizh');
                }      
            }
        });

        cy.get('#promtButton').click();
        cy.get('@prompt').should('have.be.calledOnceWith', 'Please enter your name');
        cy.get('#promptResult').should('have.text', `You entered Andrey Chizh`);
    })

    it('Should not display result when prompt is cancelled', function() {
        cy.visit('/alerts' , {
            onBeforeLoad(win) {
                if('prompt' in win) {
                    cy.stub(win, 'prompt')
                        .as('prompt')
                        .returns(null);
                }      
            }
        });

        cy.get('#promtButton').click();
        cy.get('@prompt').should('have.be.calledOnceWith', 'Please enter your name');
        cy.get('#promptResult').should('not.exist');

        /**
         * Наблюдает за DOM в течение 6 секунд, чтобы убедиться, что элемент с указанным селектором
         * (#promptResult) не появляется в документе, даже спустя некоторое время после действия.
         *
         * Используется MutationObserver для активного отслеживания изменений в DOM.
         * Если элемент появляется в любое время в течение периода наблюдения — тест немедленно падает.
         *
         * Особенность: стандартные проверки вроде `cy.get(...).should('not.exist')`
         * могут пройти успешно, даже если элемент появится позже (например, через 3–5 секунд),
         * потому что они не "ждут" его появления — они просто проверяют текущее состояние.
         *
         * Этот подход гарантирует, что элемент не появится **в течение всего указанного времени**,
         * что критично для сценариев с асинхронным поведением, задержками или ошибками,
         * которые проявляются не сразу.
         */

        /* cy.window({ log: false }).then({ timeout: 6000 }, (win) => {
            return new Cypress.Promise((resolve, reject) => {
                const observer = new MutationObserver(() => {
                    const el = win.document.querySelector('#promptResult');
                    if (el) {
                        observer.disconnect();
                        reject(new Error('Элемент #promptResult неожиданно появился'));
                    }
                });

                observer.observe(win.document.body, {
                    childList: true,
                    subtree: true,
                });

                setTimeout(() => {
                    observer.disconnect();
                    resolve(null);
                }, 5000);
            });
        }); */
    })
})