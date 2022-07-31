import React from "react";
import "../App.css";
import {
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Bar,
} from "recharts";
const Graph = ({ uniqueFilteredValues, city, date }) => {
  return (
    <div className="chart">
      <h1>
        Pollution(y-axis) vs Time(x-axis) in {city} on {date}{" "}
      </h1>
      <BarChart
        width={500}
        height={300}
        data={uniqueFilteredValues}
        margin={{
          top: 5,
          right: 30,
          left: 80,
          bottom: 5,
        }}
        barSize={20}
      >
        <Legend />
        <XAxis dataKey="Time" scale="point" padding={{ left: 10, right: 10 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar
          dataKey="Pollution Value"
          fill="#8884d8"
          background={{ fill: "#eee" }}
        />
      </BarChart>
    </div>
  );
};

export default Graph;
