"use server";

export default async function getBucketPublicUrl() {
  return process.env.BUCKET_URL;
}
