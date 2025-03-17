"use server";
import { v4 as uuidv4 } from "uuid";

export default async function genUuid() {
  const uuid = uuidv4();
  console.log(uuid);
  return uuid;
}
