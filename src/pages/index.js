import { NextPage } from "next";
import Map from "./Map.js";
import styles from "../styles/Home.module.css";

const Home = () => {
  return (
    <>
      <div className={styles.homeWrapper}>
        <Map />
      </div>
    </>
  );
};

export default Home;
