import React from "react";

const NumberInput = ({ amount, numChange }) => {
  return (
    <div>
      <input
        className="number-box"
        type="number"
        value={amount}
        onChange={numChange}
      />
    </div>
  );
};

export default NumberInput;
