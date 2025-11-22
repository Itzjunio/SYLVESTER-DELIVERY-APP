import mongoose from "mongoose";

export const isValidObjectId = (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid ID format.") as any;
    err.statusCode = 400;
    throw err;
  }
};
