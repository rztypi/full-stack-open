import Part from "./Part";

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
      <p style={{ fontWeight: "bold" }}>
        total of {parts.reduce((sum, part) => sum + part.exercises, 0)}{" "}
        exercises
      </p>
    </>
  );
};

export default Content;
