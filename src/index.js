import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as d3 from "d3";
import axios from "axios";

const App = () => {
  const [countryData, setCountryData] = useState([]);

  useEffect(() => {
    const fetchAPI = async () => {
      const response = await axios.get("https://disease.sh/v3/covid-19/countries");
      const data = response.data;
      setCountryData(data);
    };
    fetchAPI();
  }, []);

  return (
    <div className="container">
      <h1 id="title"> Covid Data Chart</h1>
      <div className="graph">
        <DataChart data={countryData} height={500} widthOfBar={5} width={countryData.length * 5} dataType={"casesPerOneMillion"} />
      </div>
    </div>
  );
};

const DataChart = ({ data, height, width, widthOfBar, dataType }) => {
  useEffect(() => {
    createDataChart();
  }, [data]);

  const createDataChart = () => {
    const countryData = data.map((country) => country["casesPerOneMillion"]);
    const countries = data.map((country) => country.country);

    let tooltip = d3.select(".graph").append("div").attr("id", "tooltip").style("opacity", 0);

    const dataMax = d3.max(countryData);
    const yScale = d3.scaleLinear().domain([0, dataMax]).range([0, height]);
    d3.select("svg")
      .selectAll("rect")
      .data(countryData)
      .enter()
      .append("rect")
      .style("fill", (d, i) => (i % 2 === 0 ? "red" : "blue"))
      .attr("x", (d, i) => i * widthOfBar)
      .attr("y", (d) => height - yScale(d + dataMax * 0.1))
      .attr("height", (d, i) => yScale(d + dataMax * 0.1))
      .attr("width", widthOfBar)
      .on("mouseover", (d, i) => {
        tooltip.style("opacity", 0.9);
        tooltip
          .html(countries[i] + `<br> ${dataType} <br>` + d)
          .style("left", i * widthOfBar + 20 + "px")
          .style("top", d3.event.pageY - 170 + "px");
      })
      .on("mouseout", (d) => {
        tooltip.style("opacity", 0);
      });
  };

  return (
    <>
      <svg width={width} height={height}></svg>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
