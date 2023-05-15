import { CategoryId, CategoryName, RaceSummary } from "../@types/race";
import {
    CATEGORY_ID_GREYHOUND,
    CATEGORY_ID_HARNESS,
    CATEGORY_ID_THOROUGHBRED,
} from "../config/constants";

describe("Category Filters", () => {
    beforeEach(() => {
        cy.mockNextToGoRaces();
        cy.visit("/");

        cy.getByTestId(`category-filter-${CATEGORY_ID_THOROUGHBRED}`)
            .find("input[type='checkbox']")
            .as("ThoroughbredFilter");
        cy.getByTestId(`category-filter-${CATEGORY_ID_GREYHOUND}`)
            .find("input[type='checkbox']")
            .as("GreyhoundFilter");
        cy.getByTestId(`category-filter-${CATEGORY_ID_HARNESS}`)
            .find("input[type='checkbox']")
            .as("HarnessFilter");
    });

    const validateRaceItem = (
        races: RaceSummary[],
        filters: CategoryId[] = []
    ) => {
        let filterdRaces: RaceSummary[] = races;

        /**
         * Get specfic categories if filters are given
         * Note that if all categories are included, we don't want to filter it
         */
        if (filters.length && filters.length !== 3) {
            filterdRaces = filterdRaces.filter(
                (race) => !filters.includes(race.category_id)
            );
        }

        cy.getByTestId("race-list-item", { startWith: true }).each(
            (_, index) => {
                const { race_number, meeting_name } = filterdRaces[index];

                // Should match race number
                cy.getByTestId(`race-number-${index}`)
                    .contains("R")
                    .and("contain", race_number);

                // Should match meeting name
                cy.getByTestId(`meeting-name-${index}`).contains(meeting_name);
            }
        );
    };

    const filterAndValidate = (
        names: CategoryName[],
        categoryIds: CategoryId[],
        races: RaceSummary[],
        options: { shouldReset: boolean } = { shouldReset: true }
    ) => {
        names.forEach((name) => {
            cy.get(`@${name}Filter`).uncheck();
        });

        // Should display correct content after toggling filter checkbox
        validateRaceItem(races, categoryIds);

        // Reset filter
        if (options?.shouldReset) {
            names.forEach((name) => {
                cy.get(`@${name}Filter`).check();
            });
        }
    };

    it("Should validate that all checkboxes are checked by default", () => {
        cy.getByTestId("category-filter", { startWith: true }).each(
            ($filter) => {
                cy.wrap($filter)
                    .get("input[type='checkbox']")
                    .should("be.checked");
            }
        );
    });

    it("Should validate that checkboxes filter content appropriately", () => {
        // Wait for intercept data
        cy.wait("@getNextRaces").then((interception) => {
            const races = Object.values(
                interception.response?.body.race_summaries
            ) as RaceSummary[];

            // Filter one category - Thoroughbred
            filterAndValidate(
                [CategoryName.Thoroughbred],
                [CategoryId.Thoroughbred],
                races
            );

            // Filter one category - Greyhound
            filterAndValidate(
                [CategoryName.Greyhound],
                [CategoryId.Greyhound],
                races
            );

            // Filter one category - Harness
            filterAndValidate(
                [CategoryName.Harness],
                [CategoryId.Harness],
                races
            );

            // Filter two categories - Thoroughbred, Greyhound
            filterAndValidate(
                [CategoryName.Thoroughbred, CategoryName.Greyhound],
                [CategoryId.Thoroughbred, CategoryId.Greyhound],
                races
            );

            // Filter two categories - Thoroughbred, Harness
            filterAndValidate(
                [CategoryName.Thoroughbred, CategoryName.Harness],
                [CategoryId.Thoroughbred, CategoryId.Harness],
                races
            );

            // Filter two categories - Greyhound, Harness
            filterAndValidate(
                [CategoryName.Greyhound, CategoryName.Harness],
                [CategoryId.Greyhound, CategoryId.Harness],
                races,
                { shouldReset: false }
            );
        });
    });

    it("Should validate that unchecking all checkboxes re-enables all", () => {
        // Wait for intercept data
        cy.wait("@getNextRaces").then((interception) => {
            const races = Object.values(
                interception.response?.body.race_summaries
            ) as RaceSummary[];

            // Filter all categories
            filterAndValidate(
                [
                    CategoryName.Thoroughbred,
                    CategoryName.Greyhound,
                    CategoryName.Harness,
                ],
                [
                    CategoryId.Thoroughbred,
                    CategoryId.Greyhound,
                    CategoryId.Harness,
                ],
                races,
                { shouldReset: false }
            );
        });
    });
});
