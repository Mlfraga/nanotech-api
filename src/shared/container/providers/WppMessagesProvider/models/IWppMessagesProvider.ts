export default interface IWppMessagesProvider {
  sendMessage(body: string, recipients: string[]): Promise<void>;
}
