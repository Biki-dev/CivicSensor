import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import type { GeoPoint } from '@appTypes/index';

const requestPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

export const useGeoLocation = () => {
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      const granted = await requestPermission();
      if (!granted) {
        setError('Location permission denied');
        return;
      }

      setLoading(true);
      const geo = (globalThis as any).navigator?.geolocation;
      if (!geo) {
        setError('Geolocation is unavailable');
        setLoading(false);
        return;
      }

      geo.getCurrentPosition(
        (position: any) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null);
          setLoading(false);
        },
        () => {
          setError('Unable to determine current location');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    };

    fetchLocation();
  }, []);

  return { location, loading, error };
};
