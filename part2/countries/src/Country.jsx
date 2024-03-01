import { useEffect } from "react";
import weatherApi from "./api/weather";
import { useState } from "react";

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (weather === null) {
      weatherApi
        .get(country)
        .then((returnedWeather) => {
          setWeather(returnedWeather);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [country, weather]);

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital ? country.capital.join(", ") : "none"}</div>
      <div>area {country.area}</div>

      <h3>languages:</h3>
      {country.languages ? (
        <ul>
          {Object.values(country.languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
      ) : (
        <div>none</div>
      )}

      <img src={country.flags.png} alt={country.flags.alt} />

      <h3>{country.capital ? `weather in ${country.capital}:` : "weather:"}</h3>
      {weather === null ? (
        <div>Loading weather...</div>
      ) : (
        <div>
          <div>temperature {weather.main.temp} Celsius</div>
          <div>weather {weather.weather[0].main}</div>
          <img
            src={weatherApi.getIconUrl(weather.weather[0].icon)}
            alt={weather.weather[0].description}
          />
          <div>wind {weather.wind.speed} m/s</div>
        </div>
      )}
    </div>
  );
};

export default Country;
