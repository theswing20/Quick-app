import countries from "countries-phone-masks";
import { View } from "react-native";
import { Input } from "../input";
import { CountryPhoneSelect } from "./";
import { Country } from "./types";

export interface PhoneNumberValue {
  country: Country;
  phoneNumber: string;
}

export interface PhoneNumberProps {
  value: PhoneNumberValue;
  onChange: (value: PhoneNumberValue) => void;
}

function PhoneNumber({ value, onChange }: PhoneNumberProps) {
  const handleCountryChange = (country: Country) => {
    onChange({
      country,
      phoneNumber: country.code,
    });
  };

  const handlePhoneNumberChange = (text: string) => {
    if (!text) {
      return;
    }

    // Find country by exact code match (e.g., user typed just "+7")
    let country = findCountryByCode(text);

    if (country) {
      handleCountryChange(country);
      return;
    }

    // Find country by prefix (e.g., user typed "+77081360670")
    const countryByPrefix = findCountryByPrefix(text);
    
    onChange({
      country: countryByPrefix || value.country,
      phoneNumber: text,
    });
  };

  const findCountryByCode = (code: string) => {
    return countries.find((country: Country) => country.code === code);
  };

  const findCountryByPrefix = (phoneNumber: string) => {
    // Find all countries whose code matches the start of the phone number
    const matchingCountries = countries.filter((country: Country) => 
      phoneNumber.startsWith(country.code)
    );
    
    if (matchingCountries.length === 0) {
      return null;
    }
    
    // Return the country with the longest matching code (most specific match)
    // e.g., +1 vs +1242 for Bahamas numbers
    return matchingCountries.reduce((best: Country, current: Country) => 
      current.code.length > best.code.length ? current : best
    );
  };

  return (
    <View className="flex flex-row items-center gap-2">
      <CountryPhoneSelect
        selectedCountry={value.country}
        onCountryChange={handleCountryChange}
      />

      <Input
        className="flex-1"
        keyboardType="numeric"
        value={value.phoneNumber}
        onChangeText={handlePhoneNumberChange}
      />
    </View>
  );
}

export default PhoneNumber;
