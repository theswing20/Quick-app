import { Text } from "@/shared/ui/text";
import * as Location from "expo-location";
import { AppleMaps, CameraPosition, GoogleMaps } from "expo-maps";
import { useCallback, useEffect, useRef } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

const CAMERA_POSITION: CameraPosition = {
  coordinates: {
    latitude: 25.2048,
    longitude: 55.2708,
  },
  zoom: 11,
};

function MapView() {
  const ref = useRef<AppleMaps.MapView | GoogleMaps.MapView>(null);
  const lastZoomRef = useRef<number>(CAMERA_POSITION.zoom);

  const clampZoom = useCallback((zoom: number) => Math.min(21, Math.max(2, zoom)), []);

  const changeZoom = useCallback(
    async (delta: number) => {
      const map = ref.current;
      if (!map) {
        return;
      }

      try {
        const camera = (await map.getCameraPositionAsync?.()) ?? {
          ...CAMERA_POSITION,
          zoom: lastZoomRef.current,
        };

        const nextZoom = clampZoom((camera.zoom ?? lastZoomRef.current) + delta);
        lastZoomRef.current = nextZoom;

        map.setCameraPosition({
          ...camera,
          zoom: nextZoom,
        });
      } catch (error) {
        console.warn("Failed to update zoom level", error);
      }
    },
    [clampZoom]
  );

  const handleZoomIn = useCallback(() => {
    changeZoom(1);
  }, [changeZoom]);

  const handleZoomOut = useCallback(() => {
    changeZoom(-1);
  }, [changeZoom]);

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
      lastZoomRef.current = 13;
    }

    getCurrentLocation();
  }, []);

  const MapComponent =
    Platform.OS === "ios"
      ? AppleMaps.View
      : Platform.OS === "android"
        ? GoogleMaps.View
        : null;

  if (!MapComponent) {
    return <Text>Maps are only available on Android and iOS</Text>;
  }

  return (
    <View style={styles.container}>
      <MapComponent
        ref={ref}
        style={styles.map}
        uiSettings={{
          myLocationButtonEnabled: false,
          togglePitchEnabled: false,
        }}
        properties={{
          isMyLocationEnabled: true,
        }}
        cameraPosition={CAMERA_POSITION}
      />

      <View pointerEvents="box-none" style={styles.controlsWrapper}>
        <View style={styles.controlsContainer}>
          <Pressable style={styles.controlButton} onPress={handleZoomIn}>
            <Text className="text-lg font-semibold text-gray-900">+</Text>
          </Pressable>
          <Pressable style={[styles.controlButton, styles.controlButtonSpacing]} onPress={handleZoomOut}>
            <Text className="text-lg font-semibold text-gray-900">-</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default MapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  controlsWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    justifyContent: "center",
    paddingRight: 16,
  },
  controlsContainer: {
    alignItems: "center",
  },
  controlButton: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 32,
    elevation: 3,
    height: 44,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    width: 44,
  },
  controlButtonSpacing: {
    marginTop: 12,
  },
});
