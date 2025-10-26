import { Text } from "@/shared/ui/text";
import * as Location from "expo-location";
import { AppleMaps, CameraPosition, GoogleMaps } from "expo-maps";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

const CAMERA_POSITION: CameraPosition = {
  coordinates: {
    latitude: 25.2048,
    longitude: 55.2708,
  },
  zoom: 11,
};

function MapView() {
  const ref = useRef<AppleMaps.MapView>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      ref.current?.setCameraPosition({
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        zoom: 13,
      });
    }

    getCurrentLocation();
  }, []);

  if (Platform.OS === "ios") {
    return (
      <>
        <AppleMaps.View
          ref={ref}
          style={{ flex: 1, height: "100%", width: "100%" }}
          uiSettings={{
            myLocationButtonEnabled: false,
            togglePitchEnabled: false,
          }}
          properties={{
            isMyLocationEnabled: true,
          }}
          cameraPosition={CAMERA_POSITION}
        />
      </>
    );
  } else if (Platform.OS === "android") {
    return (
      <GoogleMaps.View
        ref={ref}
        style={{ flex: 1, height: "100%", width: "100%" }}
        uiSettings={{
          myLocationButtonEnabled: false,
          togglePitchEnabled: false,
        }}
        properties={{
          isMyLocationEnabled: true,
        }}
        cameraPosition={CAMERA_POSITION}
      />
    );
  } else {
    return <Text>Maps are only available on Android and iOS</Text>;
  }
}

export default MapView;
