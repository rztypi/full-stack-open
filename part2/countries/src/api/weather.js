import axios from "axios";

// const getGeoUrl = (q) => {
//   return `http://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=1&appid=${
//     import.meta.env.VITE_API_KEY
//   }`;
// };

const getUrl = (lat, lon) => {
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${
    import.meta.env.VITE_API_KEY
  }`;
};

const getIconUrl = (code) => {
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
};

const get = async (country) => {
  // const q = `${country.capital[0]},${country.cca2}`;
  // const geoResponse = await axios.get(getGeoUrl(q));

  // const lat = geoResponse.data[0].lat;
  // const lon = geoResponse.data[0].lon;
  const [lat, lon] =
    "latlng" in country.capitalInfo
      ? country.capitalInfo.latlng
      : country.latlng;
  const response = await axios.get(getUrl(lat, lon));
  return response.data;
};

export default { get, getIconUrl };
