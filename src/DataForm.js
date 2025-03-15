import React, { useState } from 'react';
import axios from 'axios';

function DataForm() {
  const [formData, setFormData] = useState({
    date: '',
    salesUnits: '',
    temperature: '',
    rainfall: '',
    humidity: '',
    windSpeed: '',
    moodScore: '',
    stress: '',
    productivity: '',
    sleepQuality: '',
    socialInteraction: '',
    cognitiveFocus: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:5000/data', formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
    .then(response => {
      alert('Data Added Successfully');
      setFormData({
        date: '', salesUnits: '', temperature: '', rainfall: '',
        humidity: '', windSpeed: '', moodScore: '', stress: '',
        productivity: '', sleepQuality: '', socialInteraction: '',
        cognitiveFocus: ''
      });
    })
    .catch(error => {
      alert('Error adding data!');
      console.error(error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Data</h2>
      <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      <input type="number" name="salesUnits" value={formData.salesUnits} onChange={handleChange} placeholder="Sales (Units)" required />
      <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="Temperature" required />
      <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} placeholder="Rainfall" required />
      <input type="number" name="humidity" value={formData.humidity} onChange={handleChange} placeholder="Humidity" required />
      <input type="number" name="windSpeed" value={formData.windSpeed} onChange={handleChange} placeholder="Wind Speed" required />
      <input type="number" name="moodScore" value={formData.moodScore} onChange={handleChange} placeholder="Mood Score" required />
      <input type="number" name="stress" value={formData.stress} onChange={handleChange} placeholder="Stress" required />
      <input type="number" name="productivity" value={formData.productivity} onChange={handleChange} placeholder="Productivity" required />
      <input type="number" name="sleepQuality" value={formData.sleepQuality} onChange={handleChange} placeholder="Sleep Quality" required />
      <input type="number" name="socialInteraction" value={formData.socialInteraction} onChange={handleChange} placeholder="Social Interaction" required />
      <input type="number" name="cognitiveFocus" value={formData.cognitiveFocus} onChange={handleChange} placeholder="Cognitive Focus" required />
      <button type="submit">Add Data</button>
    </form>
  );
}

export default DataForm;
