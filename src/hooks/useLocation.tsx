
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number;
}

interface UseLocationReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
  getAddressFromCoordinates: (lat: number, lng: number) => Promise<string>;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Address fetch failed');
      }
      
      const data = await response.json();
      return data.display_name || `${lat}, ${lng}`;
    } catch (error) {
      console.error('Error getting address:', error);
      return `${lat}, ${lng}`;
    }
  };

  const getCurrentLocation = async (): Promise<void> => {
    if (!navigator.geolocation) {
      const errorMsg = 'Geolocation आपके browser में supported नहीं है';
      setError(errorMsg);
      toast({
        title: "Location Error",
        description: errorMsg,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords;
          
          console.log('Location obtained:', { latitude, longitude, accuracy });
          
          // Get human-readable address
          const address = await getAddressFromCoordinates(latitude, longitude);
          
          const locationData: LocationData = {
            latitude,
            longitude,
            address,
            accuracy
          };
          
          setLocation(locationData);
          setLoading(false);
          
          // Store in localStorage for persistence
          localStorage.setItem('userLocation', JSON.stringify(locationData));
          
          toast({
            title: "Location प्राप्त हुई!",
            description: "आपकी location successfully detect हो गई",
          });
          
          console.log('Location data saved:', locationData);
        } catch (error) {
          console.error('Error processing location:', error);
          setError('Location process करने में error हुई');
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Location प्राप्त करने में समस्या';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied। कृपया browser में location allow करें।';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information उपलब्ध नहीं है।';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timeout हो गया।';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
        
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive"
        });
      },
      options
    );
  };

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setLocation(parsedLocation);
        console.log('Loaded saved location:', parsedLocation);
      } catch (error) {
        console.error('Error parsing saved location:', error);
        localStorage.removeItem('userLocation');
      }
    }
  }, []);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    getAddressFromCoordinates
  };
};
