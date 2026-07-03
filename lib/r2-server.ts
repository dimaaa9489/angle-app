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

export function sanitizeR2Key(filename: string) {
  return `poses/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
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
  return { uploadUrl, publicUrl: `${publicUrl}/${key}`, key };
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
    })
  );

  return { publicUrl: `${publicUrl}/${key}`, key };
}
