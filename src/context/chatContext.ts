import { SET_MESSAGE, SET_USER } from "../constants/actions";
import React, { useReducer } from "react";
import { IInitialChatProps } from "../interface/components/chat/chatInterface";
import messages from "../json/Messages.json";
const ChatContext = React.createContext({});

const initialState: IInitialChatProps = {
  messages: [],
  user: {},
};

const reducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
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
