import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  Marker,
  InfoWindowF,
  Circle,
} from "@react-google-maps/api";
import { useMemo, useEffect, useState } from "react";
import PlacesAutocomplete from "./AutoCompleteSearch.js";
import {
  getGeoPosition,
  fetchFoodTruckLocations,
} from "../helpers/fetchers.js";
import styles from "../styles/Home.module.css";

const Map = () => {
  const [libraries] = useState(["places"]);
  const mapCenter = useMemo(() => ({ lat: 37.7749, lng: -122.431297 }), []);
  const [map, setMap] = useState(null);
  const [foodTruckLocations, setFoodTruckLocations] = useState([]);
  const [currentSearchedPlacedId, setCurrentSearchedPlacedId] =
    useState(undefined);
  const [currentLocation, setCurrentLocation] = useState(undefined);
  const [description, setDescription] = useState(undefined);
  const [showInfoWindow, setShowInfoWindow] = useState({
    number: null,
    showing: false,
  });

  const onMapClick = (e) => {
    map.panTo(e.latLng);
    setTimeout(() => {
      setCurrentLocation({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    }, 600);
  };

  useEffect(() => {
    if (foodTruckLocations.length == 0) {
      fetchFoodTruckLocations(setFoodTruckLocations);
    }
    async function fetchCurrentLocation() {
      if (currentSearchedPlacedId) {
        const locationData = await getGeoPosition(currentSearchedPlacedId);
        map.panTo(locationData);
        setTimeout(() => {
          setCurrentLocation(locationData);
        }, 600);
      }
    }
    fetchCurrentLocation();
  }, [currentSearchedPlacedId, foodTruckLocations.length]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_TOKEN,
    libraries,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <div className={styles.sidebar}>
        <PlacesAutocomplete
          setCurrentSearchedPlacedId={setCurrentSearchedPlacedId}
          setDescription={setDescription}
          currentLocation={currentLocation}
        />
      </div>

      <GoogleMap
        zoom={currentLocation ? 14 : 13}
        center={currentLocation ? currentLocation : mapCenter}
        mapTypeId={"roadmap"}
        mapContainerStyle={{ width: "100%", height: "100vh" }}
        onDblClick={onMapClick}
        options={{ disableDoubleClickZoom: true }}
        onLoad={(map) => {
          setMap(map);
        }}
      >
        <Circle
          center={currentLocation}
          title={description}
          radius={2414.02}
          options={{ clickable: false }}
        ></Circle>
        <MarkerF
          position={currentLocation}
          title={description}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          }}
        ></MarkerF>
        {foodTruckLocations.map((location, i) => (
          <Marker
            position={{
              lat: Number(location.latitude),
              lng: Number(location.longitude),
            }}
            key={i}
            title={location.applicant}
            snippet={location.fooditems}
            onClick={() => {
              setShowInfoWindow((windowInfo) => {
                return {
                  number:
                    i === windowInfo.number && windowInfo.showing ? null : i,
                  showing: i === windowInfo.number ? !windowInfo.showing : true,
                };
              });
            }}
          >
            {showInfoWindow.number === i && showInfoWindow.showing && (
              <InfoWindowF
                onCloseClick={() => {
                  setShowInfoWindow(() => {
                    return { number: null, showing: false };
                  });
                }}
              >
                <div>
                  <h4>{location.applicant}</h4> {location.fooditems}
                </div>
              </InfoWindowF>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </>
  );
};

export default Map;
