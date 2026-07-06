import React from 'react';
import styles from './LiveTable.module.css';

const LiveTable = ({ activeKeys }) => {
  return (
    <div className={styles.tableCard}>
      <h3 className={styles.tableTitle}>Block 2: Live In-Memory Cache Monitor (RAM)</h3>
      
      {activeKeys.length === 0 ? (
        <div className={styles.emptyState}>
          <p>RAM Cache is currently empty.</p>
          <span>Inject data or search to pop keys with TTL into memory!</span>
        </div>
      ) : (
        
        <div className={styles.tableResponsive}>
          <table className={styles.mainTable}>
            <thead>
              <tr>
                <th>Numeric ID (Key)</th>
                <th>JSON Object (Value)</th>
                <th>Time-To-Live (Remaining)</th>
              </tr>
            </thead>
            <tbody>
              {activeKeys.map((item) => (
                <tr key={item.id} className={styles.tableRow}>
          
                  <td className={styles.idTd}>
                    <span className={styles.idBadge}>{item.id}</span>
                  </td>
                  
                  
                  <td className={styles.valueTd}>
                    <pre className={styles.jsonCode}>
                      {JSON.stringify(item.value, null, 2)}
                    </pre>
                  </td>
                  
                  
                  <td className={styles.ttlTd}>
                    <span className={styles.ttlBadge}>
                      ⏱️ {item.timeLeft}s
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LiveTable;