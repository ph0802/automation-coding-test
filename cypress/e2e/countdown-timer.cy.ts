import dayjs from "dayjs";
import { NextRacesResponseData } from "../@types/race";

describe("Countdown Timer", () => {
    beforeEach(() => {
        cy.mockNextToGoRaces({ shouldIncludeExpiredRace: true });
        cy.visit("/");
    });

    it("Should validate that timer is ticking down", () => {
        cy.getByTestId("count-down-1").as("SecondCountDown");
        cy.get("@SecondCountDown")
            .invoke("text")
            .then((countDownBefore) => {
                const before = Number(countDownBefore.replace("s", " "));

                // Compare the value after 1 sec
                cy.wait(1000);

                // Expect the countdown should tick down
                cy.get("@SecondCountDown")
                    .invoke("text")
                    .should("eq", `${before - 1}s`);
            });
    });

    it("Should validate that race time sign swaps to negative when expected jump time is exceeded", () => {
        cy.wait("@getNextRaces").then((interception) => {
            const { race_summaries } = interception.response
                ?.body as NextRacesResponseData;

            const startTime = Object.values(race_summaries)[0].advertised_start;
            const diffFromNow = dayjs(startTime).diff(dayjs(), "second");

            expect(diffFromNow).to.be.below(0);
            cy.getByTestId("count-down-0").contains("-");
        });
    });

    it("Should validate that races do not display after 5 minutes past the jump", () => {
        cy.wait("@getNextRaces").then((interception) => {
            const { race_summaries } = interception.response
                ?.body as NextRacesResponseData;

            // Note: first fixture has jumpped 5 minutes ago
            const expiredRace = Object.values(race_summaries)[0];
            cy.getByTestId("meeting-name-0").should(
                "not.have.text",
                expiredRace.meeting_name
            );
        });
    });
});
