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

    let country = findCountryByCode(text);

    if (country) {
      handleCountryChange(country);
      return;
    }

    onChange({
      country: value.country,
      phoneNumber: text,
    });
  };

  const findCountryByCode = (code: string) => {
    return countries.find((country: Country) => country.code === code);
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
