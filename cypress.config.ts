import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    nextRacesAPI:
      "/v2/racing/next-races-category-group?count=5&categories=%5B%224a2788f8-e825-4d36-9894-efd4baf1cfae%22%2C%229daef0d7-bf3c-4f50-921d-8e818c60fe61%22%2C%22161d9be2-e909-4326-8c2c-35ed71fb460b%22%5D"
  },
  e2e: {
    baseUrl: 'http://localhost:3000/',
  },
});
