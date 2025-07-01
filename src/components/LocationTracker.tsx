
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';

interface LocationTrackerProps {
  onLocationUpdate?: (location: any) => void;
  showCard?: boolean;
}

const LocationTracker: React.FC<LocationTrackerProps> = ({ 
  onLocationUpdate, 
  showCard = true 
}) => {
  const { location, loading, error, getCurrentLocation } = useLocation();

  const handleGetLocation = async () => {
    await getCurrentLocation();
    if (location && onLocationUpdate) {
      onLocationUpdate(location);
    }
  };

  const content = (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-orange-600" />
        <span className="font-medium">Delivery Location</span>
      </div>
      
      {location ? (
        <div className="space-y-2">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-800">Location Detected:</p>
            <p className="text-sm text-green-700 mt-1">{location.address}</p>
            <p className="text-xs text-green-600 mt-1">
              Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </p>
            {location.accuracy && (
              <p className="text-xs text-green-600">
                Accuracy: ~{Math.round(location.accuracy)}m
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <Navigation className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-3">
            Accurate delivery के लिए location enable करें
          </p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <Button 
        onClick={handleGetLocation}
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Location प्राप्त कर रहे हैं...
          </>
        ) : (
          <>
            <Navigation className="h-4 w-4 mr-2" />
            {location ? 'Location Update करें' : 'Location प्राप्त करें'}
          </>
        )}
      </Button>
    </div>
  );

  if (!showCard) {
    return <div>{content}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Location Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};

export default LocationTracker;
