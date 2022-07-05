import React from "react";
import Select from "react-select";
import "./currencyRow.css";

//in order to see the full list of currencies here, i need to pass the state of currency options here
const CurrencyRow = ({ currencyOptions, selectedCurrency, onChangeCurr }) => {
  // transforming the currencyOptions into an Object to be used in react-select
  const currencyObj = [...currencyOptions];
  const filter = [];
  for (let i = 0; i < currencyObj.length; i += 1) {
    const currency = currencyObj[i];
    filter.push({ value: currency, label: currency, key: currency });
  }

  const customStyles = {
    //option means the dropdown box styling
    //control means the select box itself
    option: (provided) => ({
      ...provided,
      borderBottom: "1px dotted black",
      padding: 16,
    }),
    control: (provided) => ({
      ...provided,
      marginTop: 0,
      width: 200,
      height: 40,
      fontSize: 18,
      borderRadius: 4,
    }),
  };

  const customTheme = (theme) => {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary: "#362333",
        primary25: "#FAD4D8",
        neutral80: "#4e555f",
        neutral30: "#362333",
      },
    };
  };

  return (
    <Select
      className="currency-box"
      value={filter.find(({ value }) => value === selectedCurrency)}
      onChange={onChangeCurr}
      // onChange={(onChange) => console.log(onChange.value)}
      options={filter}
      styles={customStyles}
      theme={customTheme}
      isSearchable
      noOptionsMessage={() => "No such currency symbol (⊙_⊙;)"}
    />
  );
};

export default CurrencyRow;
