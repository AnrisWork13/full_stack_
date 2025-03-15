import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm'; // Import the LoginForm component
import ColumnSelector from './ColumnSelector'; // Select column to display
import DataForm from './DataForm'; // Form to add data
import DataTable from './DataTable'; // Table to display and manage data
import ChartDisplay from './ChartDisplay'; // Chart component to display graph

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <h1>Data Management Dashboard</h1>

      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div>
          <h2>Welcome to the Dashboard!</h2>
          <DataForm />
          <DataTable />
          <ColumnSelector />
          <ChartDisplay column="Rainfall" />
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;