import React, { useState, useEffect } from "react";
import axios from "axios";

const useGeoPosition = (placeId) => {
  const fetchLatandLng = async () => {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=AIzaSyDUn5s7mKCW6Hwq2gUlHT00sRDCzp860pU`
    );
    const result = res.data.results[0].geometry.location;
    return result;
  };
  return fetchLatandLng();
};

export default useGeoPosition;
