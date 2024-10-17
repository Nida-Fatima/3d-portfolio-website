import React from "react";
import styled from "styled-components";
import { weatherDescriptions } from "../utils/Themes";

const NotificationBar = styled.div`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  text-align: center;
  padding: 10px;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 999;
`;

const CloseButton = styled.button`
  background: none;
  color: white;
  border: none;
  font-size: 20px;
  position: absolute;
  right: 20px;
  top: 5px;
  cursor: pointer;
`;

const ShowThemeButton = styled.button`
  padding: 3px 6px;
`;

function ThemeNotification({ onClose, onShowThemes, currentweather }) {
  return (
    <NotificationBar>
      <p>
        This website changes theme based on the weather! Current temperature is{" "}
        {currentweather ? currentweather?.temperature : "NAN"}°C and{" "}
        {currentweather
          ? weatherDescriptions[currentweather?.weatherCode]
          : "NAN"}
        . <br /> Explore all themes using the dropdown.
      </p>
      <CloseButton onClick={onClose}>×</CloseButton>
      <ShowThemeButton onClick={onShowThemes}>
        Show Me the Themes
      </ShowThemeButton>
    </NotificationBar>
  );
}

export default ThemeNotification;
