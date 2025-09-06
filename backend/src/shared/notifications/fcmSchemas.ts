


interface INotificationPayload {
    title: string;
    body: string;
    imgUrl?: string;
  }

interface FcmMessage {
  notification: INotificationPayload;
  token: string;
  data?: { [key: string]: string }
}

interface FcmMessageTopic {
  topic: string;
  notification: INotificationPayload;
  data?: { [key: string]: string }
}
  
export type {INotificationPayload, FcmMessage, FcmMessageTopic};