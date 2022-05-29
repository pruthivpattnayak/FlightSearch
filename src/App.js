import React from "react";
import "./App.css";
import { SearchForm, SearchResults } from "./features/search/Search";

function App() {
    return (
        <div className="">
            <SearchForm />
            <SearchResults />
        </div>
    );
}

export default App;
