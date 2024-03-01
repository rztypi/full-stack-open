const Filter = ({ filterState }) => {
  const [filter, setFilter] = filterState;

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};

export default Filter;
