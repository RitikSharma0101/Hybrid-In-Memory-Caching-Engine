import React, { useState } from 'react';
import styles from './InjectForm.module.css';

const InjectForm = ({ onSetData }) => {
  const [id, setId] = useState('');
  const [valueStr, setValueStr] = useState('');
  const [ttl, setTtl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!id || !valueStr || !ttl) {
      alert("All fields are required!");
      return;
    }

    let parsedValue;
    try {
      parsedValue = JSON.parse(valueStr);
      
      if (typeof parsedValue !== 'object' || Array.isArray(parsedValue) || parsedValue === null) {
        throw new Error();
      }
    } catch (err) {
      alert("Format Error: Value must be a valid JSON Object! (Example: {\"name\":\"Ritik\",\"role\":\"admin\"} )");
      return;
    }

    onSetData(Number(id), parsedValue, Number(ttl));

    setId('');
    setValueStr('');
    setTtl('');
  };

  return (
    <div className={styles.formCard}>
      <h3 className={styles.formTitle}>Block 1: Inject Data to DB & Cache</h3>
      
      <form onSubmit={handleSubmit} className={styles.mainForm}>
        
        <div className={styles.inputGroup}>
          <label>Unique Numeric ID (Key):</label>
          <input 
            type="number" 
            placeholder="e.g., 101" 
            value={id}
            onChange={(e) => setId(e.target.value)}
            min="1"
          />
        </div>

        
        <div className={styles.inputGroup}>
          <label>JSON Object (Value):</label>
          <textarea 
            placeholder='e.g., {"name": "Ritik", "age": 21}' 
            value={valueStr}
            onChange={(e) => setValueStr(e.target.value)}
            rows="2"
          />
        </div>

        
        <div className={styles.inputGroup}>
          <label>Time-To-Live (TTL in Seconds):</label>
          <input 
            type="number" 
            placeholder="e.g., 60" 
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            min="1"
          />
        </div>

        
        <button type="submit" className={styles.submitBtn}>
          Submit
        </button>

      </form>
    </div>
  );
};

export default InjectForm;