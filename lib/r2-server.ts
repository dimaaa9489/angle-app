import { randomUUID } from "crypto";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getR2Config } from "@/lib/r2-config";

let client: S3Client | null = null;

export function getR2Client() {
  if (!client) {
    const { accountId, accessKeyId, secretAccessKey } = getR2Config();
    client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return client;
}

function r2PublicUrl(publicBase: string, key: string) {
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");
  return `${publicBase}/${encodedKey}`;
}

export function sanitizeR2Key(filename: string) {
  const ext = (filename.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const prefix = (process.env.R2_KEY_PREFIX ?? "poses").replace(/^\/+|\/+$/g, "");
  return `${prefix}/${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
}

export async function createPresignedUploadUrl(filename: string, contentType: string) {
  const { bucketName, publicUrl } = getR2Config();
  const key = sanitizeR2Key(filename);
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(getR2Client(), command, { expiresIn: 3600 });
  return { uploadUrl, publicUrl: r2PublicUrl(publicUrl, key), key };
}

export async function uploadBufferToR2(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<{ publicUrl: string; key: string }> {
  const { bucketName, publicUrl } = getR2Config();
  const key = sanitizeR2Key(filename);

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return { publicUrl: r2PublicUrl(publicUrl, key), key };
}
