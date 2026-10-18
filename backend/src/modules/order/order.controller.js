import { deleteOne } from "../../utils/handlers/factor.js";
import { cartModel } from "../../../DB/models/cart.model.js";
import { catchError } from "../../utils/catchError.js";
import { orderModel } from "../../../DB/models/order.model.js";
import { productModel } from "../../../DB/models/product.model.js";
import { AppError } from "../../utils/AppError.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// create Order
export const createCashOrder = catchError(async (req, res, next) => {
  let cart = await cartModel.findById(req.params.id);
  let totalPrice = cart.totalAfterDiscount
    ? cart.totalAfterDiscount
    : cart.totalPrice;
  let order = new orderModel({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice: totalPrice,
    shippingAddress: req.body.shippingAddress,
  });
  if (order) {
    let options = cart.cartItems.map((ele) => ({
      updateOne: {
        filter: { _id: ele.product },
        update: { $inc: { quantity: -ele.quantity, soldItems: ele.quantity } },
      },
    }));
    await productModel.bulkWrite(options);
    await order.save();
  }
  await cartModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Order created successfully", order });
});

// get order
export const getOrder = catchError(async (req, res, next) => {
  let order = await orderModel.findOne({ user: req.user._id });
  res.json({ message: "Order fetched successfully", order });
});

export const onlinePayment = catchError(async (req, res, next) => {
  if (!process.env.STRIPE_SECRET_KEY) return next(new AppError("Online payment is not configured (set STRIPE_SECRET_KEY)", 503));
  // use the logged-in user's cart; the frontend may not know the cart id yet
  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) return next(new AppError("Cart not found", 404));
  let totalPrice = cart.totalAfterDiscount
    ? cart.totalAfterDiscount
    : cart.totalPrice;

  let session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount_decimal: totalPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://google.com",
    cancel_url: "https://facebook.com",
    customer_email: req.user.email,
    client_reference_id: cart._id.toString(),
    metadata: req.body.shippingAddress,
  });
  res.json({ status: "success", message:"Done", session });
});
