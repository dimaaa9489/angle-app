export type R2ConfigStatus = {
  configured: boolean;
  missing: string[];
};

export function getR2ConfigStatus(): R2ConfigStatus {
  const keys = [
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
    "R2_PUBLIC_URL",
  ] as const;

  const missing = keys.filter((key) => {
    const fallback = `NEXT_PUBLIC_${key}` as keyof NodeJS.ProcessEnv;
    return !process.env[key] && !process.env[fallback];
  });

  return {
    configured: missing.length === 0,
    missing: [...missing],
  };
}

function env(name: string, fallback?: string): string {
  const value = process.env[name] ?? (fallback ? process.env[fallback] : undefined);
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

export function getR2Config() {
  return {
    accountId: env("R2_ACCOUNT_ID", "NEXT_PUBLIC_R2_ACCOUNT_ID"),
    accessKeyId: env("R2_ACCESS_KEY_ID", "NEXT_PUBLIC_R2_ACCESS_KEY_ID"),
    secretAccessKey: env("R2_SECRET_ACCESS_KEY", "NEXT_PUBLIC_R2_SECRET_ACCESS_KEY"),
    bucketName: env("R2_BUCKET_NAME", "NEXT_PUBLIC_R2_BUCKET_NAME"),
    publicUrl: env("R2_PUBLIC_URL", "NEXT_PUBLIC_R2_PUBLIC_URL").replace(/\/$/, ""),
  };
}
