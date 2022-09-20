import { Grid, Paper } from "@mui/material";
import { experimentalStyled as styled } from "@mui/material/styles";
import Forecast from "./Items/Weather/Forecast";
import Current from "./Items/Weather/Current";
import { useEffect, useState } from "react";


const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#c2c2ff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  display: "flex",
  width: "1100px",
  flexDirection: "column",
}));

const Dashboard = () => {

  const [ weatherData, setWeatherData ] = useState({});

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://api.weather.gov/gridpoints/LOX/173,43/forecast",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setWeatherData(result)
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
      justifyContent='center'
      sx={{ paddingTop: "10vh" }}
    >
      <Grid item xs={10}>
        <StyledPaper elevation={10}>
          {weatherData.properties ? <Current data={weatherData} /> : ''}
          {weatherData.properties ? <Forecast data={weatherData} /> : ''}
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
