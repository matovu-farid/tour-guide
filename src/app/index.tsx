import { Link } from "expo-router";
import React, { useMemo } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Polygon, Polyline } from "react-native-maps";
import { Marker } from "react-native-maps";
import { markers, sortMarkerAsHamiltonianPath } from "@/utils/markers";
import { computeConvexHull, findFurthestPoints } from "@/utils/convexHull";

export default function Page() {
  const { hull, sortedmarkers } = useMemo(() => {
    const hull = computeConvexHull(
      markers.map((marker) => ({
        x: marker.longitude,
        y: marker.latitude,
        id: marker.id,
      }))
    );
    const sortedmarkers = sortMarkerAsHamiltonianPath(markers);
    return { hull, sortedmarkers };
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        // 0.3152° N, 32.5816° E
        initialRegion={{
          latitude: 0.3152,
          longitude: 32.5816,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}
          />
        ))}

        <Polyline
          coordinates={sortedmarkers.map((marker) => ({
            latitude: marker.latitude,
            longitude: marker.longitude,
          }))}
          strokeColor="#ff0000"
          strokeWidth={8}
        />
        <Polygon
          coordinates={hull.map((point) => ({
            latitude: point.x,
            longitude: point.y,
          }))}
          fillColor="rgba(0,255,0,0.1)"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
