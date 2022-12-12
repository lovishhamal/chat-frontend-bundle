import { SET_LOGGED_IN_USER } from "../constants/actions";
import React, { useReducer } from "react";

const AuthContext = React.createContext({});

const initialState = {
  user: {},
};

const reducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case SET_LOGGED_IN_USER:
      return {
        ...state,
        user: JSON.parse(action.payload),
      };
  }
};

const AuthReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
};

export { AuthContext, AuthReducer };
