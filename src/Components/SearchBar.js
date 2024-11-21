import React, { useState, useEffect } from "react";
import humidity from "../images/humidity.png";
import wind from "../images/wind.png";
import rain from "../images/rain.png";
import clear from "../images/clear.png";
import mist from "../images/cloud.png";
import load from "../images/loader.gif";
import snow from "../images/snow.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SearchBar() {
  const [data, setData] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initial content state for default display
  const [defaultWeatherData, setDefaultWeatherData] = useState(null);

  useEffect(() => {
    // Set the background with linear gradient and image
    // document.body.style.background = 
    //   `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6),rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${mountain} )`;
    document.body.style.backgroundSize = "cover"; // Make the background cover the screen
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundPosition= "fixed"
    document.body.style.backgroundPositionY= "center"

    // Cleanup to reset the background on unmount
    return () => {
      document.body.style.background = ""; // Reset the background
    };
  }, []);

  useEffect(() => {
    // Fetch default weather data for an initial city (e.g., "New York")
    const fetchDefaultWeather = async () => {
      setLoading(true);
      try {
        const API = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=karachi&appid=a427dc6917a78752463120b6d2dd6b65&units=metric`
        );
        const response = await API.json();
        if (response.cod !== 200) {
          throw new Error(response.message);
        }
        setDefaultWeatherData(response);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load default weather data!");
        setLoading(false);
      }
    };
    fetchDefaultWeather();
  }, []); // Runs once when the component is mounted

  const insertData = (event) => {
    setData(event.target.value);
  };

  const handleSearch = async () => {
    await fetching();
  };

  const fetching = async () => {
    setLoading(true);
    try {
      const API = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${data}&appid=a427dc6917a78752463120b6d2dd6b65&units=metric`
      );
      const response = await API.json();
      if (response.cod !== 200) {
        throw new Error(response.message);
      }
      setWeatherData(response);
      setLoading(false);
    } catch (error) {
      toast.error("City not found!");
      setWeatherData(null);
      setLoading(false);
    }
  };

  const renderWeatherDetails = (weatherData) => {
    return (
      <>
        <div className="col-12 d-flex justify-content-center align-item-center flex-column">
          <h3 className="text-center text-light">{weatherData.name}</h3>
          <img
            src={
              weatherData.weather[0].description === "mist"
                ? mist
                : weatherData.weather[0].description === "clear"
                ? clear
                : weatherData.weather[0].description === "rain"
                ? rain
                : clear
            }
            className="img-icon"
            alt={weatherData.weather[0].description}
          />
          <h3 className="text-center temp">
            {weatherData.main.temp.toFixed(0)}°C
          </h3>
        </div>
        <div className="col d-flex justify-content-between">
          <div className="imag d-flex justify-content-center align-item-center flex-column">
            <img className="imgs m-auto imag" src={humidity} alt="Humidity" />
            <p className="text-center imgs-text" style={{ color: "#fff" }}>
              Humidity
            </p>
            <span className="namm text-center">{weatherData.main.humidity} %</span>
          </div>
          <div className="imag d-flex justify-content-center align-item-center flex-column">
            <img className="imgs m-auto imag" src={wind} alt="Wind" />
            <p className="text-center imgs-text" style={{ color: "#fff" }}>
              Wind
            </p>
            <span className="namm text-center">{weatherData.wind.speed} KM/H</span>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col d-flex justify-content-center align-items-center">
          <input
            type="text"
            onChange={insertData}
            value={data}
            placeholder="Search Here"
            className="input-field"
            autoFocus
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center mt-5">
          <img src={load} alt="Loading..." style={{ width: "80px" }} />
        </div>
      ) : weatherData ? (
        <div className="container d-flex justify-content-center align-item-center mt-5">
          <div className="row">{renderWeatherDetails(weatherData)}</div>
        </div>
      ) : defaultWeatherData ? (
        <div className="container d-flex justify-content-center align-item-center mt-5">
          <div className="row">{renderWeatherDetails(defaultWeatherData)}</div>
        </div>
      ) : null}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}
