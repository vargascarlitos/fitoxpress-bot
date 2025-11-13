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
    } else if (message?.type === 'interactive') {
      const option = message?.interactive?.button_reply?.title.toLowerCase();
      console.log(`opcion: ${option}`)
      await this.handleMenuOption(message.from, option, message.id);
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
        reply: { id: 'option_2', title: 'Consultar' }
      },
      {
        type: 'reply',
        reply: { id: 'option_3', title: 'Ubicación' }
      },
    ];

    await whatsappService.sendInteractiveButton(to, menuTitle, menuButtons);
  }


  async handleMenuOption(to, option, messageId) {
    let response;
    switch (option) {
      case 'agendar':
        response = 'Vamos a agendar una cita. Aquí está el flujo...';
        break;

      case 'consultar':
        response = 'Realiza tu consulta ahora.';
        break;

      case 'ubicacion':
        response = 'Esta es nuestra ubicación.';
        break;

      default:
        response = 'Lo siento, no entendí tu selección. Por favor, elige una de las opciones del menú.';
        break;
    }
    await whatsappService.sendMessage(to, response, messageId);
  }
}

export default new MessageHandler();