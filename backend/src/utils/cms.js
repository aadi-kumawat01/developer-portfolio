import mongoose from "mongoose";

export function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

export function isValidOrder(value) {
  return typeof value === "number" && Number.isFinite(value);
}

export async function getNextOrder(Model) {
  const lastItem = await Model.findOne().sort({ order: -1 }).select("order");
  return lastItem ? lastItem.order + 1 : 0;
}
