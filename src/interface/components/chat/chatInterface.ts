export interface IUserProps {
  userName: string;
  createdAt: string;
  image: IImage;
  _id: string;
  connectionId: string;
  messageId: string;
}

export interface IInitialChatProps {
  messages: IUserMessage[] | any;
  user: IUserProps | Object;
}

export interface IUserMessage {
  _id: string;
  messageId: string;
  connectionId: string;
  createdAt: Date;
  displayName: string;
  messages: IMessage[];
  sentBy: string;
  sentTo: string;
}

export interface IMessage {
  sentBy: string;
  text: string;
  updatedAt: string;
  image?: IImage;
}

interface IImage {
  name: string;
  size: number;
  data: string;
  type: string;
}

export interface TypingStatus {
  connectionId?: string;
  firstName?: string;
  id?: string;
  isTyping?: boolean;
}

export interface CallerInfo {
  connectionId?: string;
  receiver_id?: string;
  caller_id?: string;
  name?: string;
  image?: string;
}
