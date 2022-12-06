export interface IUserProps {
  id: number;
  displayName: string;
  createdAt: string;
  image: string;
  message: string;
  active: boolean;
  lastMessage: string;
}

export interface IInitialChatProps {
  messages: IUserMessage[] | any;
  user: IUserProps | Object;
}

export interface IUserMessage {
  id: string;
  displayName: string;
  createdAt: string;
  sender: boolean;
  message: string;
}
