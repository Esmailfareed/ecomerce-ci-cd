import "dotenv/config";
import mongoose from "mongoose";
import slugify from "slugify";
import path from "path";
import { fileURLToPath } from "url";
import data from "./seed-data.js";
import { userModel } from "./models/user.model.js";
import { categoryModel } from "./models/category.model.js";
import { subCategoryModel } from "./models/subCategory.model.js";
import { productModel } from "./models/product.model.js";
import { cartModel } from "./models/cart.model.js";

// Demo accounts (passwords match the frontend's login validation)
const USERS = [
  { name: "Admin", email: "admin@shop.com", password: "Admin123", phone: "01000000000", role: "admin", verified: true },
  { name: "Demo User", email: "user@shop.com", password: "User1234", phone: "01111111111", verified: true },
];

const slug = (s) => slugify(s, { lower: true, strict: true });

// Runs on every server start; only seeds an empty catalog unless force is set.
// ponytail: two replicas booting at once can race; the unique category name makes the loser fail and log, which is harmless.
export async function seed({ force = false } = {}) {
  if (!force && (await productModel.exists({}))) return;

  await Promise.all([productModel, categoryModel, subCategoryModel, cartModel].map((m) => m.deleteMany({})));

  for (const u of USERS) {
    // create() (not insertMany) so the password-hashing pre("save") hook runs
    if (!(await userModel.exists({ email: u.email }))) await userModel.create(u);
  }
  const admin = await userModel.findOne({ email: USERS[0].email });

  for (const { name, image, products } of data) {
    const category = await categoryModel.create({ name, slug: slug(name), image });
    const subCategory = await subCategoryModel.create({ name, slug: slug(name), image });
    await productModel.insertMany(
      products.map((p) => ({
        ...p,
        slug: slug(p.title),
        quantity: p.stock,
        category: category._id,
        subCategory: subCategory._id,
        createdBy: admin._id,
        updatedBy: admin._id,
      }))
    );
  }
  console.log(`Seeded ${data.length} categories, ${data.reduce((n, c) => n + c.products.length, 0)} products`);
}

// `npm run seed` — wipe catalog + carts and reseed
if (process.argv[1] && path.resolve(process.argv[1]) ===fileURLToPath(import.meta.url)) {
  await mongoose.connect(process.env.DB_ONLINE || "mongodb://127.0.0.1:27017/ecommerce");
  await seed({ force: true });
  await mongoose.disconnect();
}
