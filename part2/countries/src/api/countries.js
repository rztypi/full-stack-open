import axios from "axios";

const allUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";
const searchUrl = "https://studies.cs.helsinki.fi/restcountries/api/name";

const getAll = async () => {
  const response = await axios.get(allUrl);
  return response.data;
};

export default { getAll };
