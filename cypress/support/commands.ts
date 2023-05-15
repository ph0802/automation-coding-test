/// <reference types="cypress" />

export {};

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to select DOM element by data-testid attribute.
             * @example
             * cy.selectByTestId("side-menu-racing", { selector: "find", startWith: true })
             */
            getByTestId(
                testId: string,
                options?: {
                    startWith?: boolean;
                    endWith?: boolean;
                }
            ): Chainable<JQuery<HTMLElement>>;
        }
    }
}

Cypress.Commands.add("getByTestId", (testId, options) => {
    const { startWith, endWith } = options || {};

    switch (true) {
        case startWith:
            return cy.get(`[data-testid^=${testId}]`);
        case endWith:
            return cy.get(`[data-testid$=${testId}]`);
        default:
            return cy.get(`[data-testid=${testId}]`);
    }
});
