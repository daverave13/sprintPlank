import { experimentalStyled as styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";

const StyledBox = styled(Box)(({ theme }) => ({
  height: "fill-container",
  border: "solid 2px white",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
}));

const CurrentDataPoints = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  flexWrap: "wrap",
}));

const CurrentDataPoint = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  "> *": {
    verticalAlign: "middle",
  },
}));

const Current = (props) => {
  const [hourlyData, setHourlyData] = useState([]);
  const [betterData, setBetterData] = useState([]);

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://api.weather.gov/gridpoints/LOX/173,43/forecast/hourly",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setHourlyData(result.properties.periods.slice(0, 12));
      })
      .catch((error) => console.log("error", error));

    fetch(
      "https://api.openweathermap.org/data/3.0/onecall?lat=34.0292518&units=imperial&lon=-117.7320721&&appid=e767e55421cd64a2451da4b2676822ca",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setBetterData(result);
      })
      .catch((error) => console.log("error", error));
  }, []);

  if (
    props.data.properties.periods[1].name === "Tonight" &&
    hourlyData.length > 0 &&
    betterData.current
  ) {
    const domainMin = [...hourlyData].sort(
      (a, b) => a.temperature - b.temperature
    )[0].temperature;
    const domainMax = [...hourlyData].sort(
      (a, b) => b.temperature - a.temperature
    )[0].temperature;

    return (
      <StyledBox
        sx={{ color: "white", display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            width: "100%",
            height: "200px",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <ResponsiveContainer width='50%'>
            <LineChart
              data={hourlyData}
              margin={{
                top: 30,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray='' stroke='rgba(0,0,0,0)' />
              <XAxis
                dataKey='startTime'
                stroke='#ffffff'
                tickFormatter={(date) => moment(date).format("H")}
                interval={0}
              />
              <YAxis
                stroke='#ffffff'
                domain={[domainMin - 10, domainMax + 10]}
                tickCount={10}
              />
              <Line
                type='natural'
                dot={false}
                dataKey='temperature'
                stroke='#ffffff'
              />
            </LineChart>
          </ResponsiveContainer>
          <Box
            sx={{
              width: "50%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: '75px'
            }}>
            <img alt='weather-icon' src='https://openweathermap.org/img/wn/01d.png' />
              <CurrentDataPoint>{betterData.current.weather[0].main}</CurrentDataPoint>
            </Box>
            {betterData.current ? (
              <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <CurrentDataPoints>
                  <CurrentDataPoint>
                    {betterData.current.temp.toString().split(".")[0]}° | {betterData.current.humidity}%
                  </CurrentDataPoint>
                  <CurrentDataPoint>
                    {moment(betterData.current.sunrise * 1000).format("H:mm")} |{" "}
                    {moment(betterData.current.sunset * 1000).format("H:mm")}
                  </CurrentDataPoint>
                </CurrentDataPoints>
              </Box>
            ) : (
              "Loading..."
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          {props.data.properties.periods.slice(0, 2).map((period, index) => {
            return (
              <Box key={index} sx={{ color: "white", padding: "0 2rem" }}>
                <Typography sx={{ fontSize: "3rem" }}>
                  {period.name} | {period.temperature}
                </Typography>
                <Typography>
                  {period.windSpeed} {period.windDirection}
                </Typography>
                <Typography>{period.detailedForecast}</Typography>
              </Box>
            );
          })}
        </Box>
      </StyledBox>
    );
  }
  return <h1>yo</h1>;
};

export default Current;
