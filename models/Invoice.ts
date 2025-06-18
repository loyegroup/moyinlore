// models/Invoice.ts
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
    items: [itemSchema],
    amountPaid: { type: Number, default: 0 },         // 💰 New
    amountOwed: { type: Number, required: true },     // 💸 New
  },
  { timestamps: true }
);

export default mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
