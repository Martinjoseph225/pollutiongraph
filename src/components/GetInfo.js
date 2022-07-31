import React, { useEffect, useState } from "react";
import "../App.css";

import Graph from "./Graph";
const GetInfo = () => {
  const [cityData, setCityData] = useState([]);
  const [city, setCity] = useState("None");
  const [date, setDate] = useState("");
  const [pmData, setPmData] = useState([]);
  const [pm, setPm] = useState("None");
  const [value, setValue] = useState([]);
  const [flag, setFlag] = useState(true);
  const [uniqueFilteredValues, setUniqueFilteredValues] = useState([]);
  const handleFetchCityData = async () => {
    const options = { method: "GET", headers: { Accept: "application/json" } };

    const response = await fetch(
      "https://api.openaq.org/v2/cities?limit=100&page=1&offset=0&sort=asc&order_by=city",
      options
    );
    if (!response.ok) {
      throw new Error("Data coud not be fetched!");
    } else {
      return response.json();
    }
  };
  const handleFetchParameterData = async () => {
    const options = { method: "GET", headers: { Accept: "application/json" } };
    const response = await fetch(
      "https://api.openaq.org/v2/parameters?limit=100&page=1&offset=0&sort=asc&order_by=id",
      options
    );
    if (!response.ok) {
      throw new Error("Data coud not be fetched!");
    } else {
      return response.json();
    }
  };
  useEffect(() => {
    handleFetchCityData()
      .then((res) => {
        setCityData(res.results);
      })
      .catch((e) => {
        console.log(e.message);
      });
    handleFetchParameterData()
      .then((res) => {
        setPmData(res.results);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);
  let cityArray = cityData.filter((x) => x.city !== null).map((x) => x.city);
  let uniqueCityArray = [...new Set(cityArray)];
  let para = pmData.filter((x) => x.name !== null).map((x) => x.name);
  let para1 = [...new Set(para)];
  //   console.log(cityData);
  const getData = (city, date, pm) => {
    if (city === "None" || !date || pm === "None") {
      alert("Please fill the data");
    } else {
      const handleFetchGraphData = async () => {
        let fromDate = date + "T00%3A00%3A00";
        let toDate = date + "T23%3A59%3A59";
        const options = {
          method: "GET",
          headers: { Accept: "application/json" },
        };

        const response = await fetch(
          `https://api.openaq.org/v2/measurements?date_from=${fromDate}&date_to=${toDate}&limit=100&page=1&offset=0&sort=desc&parameter=${pm}&radius=1000&city=${city}&order_by=datetime`,
          options
        );
        if (!response.ok) {
          throw new Error("Data coud not be fetched!");
        } else {
          return response.json();
        }
      };

      handleFetchGraphData()
        .then((res) => {
          setValue(res.results);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
    let filteredValues = value.map((x) => {
      return {
        Time: x.date.utc.substring(11, 13) + " UTC",
        "Pollution Value": x.value,
      };
    });
    const key = "Time";

    const newFilteredValues = [
      ...new Map(filteredValues.map((item) => [item[key], item])).values(),
    ];
    setUniqueFilteredValues(newFilteredValues);
    setFlag(true);
  };

  return (
    <div className="getInfo">
      <div className="get-data">
        <label>
          Select City
          <select
            className="input"
            value={city}
            onChange={(e) => {
              setFlag(false);
              setCity(e.target.value);
            }}
            defaultValue="None"
          >
            <option>None</option>
            {uniqueCityArray.map((list) => (
              <option>{list}</option>
            ))}
          </select>
        </label>
        <label>
          Select Parameter
          <select
            className="input"
            value={pm}
            onChange={(e) => {
              setFlag(false);
              setPm(e.target.value);
            }}
          >
            <option>None</option>
            {para1.map((list) => (
              <option>{list}</option>
            ))}
          </select>
        </label>

        <div className="date">
          <div>
            Select Date
            <input
              className="input"
              type="date"
              id="Date"
              name="Date"
              value={date}
              onChange={(e) => {
                setFlag(false);
                setDate(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="button">
        <button className="save-button" onClick={() => getData(city, date, pm)}>
          Save
        </button>
        <div>
          <h3 className={!flag ? "msg" : "hidden"}>
            Press on save button to get the graph
          </h3>
        </div>
      </div>

      <div className="chart">
        {uniqueFilteredValues.length ? (
          <div className={flag ? "msg" : "hidden"}>
            <Graph
              uniqueFilteredValues={uniqueFilteredValues}
              city={city}
              date={date}
            />
          </div>
        ) : (
          <div className={flag ? "msg" : "hidden"}>
            <h1>No Data Available , Check for another city or parameter</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetInfo;
