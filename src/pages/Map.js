import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  Marker,
  InfoWindowF,
} from "@react-google-maps/api";
import axios from "axios";
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
  const [foodTruckLocations, setFoodTruckLocations] = useState([]);
  const [currentSearchedPlacedId, setCurrentSearchedPlacedId] =
    useState(undefined);
  const [currentLocation, setCurrentLocation] = useState(undefined);
  const [description, setDescription] = useState(undefined);
  const [showInfoWindow, setShowInfoWindow] = useState({
    number: null,
    showing: false,
  });
  useEffect(() => {
    if (foodTruckLocations.length == 0) {
      fetchFoodTruckLocations(setFoodTruckLocations);
    }
    async function fetchCurrentLocation() {
      if (currentSearchedPlacedId) {
        setCurrentLocation(await getGeoPosition(currentSearchedPlacedId));
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
        />
      </div>

      <GoogleMap
        zoom={currentLocation ? 15 : 13}
        center={currentLocation ? currentLocation : mapCenter}
        mapTypeId={"roadmap"}
        mapContainerStyle={{ width: "100%", height: "100vh" }}
      >
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
                  number: windowInfo.showing ? null : i,
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
        <>
          <MarkerF
            position={currentLocation}
            title={description}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          ></MarkerF>
        </>
      </GoogleMap>
    </>
  );
};

export default Map;
