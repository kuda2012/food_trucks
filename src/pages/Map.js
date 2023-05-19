import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  Circle,
  CircleF,
  DistanceMatrixService,
} from "@react-google-maps/api";
import axios from "axios";
import { useMemo, useEffect, useState } from "react";
import PlacesAutocomplete from "./AutoCompleteSearch.js";
import { getGeoPosition } from "../helpers/getGeoPosition.js";
import styles from "../styles/Home.module.css";

const Map = () => {
  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(() => ({ lat: 37.7749, lng: -122.431297 }), []);
  const [foodTruckLocations, setFoodTruckLocations] = useState([]);
  const [currentSearchedPlacedId, setCurrentSearchedPlacedId] =
    useState(undefined);
  const [currentLocation, setCurrentLocation] = useState(undefined);
  useEffect(() => {
    if (foodTruckLocations.length == 0) {
      fetchFoodTruckLocations();
    }
    fetchCurrentLocation();
  });

  const fetchFoodTruckLocations = () => {
    axios(
      "https://data.sfgov.org/resource/rqzj-sfat.json?$select=applicant,status,address,fooditems,latitude,longitude&status=APPROVED",
      {
        method: "GET",
        headers: {
          "X-App-Token": "fg85kSClVPGeOIDARCVa1XNIx",
        },
      }
    ).then((response) => {
      setFoodTruckLocations(response.data);
    });
  };

  const fetchCurrentLocation = async () => {
    if (currentSearchedPlacedId) {
      setCurrentLocation(await getGeoPosition(currentSearchedPlacedId));
    }
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDUn5s7mKCW6Hwq2gUlHT00sRDCzp860pU",
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
        />
      </div>

      <GoogleMap
        zoom={currentLocation ? 15 : 13}
        center={currentLocation ? currentLocation : mapCenter}
        mapTypeId={"roadmap"}
        mapContainerStyle={{ width: "100%", height: "100vh" }}
      >
        {foodTruckLocations.map((location, i) => (
          <MarkerF
            position={{
              lat: Number(location.latitude),
              lng: Number(location.longitude),
            }}
            key={i}
            title={location.applicant}
            snippet={location.fooditems}
            onLoad={() => console.log("Marker Loaded")}
          />
        ))}
        {/* {currentLocation && (
          <>
            <Circle
              center={currentLocation}
              radius={2500}
              onLoad={() => setCurrentLocation(currentLocation)}
            />
          </>
        )} */}
      </GoogleMap>
    </>
  );
};

export default Map;
