import whatsappService from './whatsappService.js';

class MessageHandler {
  async handleIncomingMessage(message, senderInfo) {
    if (message?.type === 'text') {

      const incomingMessageIsGreeting = message.text.body.toLowerCase().trim();

      if (this.isGreetingMessage(incomingMessageIsGreeting)) {
        await this.sendWelcomeMessage(message.from, message.id, senderInfo);
        await this.sendWelcomeMenu(message.from);
      } else {
        const response = `Echo: ${message.text.body}`;
        await whatsappService.sendMessage(message.from, response, message.id);
      }
      await whatsappService.markAsRead(message.id);
    }
  }

  isGreetingMessage(message) {
    const greetings = ['hola', 'Hola', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'good night'];
    return greetings.includes(message.toLowerCase());
  }

  getSenderName(senderInfo) {
    return senderInfo.profile?.name || senderInfo.wa_id;
  }

  async sendWelcomeMessage(to, messageId, senderInfo) {
    const name = this.getSenderName(senderInfo);
    const welcomeMessage = `Bienvenido a nuestro servicio de Delivery de Fitoxpress, ${name}`;
    await whatsappService.sendMessage(to, welcomeMessage, messageId);
  }

  async sendWelcomeMenu(to) {
    const menuTitle = '¿En qué te podemos ayudar?';
    const menuButtons = [
      {
        type: 'reply',
        reply: { id: 'option_1', title: 'Agendar' }
      },
      {
        type: 'reply',
        reply: { id: 'option_2', title: 'Consutar' }
      },
      {
        type: 'reply',
        reply: { id: 'option_3', title: 'Ubicación' }
      },
    ];

    await whatsappService.sendInteractiveButton(to, menuTitle, menuButtons);
  }
}

export default new MessageHandler();