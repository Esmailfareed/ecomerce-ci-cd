import { deleteOne } from "../../utils/handlers/factor.js";
import { cartModel } from "../../../DB/models/cart.model.js";
import { catchError } from "../../utils/catchError.js";
import { AppError } from "../../utils/AppError.js";
import { productModel } from "../../../DB/models/product.model.js";


function calculateTotalPrice(cart) {
  cart.totalPrice = cart.cartItems.reduce((sum, ele) => sum + ele.price * ele.quantity, 0);
}

// every cart response has the same shape the frontend reads
async function sendCart(res, cart, message) {
  if (cart) await cart.populate("cartItems.product", "title imageCover");
  res.json({ status: "success", message, numOfCartItems: cart?.cartItems.length || 0, data: cart });
}

// add product to cart (creates the cart if needed)
export const addCart = catchError(async (req, res, next) => {
  let product = await productModel.findById(req.body.productId).select("price");
  if (!product) return next(new AppError("Product Not Found", 404));

  let cart = await cartModel.findOne({ user: req.user._id }) || new cartModel({ user: req.user._id, cartItems: [] });
  let item = cart.cartItems.find((ele) => ele.product.equals(product._id));
  if (item) item.quantity += 1;
  else cart.cartItems.push({ product: product._id, price: product.price });

  calculateTotalPrice(cart);
  await cart.save();
  return sendCart(res, cart, "Product added to cart successfully");
});

// get cart
export const getCart = catchError(async (req, res, next) => {
  let cart = await cartModel.findOne({ user: req.user._id });
  return sendCart(res, cart, "here is your cart");
});

// delete item from cart
export const removeCartItem = catchError(async (req, res, next) => {
  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) return next(new AppError("Cart not found", 404));
  cart.cartItems = cart.cartItems.filter((ele) => !ele.product.equals(req.params.id));
  calculateTotalPrice(cart);
  await cart.save();
  return sendCart(res, cart, "item removed successfully");
});

// update item quantity (quantity < 1 removes it)
export const UpdateCart = catchError(async (req, res, next) => {
  let cart = await cartModel.findOne({ user: req.user._id });
  let item = cart?.cartItems.find((ele) => ele.product.equals(req.params.id));
  if (!item) return next(new AppError("Product Not Found in Cart", 404));

  let quantity = req.body.quantity * 1;
  if (quantity < 1) cart.cartItems.pull(item._id);
  else item.quantity = quantity;
  calculateTotalPrice(cart);
  await cart.save();
  return sendCart(res, cart, "Cart Updated Successfully");
});

// clear the logged-in user's cart
export const clearCart = catchError(async (req, res, next) => {
  await cartModel.findOneAndDelete({ user: req.user._id });
  return sendCart(res, null, "Cart cleared");
});

// delete Cart by id
export const deleteCart = deleteOne(cartModel);
