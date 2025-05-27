import { countryToRegion } from "./countryToRegion";

export const regionToCountries: Record<string, string[]> = {};

for (const [country, region] of Object.entries(countryToRegion)) {
  if (!regionToCountries[region]) {
    regionToCountries[region] = [];
  }
  regionToCountries[region].push(country);
}