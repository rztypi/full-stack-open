const CountryItem = ({ country, setFilter = { setFilter } }) => {
  return (
    <li>
      {country.name.common}{" "}
      <button type="button" onClick={() => setFilter(country.name.common)}>
        show
      </button>
    </li>
  );
};

export default CountryItem;
