import { useState } from "react";
import personService from "./services/persons";

const PersonForm = ({ personsState, setNotification }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [persons, setPersons] = personsState;

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };
  const handlePersonSubmit = (e) => {
    e.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);
    if (existingPerson) {
      if (
        !confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        return;
      }
      const personObject = { ...existingPerson, number: newNumber };

      personService
        .update(existingPerson.id, personObject)
        .then((returnedPerson) => {
          setPersons(
            persons.map((p) =>
              p.id !== existingPerson.id ? p : returnedPerson
            )
          );
          setNotification({
            type: "success",
            message: `Replaced "${returnedPerson.name}" number to "${returnedPerson.number}"`,
          });
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        });
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };

      personService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNotification({
          type: "success",
          message: `Added "${returnedPerson.name}"`,
        });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      });
    }

    setNewName("");
    setNewNumber("");
  };

  return (
    <form onSubmit={handlePersonSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
