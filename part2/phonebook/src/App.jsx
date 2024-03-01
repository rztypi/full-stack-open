import { useState } from "react";
import { useEffect } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import Notification from "./Notification";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filterState={[filter, setFilter]} />
      <h3>Add a new</h3>
      <PersonForm
        personsState={[persons, setPersons]}
        setNotification={setNotification}
      />
      <h3>Numbers</h3>
      <Persons
        personsState={[persons, setPersons]}
        filter={filter}
        setNotification={setNotification}
      />
    </div>
  );
};

export default App;
