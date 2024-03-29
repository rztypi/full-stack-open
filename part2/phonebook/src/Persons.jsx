import personService from "./services/persons";

const Persons = ({ personsState, filter, pushNotification }) => {
  const [persons, setPersons] = personsState;

  const removePerson = (person) => {
    if (!confirm(`Remove ${person.name}?`)) {
      return;
    }

    personService
      .remove(person.id)
      .then((returnedPerson) => {
        setPersons(persons.filter((p) => p.id !== returnedPerson.id));
        pushNotification({
          type: "success",
          message: `Removed "${returnedPerson.name}"`,
        });
      })
      .catch(() => {
        setPersons(persons.filter((p) => p.id !== person.id));
        pushNotification({
          type: "error",
          message: `"${person.name}" has already been removed from the server.`,
        });
      });
  };

  return (
    <ul>
      {persons.map((person) => {
        if (person.name.toLowerCase().startsWith(filter.toLowerCase())) {
          return (
            <li key={person.id}>
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
