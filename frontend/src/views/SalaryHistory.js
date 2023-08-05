import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import SalaryHistoryChart from "../components/SalaryHistoryChart";
import { Bar } from "react-chartjs-2";
import {
  REACT_APP_LOAD,
  BASE_URL,
  URL_CREDENTIALS,
  countryOptions as countries,
} from "../constants";

const URLS = {
  live: {
    category: (country) =>
      `${BASE_URL}/${country}/categories?${URL_CREDENTIALS}`,
    salaryHistory: (country, category) =>
      `${BASE_URL}/${country}/history?${URL_CREDENTIALS}&category=${category}`,
    searchData: (country) =>
      `${BASE_URL}/${country}/search?${URL_CREDENTIALS}&results_per_page=30`,
  },
  dev: {
    category: (c) => "/cached_responses/job_categories.json",
    salaryHistory: (c, sc) => "/cached_responses/salary_history.json",
    searchData: (c) => "/cached_responses/search_results.json",
  },
};
const endpoints = REACT_APP_LOAD === "live" ? URLS.live : URLS.dev;
const countryOptions = Object.keys(countries).map((value) => ({
  key: countries[value],
  value,
}));

//visualizations functions
const createBarChartData = (data) => {
  // Your logic to extract data for Bar Chart
  console.log("createBarChartData: ", data);
  return {
    labels: ["Mean Salary", "Maximum Salary"],
    datasets: [
      {
        label: "Salary",
        backgroundColor: ["#FF6384", "#36A2EB"],
        data: [data.mean, data.results[0].salary_max],
      },
    ],
  };
};
const createDoughnutChartData = (data) => {
  return {
    labels: ["Permanent"],
    datasets: [
      {
        data: [2],
        backgroundColor: ["#FF6384"],
      },
    ],
  };
};
const SalaryHistory = () => {
  const [country, selectCountry] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [salaryHistory, setSalaryHistory] = useState({});
  const [searchData, setSearchData] = useState(null);
  const [isSalaryHistoryLoading, setIsSalaryHistoryLoading] = useState(true);
  const [isSearchDataLoading, setIsSearchDataLoading] = useState(true);

  const fetchSalaryHistory = async () => {
    console.log("fetching salary history");

    setIsSalaryHistoryLoading(true);
    const endpoint = endpoints.salaryHistory(country, selectedCategory);
    const salHistResponse = await fetchData(endpoint);
    if (salHistResponse.error !== null) setSalaryHistory(salHistResponse.data);
    setIsSearchDataLoading(false);
  };

  const fetchSearchData = async () => {
    // http://api.adzuna.com/v1/api/jobs/gb/search/1?app_id={YOUR API ID}&app_key={YOUR API KEY}&results_per_page=20&what=javascript%20developer&content-type=application/json
    console.log("fetching job category");

    setIsSearchDataLoading(true);
    const endpoint = endpoints.searchData(country);
    const searchResponse = await fetchData(endpoint);
    if (searchResponse.error !== null) setSearchData(searchResponse.data);
    setIsSearchDataLoading(false);
  };

  const onCountryChange = async (event) => {
    const country = event.target.value;
    selectCountry(country);
    const endpoint = endpoints.category(country);
    const { error, data } = await fetchData(endpoint);
    if (error === null) setCategories(data.results);
  };

  const handleCategoryChange = (event) =>
    setSelectedCategory(event.target.value);

  const handleSearch = async () => {
    await Promise.all([fetchSalaryHistory(), fetchSearchData()]);
  };

  return (
    <>
      <Navbar />
      <section
        className="home-section section-hero overlay bg-image"
        id="home-section"
      >
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-12">
              <div className="mb-5 text-center">
                <h1 className="text-white font-weight-bold">
                  Job Salary Visualization
                </h1>
                <p>
                  Have a look at the minimum, average and maximum salaries here!
                </p>
              </div>

              <div className="row">
                <SelectElement
                  name="country"
                  label="Country"
                  // value={country}
                  options={countryOptions}
                  onChange={onCountryChange}
                />
                {categories.length !== 0 && (
                  <SelectElement
                    name="category"
                    label="Category"
                    options={categories.map((c) => ({
                      key: c.label,
                      value: c.tag,
                    }))}
                    onChange={handleCategoryChange}
                  />
                )}

                <div className="col">
                  <button
                    className="mt-4 bg-[#F4ECC2] text-black h-12 hover:bg-[#e9dea9] hover:text-white rounded outline-none focus:outline-none"
                    onClick={handleSearch}
                  >
                    SUBMIT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="map">
        <a href="APIPageExp">
          <div className="flex">
            <div className="basis-1/2">
              {isSalaryHistoryLoading ? (
                <p>Loading salary history chart...</p>
              ) : (
                <SalaryHistoryChart {...salaryHistory} />
              )}
            </div>
            <div className="basis-1/2">
              {isSearchDataLoading ? (
                <p>Loading chart ...</p>
              ) : (
                searchData && (
                  <>
                    <h2>Comparison of Mean Salary and Maximum Salaries</h2>
                    <Bar data={createBarChartData(searchData)} />
                  </>
                )
              )}
            </div>
          </div>
        </a>
      </section>

      <div className="bg-gray-900 py-10">
        <div className="mt-8 lg:px-24">
          <div className="bg-white p-10 rounded shadow">
            <p className="text-lg font-semibold">
              Welcome to the Job Salary History Page, where the past meets your
              career aspirations in an exhilarating visual journey!
            </p>
            <p className="font-light leading-8 mt-2">
              The page offers offers a compelling insight into the salary trends
              for various job categories within a specific country over the
              years. Here's what you can expect:
            </p>
            <p className="font-light mt-2 leading-8">
              By choosing your desired country and job category from the
              available options. This sets the stage for personalized insights.
            </p>
            <p className="font-light leading-8">
              Upon selection, the page transforms into an interactive canvas. It
              presents you with a line chart depicting the salary trends for the
              chosen job category across different years. Observe how salaries
              have evolved over time, gaining valuable historical context.
            </p>

            <p className="font-light mb-4 leading-8">
              Adjacent to the line chart is a bar chart that performs a unique
              comparative analysis. It provides a comprehensive view of the mean
              salary as well as the maximum salary for the selected job
              category. This allows you to grasp both the average and the
              highest earning potential.
            </p>
            <p className="font-light leading-8">
              The visualizations are not static. You can dive deeper by clicking
              on various elements within the charts. Your interactions unlock
              layers of insights, letting you discover hidden patterns and gain
              a thorough understanding of how salaries have fluctuated.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SalaryHistory;

function SelectElement(props) {
  const { id, name, label, options, onChange } = props;

  return (
    <div className="col mb-5">
      <label className="sr-only">{label}</label>
      <select
        id={id}
        name={name}
        className="text-gray-500 bg border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.key} value={option.value}>
            {option.key}
          </option>
        ))}
      </select>
    </div>
  );
}

const fetchData = async (url) => {
  const FETCH_OPTIONS = {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await fetch(url, FETCH_OPTIONS);
    const data = await res.json();
    return { error: null, data };
  } catch (err) {
    return { error: err.message, data: [] };
  }
};
