import React from "react";

const PercentInput = ({ value, onChange, placeholder }) => {
  const handleChange = (e) => {
    const raw = e.target.value.replace(',', '.');
    if (!/^\d*\.?\d*$/.test(raw)) return;
    onChange(raw);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
  width: '100%',
  padding: '8px 12px',
  fontSize: '14px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  paddingRight: '30px',
  boxSizing: 'border-box',
}}
      />

    <span
  style={{
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#555',
    fontSize: '14px',
    pointerEvents: 'none',
  }}
>
  %
</span>


    </div>
  );
};

export default PercentInput;
