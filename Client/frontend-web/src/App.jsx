import { useState , useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

   function App() {
      const [message, setMessage] = useState('Loading...');

      useEffect(() => {
        // Fetch data from the Spring Boot backend
        fetch('http://localhost:8082/api/hello')
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); // Get response as plain text
          })
          .then(data => setMessage(data))
          .catch(error => {
            console.error("Error fetching data:", error);
            setMessage("Failed to load message from backend.");
          });
      }, []); // Empty dependency array means this runs once after initial render

      return (
        <div className="App">
          <header className="App-header">
            <h1>Live Stream App</h1>
            <p>{message}</p>
            <p>Vite ReactJS Frontend is running!</p>
          </header>
        </div>
      );
    }

export default App
