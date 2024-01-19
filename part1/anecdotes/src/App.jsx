import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const mostIndex = (() => {
    let maxIndex = undefined;
    let maxVote = -Infinity;
    for (let i = 0; i < votes.length; i++) {
      if (votes[i] > maxVote) {
        maxVote = votes[i];
        maxIndex = i;
      }
    }
    return maxIndex;
  })();

  const handleClickVote = () => {
    const newVotes = [...votes];
    newVotes[selected]++;
    setVotes(newVotes);
  };

  const handleClickNext = () => {
    const getRandomInt = (max) => {
      return Math.floor(Math.random() * max);
    };
    setSelected(getRandomInt(anecdotes.length));
  };

  return (
    <>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <div>has {votes[selected]} votes</div>
      <button onClick={handleClickVote}>vote</button>
      <button onClick={handleClickNext}>next anecdote</button>

      <h1>Anecdote with the most votes</h1>
      <div>{anecdotes[mostIndex]}</div>
      <div>has {votes[mostIndex]} votes</div>
    </>
  );
};

export default App;
