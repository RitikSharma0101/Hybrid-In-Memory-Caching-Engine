import React, { useState, useEffect } from 'react';
import InjectForm from './components/InjectForm';
import LiveTable from './components/LiveTable';
import SearchBar from './components/SearchBar';
import Loader from './components/Loader';
import styles from './App.module.css';

function App() {
  // Global States
  const [activeKeys, setActiveKeys] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(false);

  const API_URL = "http://localhost:5000/api"; // change it

  const fetchActiveKeys = async () => {
    try {
      const response = await fetch(`${API_URL}/keys`);
      if (response.ok) {
        const data = await response.json();
        setActiveKeys(data);
      }
    } catch (error) {
      console.error("Error fetching live keys:", error);
    }
  };

  useEffect(() => {
    fetchActiveKeys();
    const interval = setInterval(fetchActiveKeys, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSetData = async (id, value, ttl) => {
    setGlobalLoading(true);
    try {
      const response = await fetch(`${API_URL}/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, value, ttl })
      });
      
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Something went wrong");
      } else {
        fetchActiveKeys();
      }
    } catch (error) {
      alert("Failed to connect to server");
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleSearchData = async (searchId) => {
    setGlobalLoading(true);
    setSearchResult(null); 
    try {
      const response = await fetch(`${API_URL}/search/${searchId}`);
      const data = await response.json();
      
      if (response.ok) {
        setSearchResult(data);
      } else {
        setSearchResult({ status: "NOT FOUND", error: data.message || data.error });
      }
    } catch (error) {
      alert("Search failed due to server error");
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <>
      <div className={styles.appContainer}>
      {globalLoading && <Loader />}

      <header className={styles.appHeader}>
        <h1>Mini Redis-Like Hybrid Engine</h1>
        <p>In-Memory TTL Caching Mechanism with MongoDB Fallback</p>
      </header>

      <main className={styles.dashboardLayout}>
        
         <section className={styles.rightColumn}>
          <InjectForm onSetData={handleSetData} />
          <SearchBar 
            onSearch={handleSearchData} 
            searchResult={searchResult} 
            setSearchResult={setSearchResult} 
          />
        </section>

        <section className={styles.leftColumn}>
          
          <LiveTable activeKeys={activeKeys} />
        </section>

       

      </main>
    </div>
    </>
  )
}

export default App
