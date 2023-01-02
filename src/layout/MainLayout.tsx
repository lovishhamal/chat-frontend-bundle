import React from "react";
import Styles from "./MainLayout.module.css";

const MainLayout = ({ children }: { children: any }) => {
  return <div className={Styles.mainContainer}>{children}</div>;
};

export default MainLayout;
