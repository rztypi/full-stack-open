import { useState } from "react";

const Button = ({ handleClick, children }) => {
  return <button onClick={handleClick}>{children}</button>;
};

const Feedback = ({ states, stateUpdaters }) => {
  const { good, neutral, bad } = states;
  const { setGood, setNeutral, setBad } = stateUpdaters;

  return (
    <>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)}>good</Button>
      <Button handleClick={() => setNeutral(neutral + 1)}>neutral</Button>
      <Button handleClick={() => setBad(bad + 1)}>bad</Button>
    </>
  );
};

const StatLine = ({ name, value }) => {
  return (
    <>
      <tr>
        <td>{name}</td>
        <td>{value}</td>
      </tr>
    </>
  );
};

const Statistics = ({ states }) => {
  const { good, neutral, bad } = states;
  const all = good + neutral + bad;

  if (all === 0) {
    return (
      <>
        <h1>statistics</h1>
        <p>no feedback given</p>
      </>
    );
  }

  const average = (good - bad) / all;
  const positive = (good / all) * 100 + "%";

  return (
    <>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatLine name="good" value={good}></StatLine>
          <StatLine name="neutral" value={neutral}></StatLine>
          <StatLine name="bad" value={bad}></StatLine>
          <StatLine name="all" value={all}></StatLine>
          <StatLine name="average" value={average}></StatLine>
          <StatLine name="positive" value={positive}></StatLine>
        </tbody>
      </table>
    </>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const states = { good, neutral, bad };
  const stateUpdaters = { setGood, setNeutral, setBad };

  return (
    <>
      <Feedback states={states} stateUpdaters={stateUpdaters}></Feedback>
      <Statistics states={states}></Statistics>
    </>
  );
};

export default App;
