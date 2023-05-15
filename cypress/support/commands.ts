/// <reference types="cypress" />

import dayjs from "dayjs";
import { NextRacesResponseData } from "../@types/race";

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
            /**
             * Custom command to mock Next To Go races data
             *
             * @param options if `shouldIncludeExpiredRace` is true, the start time
             * of first race is over 5 minutes, which won't be able to display
             * in the list
             */
            mockNextToGoRaces(options?: {
                shouldIncludeExpiredRace: boolean;
            }): Chainable<JQuery<HTMLElement>>;
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

Cypress.Commands.add("mockNextToGoRaces", (options) => {
    // Jump time is exceeded for the first race
    const now = dayjs().add(-30, "second");

    // Always keep the latest start time for interception
    cy.fixture("nextRaces").then((races: NextRacesResponseData) => {
        const newRaces = races;
        Object.entries(races.race_summaries).forEach(([key], index) => {
            if (options?.shouldIncludeExpiredRace && index === 0) {
                newRaces.race_summaries[key].advertised_start = now
                    .add(-5, "minute")
                    .toISOString();
                return;
            }
            newRaces.race_summaries[key].advertised_start = now
                .add(20 * index, "second")
                .toISOString();
        });
        cy.intercept("GET", Cypress.env("nextRacesAPI"), newRaces).as(
            "getNextRaces"
        );
    });
});
