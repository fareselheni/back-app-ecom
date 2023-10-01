import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  country: String,
  price: Number
});

export default mongoose.model('Pricing', pricingSchema);
