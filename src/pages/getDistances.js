const getDistances = (origin, destination) => {
  const fetchDistances = async () => {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/distance/json?origin=${origin}&destination=${destination}&travelMode="DRIVING"&key=AIzaSyDUn5s7mKCW6Hwq2gUlHT00sRDCzp860pU`
    );
    const result = res.data.results[0].geometry.location;
    return result;
  };
  return fetchDistances();
};

export default getDistances;
