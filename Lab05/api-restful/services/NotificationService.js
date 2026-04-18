const { v4: uuidv4 } = require("uuid");
const NotificationRepository = require("../repositories/NotificationRepository");
const EmailService = require("./email/EmailService");

class NotificationService {
  constructor() {
    this.repo = new NotificationRepository();
    this.emailService = new EmailService();
  }

  async create(type, message, ticketId) {
    const notification = {
      id: uuidv4(),
      type,
      message,
      status: "pending",
      ticketId
    };

    console.log("Tipo de notificación:", type);
    if (type == "email") {
      console.log("ENTRANDO A ENVÍO DE EMAIL");
      await this.emailService.sendEmail(
        { from: process.env.MAILER_EMAIL,
          to: "alfredo.navarro@tecsup.edu.pe", 
          subject: "API RESTful - Alertas del sistema de Tickets", 
          htmlBody: "<h1>" + message +" </h1>" 
        });
    }

    return this.repo.save(notification);
  }


  list() {
    return this.repo.findAll();
  }

  listByTicket(ticketId) {
    return this.repo.findByTicketId(ticketId);
  }
}
module.exports = NotificationService;
