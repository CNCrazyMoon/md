import React from "react";
import { hot } from "react-hot-loader/root";
import "antd/dist/antd.css";
import style from "./style.less";
function App() {
  return <div className={style["editor"]}>editor</div>;
}

export default hot(App);
