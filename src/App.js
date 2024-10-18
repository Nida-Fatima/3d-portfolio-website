import React, { useState, useEffect, useRef, useCallback } from "react";
import styled, { ThemeProvider } from "styled-components";
import axios from "axios";
import {
  darkTheme,
  summerElegantTheme,
  winterElegantTheme,
  rainyDayTheme,
  springRefreshTheme,
  stormyWeatherTheme,
} from "./utils/Themes";
import Navbar from "./components/Navbar";
import ThemeSelector from "./components/cards/ThemeSelector"; // Import the new component
import { BrowserRouter } from "react-router-dom";
import Hero from "./components/sections/Hero";
import Skills from "./components/sections/Skills";
import Experience from "./components/sections/Experience";
import Education from "./components/sections/Education";
import StartCanvas from "./components/canvas/Stars";
import SnowFlakes from "./components/canvas/SnowFlakes";
import Sunny from "./components/canvas/Sunny";
import Leaves from "./components/canvas/Leaves";
import Rain from "./components/canvas/Rain";
import Projects from "./components/sections/Projects";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import ThemeNotification from "./components/NotificationBar";

const Body = styled.div`
  background-color: ${({ theme }) => theme.bg};
  width: 100%;
  overflow-x: hidden;
  position: relative;
`;

const Wrapper = styled.div`
  padding-bottom: 100px;
  background: linear-gradient(
      38.73deg,
      ${({ theme }) => `rgba(${theme.primaryRGB}, 0.15)`} 0%,
      ${({ theme }) => `rgba(${theme.primaryRGB}, 0)`} 50%
    ),
    linear-gradient(
      141.27deg,
      ${({ theme }) => `rgba(${theme.primaryRGB}, 0)`} 50%,
      ${({ theme }) => `rgba(${theme.primaryRGB}, 0.15)`} 100%
    );
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
`;

function App() {
  const [theme, setTheme] = useState(darkTheme);
  const [canvas, setCanvas] = useState(<StartCanvas />);
  const [weather, setWeather] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState("auto");
  const themeSelectorRef = useRef(null); // Create a ref for the ThemeSelector button

  const fetchWeather = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        {
          params: {
            latitude: latitude, // Use dynamic latitude
            longitude: longitude, // Use dynamic longitude
            current_weather: true,
            timezone: "auto", // Automatically set timezone based on location
          },
        }
      );
      const { temperature, weathercode } = response.data.current_weather;
      setWeather({ temperature, weatherCode: weathercode });
      // handleThemeChange(weather); // Set initial theme based on weather
    } catch (error) {
      console.error("Error fetching weather data", error);
    }
  };

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location", error);
          // Fallback to a default location or handle the error appropriately
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Fallback to a default location or handle the error appropriately
    }
  });

  const [showNotification, setShowNotification] = useState(true);

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  const handleShowThemes = () => {
    if (themeSelectorRef.current) {
      themeSelectorRef.current.click();
      setShowNotification(false);
    }
  };
  const handleThemeChange = useCallback(
    (themeValue) => {
      setSelectedTheme(themeValue);

      switch (themeValue) {
        case "auto":
          switch (weather?.weatherCode) {
            case 0:
            case 1:
              // getLocation();
              setTheme(summerElegantTheme);
              setCanvas(<Sunny />);
              break;
            case 2:
            case 45:
              setTheme(springRefreshTheme);
              setCanvas(<Leaves />);
              break;
            case 3:
            case 51:
            case 61:
              setTheme(rainyDayTheme);
              setCanvas(<Rain />);
              break;
            case 71:
            case 81:
              setTheme(winterElegantTheme);
              setCanvas(<SnowFlakes />);
              break;
            case 95:
              setTheme(stormyWeatherTheme);
              setCanvas(<Rain />);
              break;
            default:
              setTheme(darkTheme);
              setCanvas(<StartCanvas />);
          }
          break;
        case "sunny":
          setTheme(summerElegantTheme);
          setCanvas(<Sunny />);
          break;
        case "snowy":
          setTheme(winterElegantTheme);
          setCanvas(<SnowFlakes />);
          break;
        case "rainy":
          setTheme(rainyDayTheme);
          setCanvas(<Rain />);
          break;
        case "windy":
          setTheme(springRefreshTheme);
          setCanvas(<Leaves />);
          break;
        case "stormy":
          setTheme(stormyWeatherTheme);
          setCanvas(<Rain />);
          break;
        case "default":
          setTheme(darkTheme);
          setCanvas(<StartCanvas />);
          break;
        default:
          setTheme(darkTheme);
          setCanvas(<StartCanvas />);
      }
    },
    [weather, selectedTheme]
  );

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    if (selectedTheme === "auto" && weather) {
      handleThemeChange("auto");
    }
  }, [weather, selectedTheme, handleThemeChange]);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar weather={weather} />
        <Body>
          {/* <StartCanvas /> */}
          {/* {canvas} */}
          {showNotification && (
            <ThemeNotification
              currentweather={weather}
              onClose={handleNotificationClose}
              onShowThemes={handleShowThemes}
            />
          )}
          <div>
            <Hero canvas={canvas} />
            <Wrapper>
              <Skills />
              <Experience />
            </Wrapper>
            <Projects />
            <Wrapper>
              <Education />
              <Contact />
            </Wrapper>
            <Footer />
          </div>
        </Body>
        <ThemeSelector
          selectedTheme={selectedTheme}
          onThemeChange={handleThemeChange}
          weather={weather}
          ref={themeSelectorRef}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
