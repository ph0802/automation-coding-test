export type RaceSummary = {
    race_id: string;
    race_name: string;
    race_number: number;
    meeting_id: string;
    meeting_name: string;
    category_id: CategoryId;
    advertised_start: string;
    race_form: unknown;
    venue_id: string;
    venue_name: string;
    venue_state: string;
    venue_country: string;
};

export type NextRacesResponseData = {
    category_race_map: Record<CategoryId, { race_ids: string[] }>;
    race_summaries: Record<string, RaceSummary>;
};

export enum CategoryId {
    Thoroughbred = "4a2788f8-e825-4d36-9894-efd4baf1cfae",
    Greyhound = "9daef0d7-bf3c-4f50-921d-8e818c60fe61",
    Harness = "161d9be2-e909-4326-8c2c-35ed71fb460b",
}
