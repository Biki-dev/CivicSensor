import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, PermissionsAndroid } from 'react-native';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { typography } from '@theme/typography';
import { Issue } from '@appTypes/index';
import { useAppStore } from '@store/index';

// This component attempts to use `react-native-maps` with OpenStreetMap tiles via UrlTile.
// If `react-native-maps` isn't installed, it shows a helpful message with install commands.

let MapView: any;
let Marker: any;
let UrlTile: any;
try {
  // prefer default export
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const rnMaps = require('react-native-maps');
  MapView = rnMaps.default ?? rnMaps;
  Marker = rnMaps.Marker ?? rnMaps.Marker;
  UrlTile = rnMaps.UrlTile ?? rnMaps.UrlTile;
} catch (e) {
  MapView = null;
}

export default function OSMMapView({ initialRegion }: { initialRegion?: any }) {
  const { issues } = useAppStore();
  const [userLoc, setUserLoc] = useState<any>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    let mounted = true;
    const getLocation = async () => {
      setLoadingLocation(true);
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setLoadingLocation(false);
            return;
          }
        }

        const geo = (globalThis as any).navigator?.geolocation;
        if (geo && typeof geo.getCurrentPosition === 'function') {
          geo.getCurrentPosition(
            (pos: any) => {
              if (!mounted) return;
              setUserLoc({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
              setLoadingLocation(false);
            },
            (err: any) => {
              setLoadingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
          );
        } else {
          setLoadingLocation(false);
        }
      } catch (e) {
        setLoadingLocation(false);
      }
    };

    getLocation();
    return () => { mounted = false; };
  }, []);

  if (!MapView) {
    return (
      <View style={styles.fallback}>
        <Text style={{ ...typography.h3, color: colors.textPrimary }}>Optional Map Integration</Text>
        <Text style={{ ...typography.body, color: colors.textMuted, marginTop: spacing.sm }}>
          To enable an interactive OpenStreetMap view, install `react-native-maps` and follow the native linking steps.
        </Text>
        <Text style={{ ...typography.caption, color: colors.textSecondary, marginTop: spacing.md }}>
          Install:
        </Text>
        <Text style={{ ...typography.body, color: colors.textPrimary, marginTop: spacing.xs }}>
          npm install react-native-maps --save{Platform.OS === 'ios' ? '\ncd ios && pod install' : ''}
        </Text>
      </View>
    );
  }

  const region = initialRegion ?? {
    latitude: userLoc?.latitude ?? 37.7749,
    longitude: userLoc?.longitude ?? -122.4194,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region} showsUserLocation={!!userLoc}>
        {/* OSM Tiles */}
        {UrlTile ? (
          <UrlTile
            urlTemplate={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
            maximumZ={19}
            flipY={false}
          />
        ) : null}

        {/* Issue markers */}
        {issues.map((issue: Issue) => (
          <Marker
            key={issue.id}
            coordinate={{ latitude: issue.location.latitude, longitude: issue.location.longitude }}
            title={issue.title}
            description={issue.address}
          />
        ))}

        {/* User location marker fallback */}
        {!userLoc && loadingLocation && (
          <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
            <View style={{ padding: 6, backgroundColor: colors.brandAccent, borderRadius: 20 }} />
          </Marker>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 380, width: '100%' },
  map: { flex: 1 },
  fallback: { padding: spacing.md, backgroundColor: colors.bgCard, borderRadius: 8 },
});
