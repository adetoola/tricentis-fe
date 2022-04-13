import "./App.css";

import { useState, useEffect } from "react";
import axios from "axios";

import { debounce } from "./utils";

const url = "https://itunes.apple.com/search?term=";
const initialList = ["A", "B", "C", "D", "E"];

function App() {
  const [searchKey, setSearchKey] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [displayList, setDisplayList] = useState([...initialList]);
  const [loading, setLoading] = useState(false);

  // Fetch results from iTunes API, sort and pick first 5 items
  const fetchResult = async (term) => {
    const result = await axios.get(url + term);
    const sortedResult = result.data.results
      .sort((a, b) => (a.collectionName > b.collectionName ? 1 : -1))
      .slice(5);

    setSearchResult(sortedResult.map((item) => item.collectionName));
  };

  // call fetchResult function with searchKey
  const handleSearch = () => {
    setLoading(true);
    fetchResult(searchKey);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (searchResult.length > 0) {
        setDisplayList([...initialList.slice(1), ...searchResult]);
      } else {
        setDisplayList([...displayList.slice(1), displayList[0]]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [displayList, searchResult, loading]);

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Search Band"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
        onKeyPress={debounce(() => handleSearch(), 3000)}
      />
      <div className="result-container">
        {displayList.slice(0, 5).map((result, index) => {
          return (
            <div className="result" key={index}>
              {result}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
