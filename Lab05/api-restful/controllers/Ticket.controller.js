const TicketService = require("../services/TicketService");
const NotificationService = require("../services/NotificationService");
const service = new TicketService();
const notificationService = new NotificationService();

exports.create = (req, res) => {
  const ticket = service.createTicket(req.body);
  res.status(201).json(ticket);
};

exports.list = (req, res) => {
  const { page, limit } = req.query;
  res.status(200).json(service.list(page, limit));
};

exports.assign = (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  const ticket = service.assignTicket(id, user);
  if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });
  res.status(200).json(ticket);
};

exports.changeStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const ticket = service.changeStatus(id, status);
  if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });
  res.status(200).json(ticket);
};

exports.delete = (req, res) => {
  try {
    service.deleteTicket(req.params.id);
    res.json({ message: "Ticket eliminado correctamente" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.listNotifications = (req, res) => {
  const { id } = req.params;
  const notifications = notificationService.listByTicket(id);
  res.status(200).json(notifications);
};
