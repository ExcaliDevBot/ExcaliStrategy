import React, { useState } from 'react';

const ACCESS_CODE = '12345'; // Replace with your locally stored code

interface CodeEntryProps {
  onAuthenticate: () => void;
}

const CodeEntry: React.FC<CodeEntryProps> = ({ onAuthenticate }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (code === ACCESS_CODE) {
      onAuthenticate(); // Call the function to update authentication state
    } else {
      setError('Invalid code. Please try again.');
    }
  };

  return (
    <div className="code-entry">
      <h2>Enter Access Code</h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter code"
        className="border p-2 rounded"
      />
      <button onClick={handleSubmit} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default CodeEntry;