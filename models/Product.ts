import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  imageUrl: { type: String }, // assume hosted image URL or base64
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String },
  bundleWith: { type: Schema.Types.ObjectId, ref: 'Product', default: null }, // another product to add when this is added
  discountedPrice: { type: Number, default: null }, // price for 2 or more
  allowFractional: { type: Boolean, default: false }, // allow 0.5, 0.25
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
