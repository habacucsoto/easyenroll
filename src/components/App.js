import React, {Component} from "react";
import Header from "./Header";
import IneList from "./IneList";
import CreateIne from "./CreateIne";
import Login from "./Login";
import { Route, Routes } from "react-router-dom";

class App extends Component {
    render() {
        return (
            <div className="center w85">
                <Header />
                <div className="ph3 pv1 background-gray">
                    <h1>INEs</h1>
                <Routes>
                    <Route path="/" element={<IneList />} />
                    <Route path="/create" element={<CreateIne />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
                </div>
            </div>
        );
    }
}

export default App;
