import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import { NextPage } from "next";
import axios from "axios";
import { useMemo, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const Home = () => {
  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(() => ({ lat: 37.7749, lng: -122.431297 }), []);
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios(
      "https://data.sfgov.org/resource/rqzj-sfat.json?$select=applicant,status,address,fooditems,latitude,longitude&status=APPROVED",
      {
        method: "GET",
        headers: {
          "X-App-Token": "fg85kSClVPGeOIDARCVa1XNIx",
        },
      }
    ).then((response) => {
      setLocations(response.data);
    });
  };

  const mapOptions =
    useMemo <
    (() => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDUn5s7mKCW6Hwq2gUlHT00sRDCzp860pU",
    libraries: libraries,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  console.log("hi", locations);
  return (
    <div className={styles.homeWrapper}>
      <div className={styles.sidebar}>
        <p>This is Sidebar...</p>
      </div>
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={mapCenter}
        mapTypeId={"roadmap"}
        mapContainerStyle={{ width: "800px", height: "800px" }}
        onLoad={() => console.log("Map Component Loaded...")}
      >
        {locations.map((location) => (
          <MarkerF
            position={{
              lat: Number(location.latitude),
              lng: Number(location.longitude),
            }}
            title={location.applicant}
            onLoad={() => console.log("Marker Loaded")}
          />
        ))}
        <MarkerF
          position={mapCenter}
          onLoad={() => console.log("Marker Loaded")}
        />
      </GoogleMap>
    </div>
  );
};

export default Home;
