import { RaceSummary } from "../@types/race";
import { RACING_CATEGORIES } from "../config/constants";

describe("Page Content", () => {
    beforeEach(() => {
        cy.mockNextToGoRaces();
        cy.visit("/");
    });

    it("Should correctly display page title", () => {
        cy.getByTestId("page-title").contains("Next To Go Races");
    });

    it("Should display expected values for race row contents", () => {
        // Race number, venue name, time to jump
        cy.wait("@getNextRaces").then((interception) => {
            const raceSummaries = Object.values(
                interception.response?.body.race_summaries
            ).slice(1, 6) as RaceSummary[]; // Note that the first race of fixture won't display

            raceSummaries.forEach((race, index) => {
                // Should match meeting name
                cy.getByTestId(`meeting-name-${index}`).contains(
                    race.meeting_name
                );

                cy.getByTestId(`race-number-${index}`).contains(
                    `R${race.race_number}`
                );

                cy.getByTestId(`count-down-${index}`).should("be.visible");
            });
        });
    });

    it("Should correctly display filters", () => {
        cy.getByTestId("category-filters").within(() => {
            // Filters should have checkbox and correct category name
            RACING_CATEGORIES.forEach(({ name, categoryId }) => {
                cy.getByTestId(`category-filter-${categoryId}`)
                    .should("be.visible")
                    .and(
                        "have.descendants",
                        "[data-testid='category-filter-checkbox']"
                    )
                    .and("contain", name);
            });
        });
    });
});
