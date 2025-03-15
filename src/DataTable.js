import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DataTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/data', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:5000/data/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
      .then(() => {
        setData(data.filter(item => item.id !== id));
      })
      .catch(error => console.error('Error deleting data', error));
  };

  return (
    <div>
      <h2>Data Table</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Sales (Units)</th>
            <th>Temperature</th>
            <th>Rainfall</th>
            <th>Humidity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.sales_units}</td>
              <td>{item.temperature}</td>
              <td>{item.rainfall}</td>
              <td>{item.humidity}</td>
              <td>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
