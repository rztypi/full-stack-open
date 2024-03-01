import Filter from "./Filter";
import Countries from "./Countries";
import { useState } from "react";

const App = () => {
  const [filter, setFilter] = useState("");

  return (
    <>
      <Filter filterState={[filter, setFilter]} />
      <Countries filterState={[filter, setFilter]} />
    </>
  );
};

export default App;
