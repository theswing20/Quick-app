import countries from "countries-phone-masks";
import { create } from "zustand";
import { Country } from ".";

interface CountryStore {
  countries: Country[];
  selectedCountry: Country | undefined;
  setSelectedCountry: (country: Country | undefined) => void;
  findCountryByCode: (code: string) => Country | undefined;
  getDefaultCountry: () => Country | undefined;
  initializeDefaultCountry: () => void;
}

export const useCountryStore = create<CountryStore>((set, get) => ({
  countries: countries as Country[],

  selectedCountry: undefined,

  setSelectedCountry: (country) => {
    set({ selectedCountry: country });
  },

  findCountryByCode: (code: string) => {
    if (!code.startsWith("+")) return undefined;
    const codeWithoutPlus = code.slice(1);
    const { countries } = get();
    return countries.find((country: Country) => {
      const countryCode = country.code.replace("+", "");
      return countryCode === codeWithoutPlus;
    });
  },

  getDefaultCountry: () => {
    const { countries } = get();
    const uaeCountry = countries.find(
      (country: Country) =>
        country.name.toLowerCase().includes("united arab emirates") ||
        country.name.toLowerCase().includes("uae") ||
        country.iso === "AE"
    );
    return uaeCountry || (countries[0] as Country | undefined);
  },

  initializeDefaultCountry: () => {
    const { getDefaultCountry, selectedCountry } = get();
    if (!selectedCountry) {
      const defaultCountry = getDefaultCountry();
      set({ selectedCountry: defaultCountry });
    }
  },
}));
