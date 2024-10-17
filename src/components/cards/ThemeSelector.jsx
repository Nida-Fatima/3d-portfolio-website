import React, { forwardRef, useEffect, useState } from "react";
import styled from "styled-components";
import {
  summerElegantTheme,
  winterElegantTheme,
  rainyDayTheme,
  springRefreshTheme,
  stormyWeatherTheme,
  darkTheme,
} from "../../utils/Themes"; // Import themes

// Define pulsing animation using keyframes
const pulseAnimation = `
  @keyframes pulse {
    0% {
      transform: rotate(90deg) scale(1);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
    50% {
      transform: rotate(90deg) scale(1.05);
      box-shadow: 0 0 20px rgba(255, 255, 255, 1);
    }
    100% {
      transform: rotate(90deg) scale(1);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
  }
`;

const SlideInContainer = styled.div`
  position: fixed;
  right: ${({ isOpen }) => (isOpen ? "0" : "-250px")};
  top: 50%;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.bg};
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 250px;
  height: auto;
  transition: right 0.3s ease-in-out; /* Smooth sliding transition */
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 10px;
  left: -70px;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.white};
  border: none;
  border-radius: 5px;
  padding: 10px;
  padding-top: 18px;
  padding-bottom: 8px;

  cursor: pointer;
  transition: background 0.3s ease-in-out;
  transform: rotate(90deg);

  &:hover {
    background: ${({ theme }) => theme.primaryDark};
  }

  /* Pulsy effect */
  &.pulse {
    ${pulseAnimation}; /* Attach animation to the button */
    animation: pulse 1.5s infinite; /* Apply the pulse animation */
  }
`;

const Title = styled.h4`
  margin: 0;
  margin-bottom: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 600;
  text-align: center;
`;
const WeatherInfo = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  text-align: center;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
`;

const Temperature = styled.span`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
  color: ${({ theme }) => theme.text_primary};
`;

const ThemeDropdown = styled.select`
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 5px;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  margin-bottom: 5px;
`;

// const ThemeSelector = ({ selectedTheme, onThemeChange, weather }) => {
const ThemeSelector = forwardRef(
  ({ onThemeChange, selectedTheme, weather }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleThemeChange = (event) => {
      const themeValue = event.target.value;
      onThemeChange(themeValue);
    };

    return (
      <>
        <SlideInContainer isOpen={isOpen}>
          <ToggleButton ref={ref} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "Close" : "Select Theme 🖌️ "}
          </ToggleButton>
          <Title>Select Theme</Title>
          <ThemeDropdown value={selectedTheme} onChange={handleThemeChange}>
            <option value="auto">Auto (Weather-based)</option>
            <option value="sunny">Sunny</option>
            <option value="snowy">Snowy</option>
            <option value="rainy">Rainy</option>
            <option value="windy">Windy</option>
            <option value="stormy">Stormy</option>
            <option value="default">Default</option>
          </ThemeDropdown>
          {WeatherInfo && (
            <div>
              <Temperature>Temp: {weather?.temperature}°C</Temperature>
            </div>
          )}
        </SlideInContainer>
      </>
    );
  }
);

export default ThemeSelector;
