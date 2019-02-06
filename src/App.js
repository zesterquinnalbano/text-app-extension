import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Menu, Icon } from "antd";

class App extends Component {
  render() {
    const state = {
      current: "mail"
    };

    const handleClick = e => {
      console.log("click ", e);
      this.setState({
        current: e.key
      });
    };
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Menu
          onClick={handleClick}
          selectedKeys={[state.current]}
          mode="horizontal"
        >
          <Menu.Item key="mail">
            <Icon type="inbox" />
            Navigation One
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default App;
