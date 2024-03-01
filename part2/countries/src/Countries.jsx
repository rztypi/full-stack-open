import { useState, useEffect } from "react";
import Country from "./Country";
import CountryItem from "./CountryItem";
import countriesApi from "./api/countries";

const Countries = ({ filterState }) => {
  const [countries, setCountries] = useState(null);
  const [filter, setFilter] = filterState;

  useEffect(() => {
    if (countries === null) {
      countriesApi.getAll().then((allCountries) => {
        setCountries(allCountries);
      });
    }
  }, [countries]);

  if (countries === null) {
    return <div>Loading countries...</div>;
  }

  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {countriesToShow.length > 10 ? (
        <>Too many matches, specify another filter</>
      ) : (
        <>
          {countriesToShow.length === 1 ? (
            <Country country={countriesToShow[0]} />
          ) : (
            <ul>
              {countriesToShow.map((country) => (
                <CountryItem
                  key={country.name.common}
                  country={country}
                  setFilter={setFilter}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default Countries;
