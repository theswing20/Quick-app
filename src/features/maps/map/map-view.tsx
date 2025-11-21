import { Text } from "@/shared/ui/text";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Pressable, StyleSheet, View, Image } from "react-native";
import MapView, { Marker as MapMarker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Region } from "react-native-maps";

const INITIAL_REGION: Region = {
  latitude: 25.2048,
  longitude: 55.2708,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

interface Marker {
  id: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  title?: string;
  description?: string;
  systemImage?: string;
  tintColor?: string;
}

export interface MapViewRef {
  centerOnUserLocation: () => Promise<void>;
}

interface MapViewProps {
  ref?: React.Ref<MapViewRef>;
}

const MapViewComponent = React.forwardRef<MapViewRef, MapViewProps>((props, ref) => {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const router = useRouter();

  const clampZoom = useCallback((delta: number) => {
    const currentDelta = region.latitudeDelta;
    // Уменьшаем delta для увеличения (zoom in), увеличиваем для уменьшения (zoom out)
    const newDelta = delta > 0
      ? Math.max(0.001, currentDelta * 0.5)
      : Math.min(180, currentDelta * 2);

    setRegion(prev => ({
      ...prev,
      latitudeDelta: newDelta,
      longitudeDelta: newDelta * (prev.longitudeDelta / prev.latitudeDelta),
    }));
  }, [region.latitudeDelta, region.longitudeDelta]);

  const [markers, setMarkers] = useState<Marker[]>([
    {
      id: "1",
      coordinates: {
        latitude: 25.2048,
        longitude: 55.2708,
      },
      // title: "Dubai",
      // description: "Location marker",
      // systemImage: "bolt.circle",
    },
    {
      id: "2",
      coordinates: {
        latitude: 37.7851,
        longitude: -122.4061,
      },
      // title: "Test",
      // description: "Location marker",
      // systemImage: "bolt.fill",
      // tintColor: "#000000",
    },
    {
      id: "3",
      coordinates: {
        latitude: 25.2007,
        longitude: 55.2732,
      },
      // title: "Dubai",
      // description: "Location marker",
      // systemImage: "bolt.circle",
    },
  ]);

  const handleZoomIn = useCallback(() => {
    clampZoom(1);
  }, [clampZoom]);

  const handleZoomOut = useCallback(() => {
    clampZoom(-1);
  }, [clampZoom]);

  useEffect(() => {
    async function getCurrentLocation() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          // Если разрешение не получено, используем начальную позицию
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        // const userRegion: Region = {
        //   latitude: location.coords.latitude,
        //   longitude: location.coords.longitude,
        //   latitudeDelta: 0.01,
        //   longitudeDelta: 0.01,
        // };
        //dev config 
        const userRegion: Region = {
          latitude: 25.2048,
          longitude: 55.2708,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        // Устанавливаем начальную позицию на местоположение пользователя
        setRegion(userRegion);

        // Обновляем позицию камеры программно, если карта уже загружена
        if (mapRef.current) {
          mapRef.current.animateToRegion(userRegion, 1000);
        }
      } catch (error) {
        console.warn("Failed to get current location:", error);
      }
    }

    getCurrentLocation();
  }, []);

  const handleMapPress = useCallback((event: any) => {
    console.log("Map pressed", event.nativeEvent.coordinate);
  }, []);

  const handleMarkerPress = useCallback((markerId: string) => (event: any) => {
    const markerCoordinate = event.nativeEvent.coordinate;


    // Создаём новую region с координатами маркера и увеличенным зумом
    const markerRegion: Region = {
      latitude: markerCoordinate.latitude,
      longitude: markerCoordinate.longitude,
      latitudeDelta: 0.01, // Уменьшенный delta = увеличенный зум
      longitudeDelta: 0.01,
    };

    // Анимируем карту к маркеру
    if (mapRef.current) {
      mapRef.current.animateToRegion(markerRegion, 1000);
      setRegion(markerRegion);
    }

    // Опционально: можно оставить переход на другую страницу
    router.push({ pathname: "/(app)/marker-details", params: { markerId } });
  }, []);

  const handleRegionChangeComplete = useCallback((newRegion: Region) => {
    setRegion(newRegion);
  }, []);

  const centerOnUserLocation = useCallback(async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission not granted");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userRegion: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      if (mapRef.current) {
        mapRef.current.animateToRegion(userRegion, 1000);
        setRegion(userRegion);
      }
    } catch (error) {
      console.warn("Failed to center on user location:", error);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    centerOnUserLocation,
  }), [centerOnUserLocation]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        // provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onPress={handleMapPress}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {markers.map((marker) => (
          <MapMarker
            key={marker.id}
            coordinate={marker.coordinates}
            title={marker.title}
            description={marker.description}
            onPress={handleMarkerPress(marker.id)}
            pinColor={"#000000"}
            // image={require("@/shared/assets/images/favicon.png")}
          ><Image
          source={require('../../../shared/assets/images/bolt-icon.png')}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        /></MapMarker>
        ))}
      </MapView>

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
});

MapViewComponent.displayName = "MapView";

export default MapViewComponent;

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
