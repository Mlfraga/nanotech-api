import client from 'twilio';
import { MessageListInstance } from 'twilio/lib/rest/api/v2010/account/message';

import IWppMessagesProvider from '../models/IWppMessagesProvider';

class WppMessagesProvider implements IWppMessagesProvider {
  private messagesClient: MessageListInstance;

  constructor() {
    this.messagesClient = client().messages;
  }

  public async sendMessage(body: string, recipients: string[]): Promise<void> {
    for (const recipient of recipients) {
      await this.messagesClient.create({
        from: 'whatsapp:+14129618290',
        body,
        to: `whatsapp:${recipient}`,
      });
    }
  }
}

export default WppMessagesProvider;
