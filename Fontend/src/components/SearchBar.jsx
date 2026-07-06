import React, { useState, useEffect } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch, searchResult, setSearchResult }) => {
  const [searchId, setSearchId] = useState('');
  const [localTimeLeft, setLocalTimeLeft] = useState(null);

  useEffect(() => {

    if (localTimeLeft === null) return;

    if (localTimeLeft === 0) {
      // 🛑 रितिक भाई का लॉजिक: 30 सेकंड खत्म होते ही स्टेट को बदल दो और डेटा छुपा दो
      setSearchResult({
        status: "EXPIRED",
        error: "Data Removed from Cache & Time is Ended"
      });
      setLocalTimeLeft(null); // टाइमर को वापस रोक दो
      return;
    }

    // हर 1 सेकंड में लोकल टाइमर को 1 से घटाना (Tick-Tick Countdown)
    const timer = setTimeout(() => {
      setLocalTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer); // क्लीनअप
  }, [localTimeLeft, setSearchResult]);

  // जब पैरेंट (App.jsx) से नया सर्च रिजल्ट आएगा, तो लोकल टाइमर को सिंक करो
  useEffect(() => {
    if (searchResult && searchResult.timeLeft !== undefined) {
      setLocalTimeLeft(searchResult.timeLeft);
    } else {
      setLocalTimeLeft(null);
    }
  }, [searchResult]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!searchId.trim()) {
      alert("Please enter a numeric ID to search!");
      return;
    }
    onSearch(searchId);
  };

  return (
    <div className={styles.searchCard}>
      <h3 className={styles.searchTitle}>Block 3: Intelligent Engine Search Bar</h3>
      
      <form onSubmit={handleFormSubmit} className={styles.searchForm}>
        <input 
          type="number" 
          placeholder="Enter Numeric ID (e.g., 101)" 
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          min="1"
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchBtn}>Research</button>
      </form>

      {searchResult && (
        <div>

          {searchResult.status === "CACHE HIT" && (
            <div className={`${styles.statusCard} ${styles.hitCard}`}>
              <div className={styles.cardHeader}>
                <span className={styles.hitBadge}>🟢 {searchResult.status}</span>
                <span className={styles.ttlTimer}>⏱️ {localTimeLeft}s left</span>
              </div>
              <div className={styles.cardBody}>
                <p><strong>ID:</strong> {searchResult.id}</p>
                <pre className={styles.jsonPreview}>{JSON.stringify(searchResult.value, null, 2)}</pre>
              </div>
              <p className={styles.footerMsg}>⚡ Served instantly from Server RAM Memory!</p>
            </div>
          )}

          
          {searchResult.status === "CACHE MISS" && (
            <div className={`${styles.statusCard} ${styles.missCard}`}>
              <div className={styles.cardHeader}>
                <span className={styles.missBadge}>🔴 {searchResult.status}</span>
                <span className={styles.ttlTimer} style={{color: '#eab308'}}>⏱️ {localTimeLeft}s re-pop</span>
              </div>
              <div className={styles.cardBody}>
                <p><strong>ID:</strong> {searchResult.id}</p>
                <pre className={styles.jsonPreview}>{JSON.stringify(searchResult.value, null, 2)}</pre>
              </div>
              <div className={styles.alertBox}>
                🔄 <strong>Lazy Repopulation Active:</strong> {searchResult.message}
              </div>
            </div>
          )}

          
          {searchResult.status === "EXPIRED" && (
            <div className={`${styles.statusCard} ${styles.expiredCard}`}>
              <span className={styles.expiredBadge}>🛑 CACHE EVICTED</span>
              <p className={styles.expiredText}>{searchResult.error}</p>
              <span className={styles.expiredSub}>Engine state is idle. Please re-search to hit DB again.</span>
            </div>
          )}

          
          {searchResult.status === "NOT FOUND" && (
            <div className={`${styles.statusCard} ${styles.notFoundCard}`}>
              <span className={styles.notFoundBadge}>❌ DATA NOT FOUND</span>
              <p className={styles.notFoundText}>{searchResult.error}</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default SearchBar;