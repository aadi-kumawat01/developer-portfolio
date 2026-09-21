import mongoose from "mongoose";

export function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

export function isValidOrder(value) {
  return typeof value === "number" && Number.isFinite(value);
}

export async function getNextOrder(Model, filter = {}) {
  const lastItem = await Model.findOne(filter).sort({ order: -1 }).select("order");
  return lastItem ? lastItem.order + 1 : 0;
}
