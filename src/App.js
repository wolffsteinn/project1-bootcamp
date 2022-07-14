import "./App.css";
import { useEffect, useState } from "react";
import CurrencyRow from "./CurrencyRow.js";
import NumberInput from "./numberBox.js";
import { RiArrowUpDownFill } from "react-icons/ri";
import axios from "axios";

//not intending to use axios for the dependencies useEffect because object nesting too cray

function App() {
  //states to change number
  const [amount, setAmount] = useState(1);

  //number display with thousand separators
  const [topPrintValue, setTopPrintValue] = useState("");
  const [bottomPrintValue, setBottomPrintValue] = useState("");

  //states to change the symbol
  const [topCurrSym, setTopCurrSym] = useState();
  const [bottomCurrSym, setBottomCurrSym] = useState();

  //calling the full names of the currencies
  const [topFullName, setTopFullName] = useState();
  const [bottomFullName, setBottomFullName] = useState();

  //states to change the exchange rates
  const [exchangeRate, setExchangeRate] = useState(1);
  //states to set ALL currency symbol options
  const [currencyOptions, setCurrencyOptions] = useState([]);
  //deciding which row is being changed by user
  const [amtIsFromTopRow, setAmtIsFromTopRow] = useState(true);

  // allowing for currency conversion both ways
  let topAmt, bottomAmt, roundedExchangeRate;
  if (amtIsFromTopRow) {
    topAmt = amount;
    roundedExchangeRate = exchangeRate;
    bottomAmt = (topAmt * roundedExchangeRate).toFixed(4);
  } else {
    bottomAmt = amount;
    roundedExchangeRate = exchangeRate;
    topAmt = (bottomAmt / roundedExchangeRate).toFixed(4);
  }

  const fullNameCurr =
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json";

  const START_URL =
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/";

  let endpoints = [`${START_URL}currencies/eur.json`, fullNameCurr];

  useEffect(() => {
    axios
      .all(endpoints.map((endpoints) => axios.get(endpoints)))
      .then(
        axios.spread((currencies, fullname) => {
          //to set the states for all inputs of the app
          const upperCaseKeys = {};
          for (const [key, value] of Object.entries(currencies.data.eur)) {
            upperCaseKeys[key.toUpperCase()] = value;
          }
          const firstCurrency = Object.keys(upperCaseKeys)[88];
          setCurrencyOptions([...Object.keys(upperCaseKeys)]);
          setTopCurrSym(Object.keys(upperCaseKeys)[79]);
          setBottomCurrSym(Object.keys(upperCaseKeys)[88]);
          setExchangeRate(upperCaseKeys[firstCurrency]);

          //to set the full name of the currency converted
          const upperCaseFullName = {};
          for (const [key, value] of Object.entries(fullname.data)) {
            upperCaseFullName[key.toUpperCase()] = value;
          }
          setTopFullName(Object.values(upperCaseFullName)[79]);
          setBottomFullName(Object.values(upperCaseFullName)[88]);
        })
      )
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (topCurrSym !== undefined && bottomCurrSym !== undefined) {
      let scenario1 = [
        fullNameCurr,
        `${START_URL}currencies/${Object.values(
          topCurrSym
        )[0].toLowerCase()}/gbp.json`,
      ];

      let scenario2 = [
        fullNameCurr,
        `${START_URL}currencies/eur/${Object.values(
          bottomCurrSym
        )[0].toLowerCase()}.json`,
      ];
      let scenario3 = [
        fullNameCurr,
        `${START_URL}currencies/${Object.values(
          topCurrSym
        )[0].toLowerCase()}/${Object.values(
          bottomCurrSym
        )[0].toLowerCase()}.json`,
      ];
      if (typeof topCurrSym === "object" && typeof bottomCurrSym === "string") {
        axios
          .all(scenario1.map((end) => axios.get(end)))
          .then(
            axios.spread((fullname, conversion) => {
              setExchangeRate(Object.values(conversion.data)[1]);
              setTopFullName(
                fullname.data[Object.values(topCurrSym)[0].toLowerCase()]
              );
            })
          )
          .catch((err) => console.log(err));
      } else if (
        typeof topCurrSym === "string" &&
        typeof bottomCurrSym === "object"
      ) {
        axios
          .all(scenario2.map((end) => axios.get(end)))
          .then(
            axios.spread((fullname, conversion) => {
              setExchangeRate(Object.values(conversion.data)[1]);
              setBottomFullName(
                fullname.data[Object.values(bottomCurrSym)[0].toLowerCase()]
              );
            })
          )
          .catch((err) => console.log(err));
      } else if (
        typeof topCurrSym === "object" &&
        typeof bottomCurrSym === "object"
      ) {
        axios
          .all(scenario3.map((end) => axios.get(end)))
          .then(
            axios.spread((fullname, conversion) => {
              setExchangeRate(Object.values(conversion.data)[1]);
              setTopFullName(
                fullname.data[Object.values(topCurrSym)[0].toLowerCase()]
              );
              setBottomFullName(
                fullname.data[Object.values(bottomCurrSym)[0].toLowerCase()]
              );
            })
          )
          .catch((err) => console.log(err));
      }
    }
  }, [topCurrSym, bottomCurrSym]);

  useEffect(() => {
    const testCase = /\./g;
    const regex = /\d(?=\d*\.\d)(?=(?:\d{3})+(?!\d))/g;
    if (testCase.test(topAmt)) {
      setTopPrintValue(`${topAmt}`.replace(regex, "$&,"));
      setBottomPrintValue(`${bottomAmt}`.replace(regex, "$&,"));
    } else {
      setTopPrintValue(
        `${topAmt}`.replace(/[0-9]+/g, (num) => (+num).toLocaleString())
      );
      setBottomPrintValue(`${bottomAmt}`.replace(regex, "$&,"));
    }
  }, [topAmt, bottomAmt]);

  const handleTopSymChange = (e) => {
    setTopCurrSym(e);
  };

  const handleBottomSymChange = (change) => {
    setBottomCurrSym(change);
  };

  const handleTopNumChange = (e) => {
    if (e.target.value < 0) {
      return;
    } else {
      setAmount(e.target.value);
      setAmtIsFromTopRow(true);
    }
  };

  const handleBottomNumChange = (e) => {
    if (e.target.value < 0) {
      return;
    } else {
      setAmount(e.target.value);
      setAmtIsFromTopRow(false);
    }
  };

  const writingTopSymbol = () => {
    if (typeof topCurrSym === "string") {
      return topCurrSym;
    } else if (typeof topCurrSym === "object") {
      return Object.values(topCurrSym)[0];
    }
  };

  const writingBottomSymbol = () => {
    if (typeof bottomCurrSym === "string") {
      return bottomCurrSym;
    } else if (typeof bottomCurrSym === "object") {
      return Object.values(bottomCurrSym)[0];
    }
  };

  return (
    <div className="main-container">
      <div className="top-text">
        <h1 className="title">Currency Converter</h1>
        <p>
          <em>Convert to and fro any fiat OR crypto currency!</em>
        </p>
      </div>
      <div className="indiv-row-container">
        <NumberInput amount={topAmt} numChange={handleTopNumChange} />
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={topCurrSym}
          onChangeCurr={handleTopSymChange}
        />
      </div>
      <span className="span">
        {" "}
        <RiArrowUpDownFill />{" "}
      </span>
      <div className="indiv-row-container">
        <NumberInput amount={bottomAmt} numChange={handleBottomNumChange} />
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={bottomCurrSym}
          onChangeCurr={handleBottomSymChange}
        />
      </div>
      <p className="sentence">
        {topPrintValue} {writingTopSymbol()} ({topFullName}) is equivalent to{" "}
        {bottomPrintValue} {writingBottomSymbol()} ({bottomFullName}){" "}
      </p>
      <p>
        <em>Please note that rates are updated daily</em>
      </p>
      <p className="credits">
        <em>Data Source: https://github.com/fawazahmed0/currency-api</em>
      </p>
    </div>
  );
}

export default App;
