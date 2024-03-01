const Filter = ({ filterState }) => {
  const [filter, setFilter] = filterState;

  return (
    <div>
      find countries{" "}
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
    </div>
  );
};

export default Filter;
