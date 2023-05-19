import React, { useState, useEffect } from "react";
import axios from "axios";

export function getGeoPosition(placeId) {
  const fetchLatandLng = async () => {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=AIzaSyDUn5s7mKCW6Hwq2gUlHT00sRDCzp860pU`
    );
    const result = res.data.results[0].geometry.location;
    return result;
  };
  return fetchLatandLng();
}

export function fetchFoodTruckLocations(setFoodTruckLocations) {
  axios(
    "https://data.sfgov.org/resource/rqzj-sfat.json?$select=applicant,status,address,fooditems,latitude,longitude&status=APPROVED&FacilityType=Truck",
    {
      method: "GET",
      headers: {
        "X-App-Token": process.env.NEXT_PUBLIC_SF_DATA_TOKEN,
      },
    }
  ).then((response) => {
    setFoodTruckLocations(response.data);
  });
}
