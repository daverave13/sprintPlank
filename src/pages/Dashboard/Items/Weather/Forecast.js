import { experimentalStyled as styled } from "@mui/material/styles";
import { useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import Marquee from "react-fast-marquee";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-around",
  flexWrap: "wrap",

}));

const Day = styled(Card)(({ theme }) => ({
  "& *": {
    padding: "5px",
  },
  width: "200px",
  borderRadius: "10px",
}));

const Forecast = (props) => {
  const [data, setData] = useState(props.data);
  
  if (data.properties) {
    const reducedResults = data.properties.periods.reduce(
      (groupedByDay, currentPeriod) => {
        if (
          groupedByDay.every((day) => {
            return day.date !== currentPeriod.startTime.split("T")[0];
          })
        ) {
          groupedByDay.push({
            date: currentPeriod.startTime.split("T")[0],
            icon: currentPeriod.icon,
            name: currentPeriod.name.split(" ")[0],
            high: currentPeriod.isDaytime ? currentPeriod.temperature : "",
            low: currentPeriod.isDaytime ? "" : currentPeriod.temperature,
            highDescription: currentPeriod.isDaytime
              ? currentPeriod.shortForecast
              : "",
            lowDescription: currentPeriod.isDaytime
              ? ""
              : currentPeriod.shortForecast,
          });
        } else {
          const currentDay = groupedByDay.find(
            (day) => day.date === currentPeriod.startTime.split("T")[0]
          );
          groupedByDay = [
            ...groupedByDay.filter(
              (day) => day.date !== currentPeriod.startTime.split("T")[0]
            ),
            {
              ...currentDay,
              high: currentPeriod.isDaytime
                ? currentPeriod.temperature
                : currentDay.high,
              low: currentPeriod.isDaytime
                ? currentDay.low
                : currentPeriod.temperature,
              highDescription: currentPeriod.isDaytime
                ? currentPeriod.shortForecast
                : currentDay.highDescription,
              lowDescription: currentPeriod.isDaytime
                ? currentDay.lowDescription
                : currentPeriod.shortForecast,
            },
          ];
        }
        return groupedByDay;
      },
      [
        {
          date: data.properties.periods[0].startTime.split("T")[0],
          name: data.properties.periods[0].isDaytime
            ? "Today"
            : "Tonight",
        },
      ]
    );
    setData(reducedResults);
  }

  return (
    <Container>
      {data.length > 0 ? (
        data.slice(1, 6).map((period, index) => {
          return (
            <Day sx={{ marginTop: "1rem" }} key={index}>
              <Box
                sx={{
                  color: "white",
                  backgroundColor: `#f03c81`,
                }}
              >
                <Typography sx={{ fontSize: "3.5rem" }}>
                  {period.high}
                </Typography>
                <Typography>
                  {period.highDescription.length > 100 ? (
                    <Marquee gradient={false}>{period.highDescription}</Marquee>
                  ) : (
                    period.highDescription
                  )}
                </Typography>
              </Box>
              <Box sx={{ color: "white", backgroundColor: "#2e2e2e" }}>
                <Typography sx={{ fontSize: "1.75rem"}}>{period.name}</Typography>
              </Box>
              <Box
                sx={{
                  color: "white",
                  backgroundColor: `#94d0d1`,
                }}
              >
                <Typography sx={{ fontSize: "3.5rem" }}>
                  {period.low}
                </Typography>
                <Typography>
                  {period.lowDescription.length > 100 ? (
                    <Marquee gradient={false}>{period.lowDescription}</Marquee>
                  ) : (
                    period.lowDescription
                  )}
                </Typography>
              </Box>
            </Day>
          );
        })
      ) : (
        <h2>no data!</h2>
      )}
    </Container>
  );
};

export default Forecast;
