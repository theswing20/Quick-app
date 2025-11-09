import { cn } from "@/shared/lib/utils";
import countries from "countries-phone-masks";
import { useMemo, useRef, useState } from "react";
import { Platform, TextInput, View } from "react-native";
import { useMaskedInputProps } from "react-native-mask-input";
import CountryPhoneSelect, { type Country } from "./country-phone-select";

function PhoneInput() {
  // Find UAE (Dubai) as default country
  const defaultCountry = useMemo(() => {
    const uaeCountry = countries.find(
      (country: Country) =>
        country.name.toLowerCase().includes("united arab emirates") ||
        country.name.toLowerCase().includes("uae") ||
        country.iso === "AE"
    );
    return uaeCountry || (countries[0] as Country | undefined);
  }, []);

  const [inputValue, setInputValue] = useState(
    defaultCountry ? defaultCountry.code + " " : ""
  );
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
    defaultCountry
  );
  const countrySelectRef = useRef<{ open: () => void } | null>(null);

  // Find country by code
  const findCountryByCode = (code: string): Country | undefined => {
    if (!code.startsWith("+")) return undefined;
    const codeWithoutPlus = code.slice(1);
    return countries.find((country: Country) => {
      const countryCode = country.code.replace("+", "");
      return countryCode === codeWithoutPlus;
    });
  };

  // Try to detect country code from input (try from longest to shortest)
  const detectCountry = (value: string): Country | undefined => {
    if (!value.startsWith("+")) return undefined;

    // Try codes from longest to shortest (e.g., +971, +97, +9)
    for (let i = Math.min(value.length, 5); i >= 2; i--) {
      const possibleCode = value.slice(0, i);
      const country = findCountryByCode(possibleCode);
      if (country) {
        return country;
      }
    }
    return undefined;
  };

  const handleInputChange = (value: string) => {
    // Try to detect country from input
    const detectedCountry = detectCountry(value);
    if (detectedCountry) {
      setSelectedCountry(detectedCountry);
      setInputValue(value);
    } else {
      // If country was selected but code changed, clear selection
      if (selectedCountry && !value.startsWith(selectedCountry.code)) {
        setSelectedCountry(undefined);
      }
      setInputValue(value);

      // Clear country if input is empty or doesn't start with +
      if (value === "" || !value.startsWith("+")) {
        setSelectedCountry(undefined);
      }
    }
  };

  // Convert mask string to react-native-mask-input format
  const maskArray = useMemo(() => {
    if (!selectedCountry?.mask || typeof selectedCountry.mask !== "string") {
      return undefined; // No mask if no country selected
    }

    return selectedCountry.mask.split("").map((char) => {
      if (char === "#") {
        return /\d/;
      }
      return char;
    });
  }, [selectedCountry?.mask]);

  // Extract phone number part (after country code)
  const getPhoneNumber = (value: string): string => {
    if (!selectedCountry) return value;
    const countryCode = selectedCountry.code;
    if (value.startsWith(countryCode)) {
      const phone = value.slice(countryCode.length).trim();
      return phone;
    }
    return value;
  };

  const phoneNumber = getPhoneNumber(inputValue);

  const maskedInputProps = useMaskedInputProps({
    value: phoneNumber,
    onChangeText: (text) => {
      const fullValue = selectedCountry
        ? selectedCountry.code + (text ? " " + text : "")
        : text;
      handleInputChange(fullValue);
    },
    mask: maskArray,
  });

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setInputValue(country.code + " ");
  };

  return (
    <View className="flex-row items-center gap-2">
      <CountryPhoneSelect
        ref={countrySelectRef}
        selectedCountry={selectedCountry}
        onCountryChange={handleCountrySelect}
      />
      <View
        className={cn(
          "dark:bg-input/30 border-input bg-background flex h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 shadow-sm shadow-black/5 sm:h-9",
          Platform.select({
            web: "outline-none transition-[color,box-shadow] focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          })
        )}
      >
        {selectedCountry ? (
          <TextInput
            {...maskedInputProps}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            className={cn(
              "flex-1 text-base text-foreground",
              Platform.select({
                web: "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none md:text-sm",
                native: "placeholder:text-muted-foreground/50",
              })
            )}
            style={{ padding: 0, margin: 0 }}
          />
        ) : (
          <TextInput
            value={inputValue}
            onChangeText={handleInputChange}
            placeholder="+971"
            keyboardType="phone-pad"
            className={cn(
              "flex-1 text-base text-foreground",
              Platform.select({
                web: "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none md:text-sm",
                native: "placeholder:text-muted-foreground/50",
              })
            )}
            style={{ padding: 0, margin: 0 }}
          />
        )}
      </View>
    </View>
  );
}

export default PhoneInput;
