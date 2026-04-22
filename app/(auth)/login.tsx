import { Redirect } from "expo-router";
import React from "react";

const login = () => {
  return <Redirect href={"/(auth)/signup"} />;
};

export default login;
