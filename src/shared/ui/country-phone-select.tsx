import { cn } from "@/shared/lib/utils";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import countries from "countries-phone-masks";
import { Image } from "expo-image";
import { ChevronDown } from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { Input } from "./input";

export interface Country {
  name: string;
  code: string;
  iso: string;
  flag: string;
  mask: string;
}

interface CountryPhoneSelectProps {
  selectedCountry?: Country;
  onCountryChange?: (country: Country) => void;
}

const CountryPhoneSelect = React.forwardRef<
  { open: () => void },
  CountryPhoneSelectProps
>(({ selectedCountry: externalSelectedCountry, onCountryChange }, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["90%"], []);

  // Find UAE (Dubai) as default country
  const defaultCountry = useMemo(() => {
    return (
      countries.find(
        (country: Country) =>
          country.name.toLowerCase().includes("united arab emirates") ||
          country.name.toLowerCase().includes("uae") ||
          country.iso === "AE"
      ) || countries[0]
    );
  }, []);

  const [internalSelectedCountry, setInternalSelectedCountry] =
    useState<Country>(defaultCountry);

  const selectedCountry = externalSelectedCountry ?? internalSelectedCountry;
  const [search, setSearch] = useState("");

  const filteredCountries = useMemo(() => {
    if (search.length === 0) return countries;

    return countries.filter((country: Country) =>
      country.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // Expose open method via ref
  React.useImperativeHandle(ref, () => ({
    open: handlePresentModalPress,
  }));

  const handleCountrySelect = useCallback(
    (country: Country) => {
      if (!externalSelectedCountry) {
        setInternalSelectedCountry(country);
      }
      onCountryChange?.(country);
      bottomSheetModalRef.current?.dismiss();
    },
    [externalSelectedCountry, onCountryChange]
  );

  const renderCountryItem = useCallback(
    (country: Country, index: number) => {
      const isLast = index === filteredCountries.length - 1;
      return (
        <Pressable
          key={country.iso}
          onPress={() => handleCountrySelect(country)}
          className={cn(
            "flex-row items-center gap-3 px-4 py-3 active:bg-accent",
            !isLast && "border-b border-border/50"
          )}
        >
          <View
            className="overflow-hidden rounded-sm"
            style={{ width: 28, height: 21 }}
          >
            <Image
              source={{ uri: country.flag }}
              style={{ width: 28, height: 21 }}
              contentFit="cover"
            />
          </View>
          <View className="flex-row items-center justify-between flex-1">
            <Text className="text-base font-medium text-foreground">
              {country.name}
            </Text>
            <Text className="text-base font-medium text-muted-foreground">
              {country.code}
            </Text>
          </View>
        </Pressable>
      );
    },
    [handleCountrySelect, filteredCountries.length]
  );

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={"close"}
      />
    );
  }, []);

  return (
    <View className="">
      <Pressable
        onPress={handlePresentModalPress}
        className={cn(
          "dark:bg-input/30 border-input bg-background flex h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 shadow-sm shadow-black/5 sm:h-9",
          Platform.select({
            web: "outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          })
        )}
      >
        <View
          className="mr-2 overflow-hidden rounded-sm"
          style={{ width: 24, height: 18 }}
        >
          <Image
            source={{ uri: selectedCountry.flag }}
            style={{ width: 24, height: 18 }}
            contentFit="cover"
          />
        </View>
        <Text className="flex-1 text-base font-medium text-foreground">
          {selectedCountry.code}
        </Text>
        <ChevronDown size={20} color="#737373" />
      </Pressable>
      <BottomSheetModal
        index={0}
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
      >
        <BottomSheetScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="px-4 pt-4 pb-2">
            <Input
              placeholder="Search the country"
              value={search}
              onChangeText={setSearch}
              className="mb-2"
            />
          </View>

          <View className="flex flex-col">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country, index) =>
                renderCountryItem(country, index)
              )
            ) : (
              <View className="items-center px-4 py-8">
                <Text className="text-center text-muted-foreground">
                  No countries found
                </Text>
              </View>
            )}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
});

CountryPhoneSelect.displayName = "CountryPhoneSelect";

export default CountryPhoneSelect;
