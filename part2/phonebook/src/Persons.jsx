import personService from "./services/persons";

const Persons = ({ personsState, filter, setNotification }) => {
  const [persons, setPersons] = personsState;

  const removePerson = (person) => {
    if (!confirm(`Remove ${person.name}?`)) {
      return;
    }

    personService
      .remove(person.id)
      .then((returnedPerson) => {
        setPersons(persons.filter((p) => p.id !== returnedPerson.id));
        setNotification({
          type: "success",
          message: `Removed "${returnedPerson.name}"`,
        });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      })
      .catch(() => {
        setPersons(persons.filter((p) => p.id !== person.id));
        setNotification({
          type: "error",
          message: `"${person.name}" has already been removed from the server.`,
        });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      });
  };

  return (
    <ul>
      {persons.map((person) => {
        if (person.name.toLowerCase().startsWith(filter.toLowerCase())) {
          return (
            <li key={person.name}>
              {person.name} {person.number}{" "}
              <button type="button" onClick={() => removePerson(person)}>
                Delete
              </button>
            </li>
          );
        }
      })}
    </ul>
  );
};

export default Persons;
