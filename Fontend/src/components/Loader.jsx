import React from 'react';
import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.loaderContainer}>
    
        <div className={styles.spinnerRing}></div>
        
        <p className={styles.loadingText}>Communicating with Hybrid Engine...</p>
        <span className={styles.subText}>Syncing DB & Cache</span>
      </div>
    </div>
  );
};

export default Loader;