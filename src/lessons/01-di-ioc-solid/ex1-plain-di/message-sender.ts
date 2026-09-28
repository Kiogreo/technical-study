export interface MessageSender {
  send(to: string, body: string): Promise<void>;
}
