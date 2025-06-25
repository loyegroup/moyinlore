import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
});

const InvoiceSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['paid', 'unpaid', 'partially'], required: true },
    cashPayment: { type: Number, default: 0 },
    onlinePayment: { type: Number, default: 0 },
    amountPaid: { type: Number, required: true },
    amountOwed: { type: Number, required: true },
    items: [ItemSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
