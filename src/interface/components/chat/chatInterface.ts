export interface IUserProps {
  userName: string;
  createdAt: string;
  image: Image;
  _id: string;
  connectionId: string;
  messageId: string;
}

interface Image {
  name?: string;
  size?: number;
  data?: string;
  type?: string;
}

export interface IInitialChatProps {
  messages: IUserMessage[] | any;
  user: IUserProps | Object;
}

export interface IUserMessage {
  sentBy: string;
  displayName: string;
  createdAt: string;
  sender: boolean;
  message: string;
  image: Image;
}
