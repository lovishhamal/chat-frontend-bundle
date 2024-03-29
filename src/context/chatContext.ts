import {
  SET_INITIAL_MESSAGE,
  SET_MESSAGE,
  SET_USER,
} from "../constants/actions";
import React, { useReducer } from "react";
import { IInitialChatProps } from "../interface/components/chat/chatInterface";
import { LocalStorage } from "../util/localStorage";

const ChatContext = React.createContext({});

const initialState: IInitialChatProps = {
  messages: [],
  user: {},
};

const reducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case SET_USER:
      LocalStorage.setLocalStorage("item", action.payload);
      return {
        ...state,
        user: action.payload,
      };
    case SET_INITIAL_MESSAGE:
      return {
        ...state,
        messages: action.payload?.messages ?? [],
      };
    case SET_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
  }
};

const ChatReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
};

export { ChatContext, ChatReducer };
