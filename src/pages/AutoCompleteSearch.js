import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import styles from "../styles/Home.module.css";
import { useState } from "react";

const PlacesAutocomplete = ({
  onAddressSelect,
  setCurrentSearchedPlacedId,
  setDescription,
  currentLocation,
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: "us" } },
    debounce: 300,
    cache: 86400,
  });

  const [explainRadiusCircle, setExplainRadiusCircle] = useState(false);

  if (currentLocation && !explainRadiusCircle) {
    setExplainRadiusCircle(true);
  }
  const renderSuggestions = () => {
    return data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
        description,
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={() => {
            setValue(description, false);
            clearSuggestions();
            onAddressSelect && onAddressSelect(description);
            setCurrentSearchedPlacedId(place_id);
            setDescription(description);
            setExplainRadiusCircle(true);
          }}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });
  };

  return (
    <div className={styles.autocompleteWrapper}>
      <input
        value={value}
        className={styles.autocompleteInput}
        disabled={!ready}
        onChange={(e) => setValue(e.target.value)}
        placeholder="1600 Pennsylvania Avenue"
      />

      {status === "OK" && (
        <>
          <ul className={styles.suggestionWrapper}>{renderSuggestions()}</ul>
        </>
      )}
      <h3 style={{ color: "white", marginTop: "40px", marginLeft: "10px" }}>
        Double click to drop a pin
      </h3>
      {explainRadiusCircle && (
        <h2 style={{ color: "white", marginTop: "40px", marginLeft: "20px" }}>
          If the food truck is within the circle, it is within 1.5 miles of your
          searched location
        </h2>
      )}
    </div>
  );
};

export default PlacesAutocomplete;
