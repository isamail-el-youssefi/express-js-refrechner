import bcrypt from "bcrypt";

export const hashedPassword = async (password) =>
  await bcrypt.hash(password, 10);
