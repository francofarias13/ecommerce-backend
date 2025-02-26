import { v4 as uuidv4 } from "uuid";
import TicketModel from "../models/TicketModel.js";

class TicketRepository {
  async createTicket({ amount, purchaser }) {
    return await TicketModel.create({
      code: uuidv4(), // Genera un código único
      amount,
      purchaser,
      purchase_datetime: new Date(),
    });
  }
}

export default new TicketRepository();
