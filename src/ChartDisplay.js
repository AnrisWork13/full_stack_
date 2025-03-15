import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ChartDisplay({ column }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (column) {
      fetch(`http://127.0.0.1:5000/data/${column}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
        .then(response => response.json())
        .then(data => {
          const labels = data.map(item => item[0]);
          const values = data.map(item => item[1]);

          setChartData({
            labels: labels,
            datasets: [
              {
                label: column,
                data: values,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1
              }
            ]
          });
        })
        .catch(error => {
          console.error("Error fetching data for column:", error);
        });
    }
  }, [column]);

  if (!chartData) return <div>Loading chart...</div>;

  return <Line data={chartData} />;
}

export default ChartDisplay;
