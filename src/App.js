import React from "react";
import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";
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
