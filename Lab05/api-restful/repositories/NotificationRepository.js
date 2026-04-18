const BaseRepository = require("./BaseRepository");

class NotificationRepository extends BaseRepository {
  constructor() {
    super("notifications");
  }

  findByTicketId(ticketId) {
    const db = this._readDB();
    return db[this.entityName].filter((n) => n.ticketId === ticketId);
  }
}

module.exports = NotificationRepository;
