import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function env(name: string, fallback?: string): string {
  const value = process.env[name] ?? (fallback ? process.env[fallback] : undefined);
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

function getR2Config() {
  return {
    accountId: env("R2_ACCOUNT_ID", "NEXT_PUBLIC_R2_ACCOUNT_ID"),
    accessKeyId: env("R2_ACCESS_KEY_ID", "NEXT_PUBLIC_R2_ACCESS_KEY_ID"),
    secretAccessKey: env("R2_SECRET_ACCESS_KEY", "NEXT_PUBLIC_R2_SECRET_ACCESS_KEY"),
    bucketName: env("R2_BUCKET_NAME", "NEXT_PUBLIC_R2_BUCKET_NAME"),
    publicUrl: env("R2_PUBLIC_URL", "NEXT_PUBLIC_R2_PUBLIC_URL").replace(/\/$/, ""),
  };
}

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
