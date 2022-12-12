export interface IUserProps {
  id: number;
  userName: string;
  createdAt: string;
  image: Image;
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
  id: string;
  displayName: string;
  createdAt: string;
  sender: boolean;
  message: string;
}
