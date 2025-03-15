import React, { useState } from 'react';
import axios from 'axios';

function ColumnSelector() {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [columnData, setColumnData] = useState([]);

  const columns = [
    "Sales (Units)", "Temperature", "Rainfall", "Humidity",
    "Wind Speed", "Mood Score", "Stress", "Productivity",
    "Sleep Quality", "Social Interaction", "Cognitive Focus"
  ];

  const handleColumnChange = (event) => {
    const column = event.target.value;
    setSelectedColumn(column);
    if (column) {
      axios.get(`http://127.0.0.1:5000/data/${column}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
        .then(response => setColumnData(response.data))
        .catch(error => console.error('Error fetching column data', error));
    }
  };

  return (
    <div>
      <h2>Select a Column to Display</h2>
      <select onChange={handleColumnChange}>
        <option value="">Select a column</option>
        {columns.map((column) => (
          <option key={column} value={column}>{column}</option>
        ))}
      </select>

      {selectedColumn && (
        <div>
          <h3>Data for {selectedColumn}</h3>
          <ul>
            {columnData.map((item, index) => (
              <li key={index}>{item[0]}: {item[1]}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ColumnSelector;
