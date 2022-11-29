import { SET_USER } from "./../../constants/actions";
import React, { useReducer } from "react";
import { IInitialChatProps } from "../../interface/components/chat/chat";
import messages from "../../json/Messages.json";
const ChatContext = React.createContext({});

const initialState: IInitialChatProps = {
  messages: messages,
  user: {},
};

const reducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
  }
};

const ChatReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
};

export { ChatContext, ChatReducer };
