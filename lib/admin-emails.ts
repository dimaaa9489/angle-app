import { readFileSync } from "fs";
import { resolve } from "path";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase().replace(/^["'[\]]+|["'[\]]+$/g, "");
}

function readAdminEmailsFromEnvFile(): string | undefined {
  if (process.env.NODE_ENV === "production") return undefined;

  const paths = [".env.local", ".env"];
  for (const file of paths) {
    try {
      const content = readFileSync(resolve(process.cwd(), file), "utf8");
      for (const line of content.split(/\r?\n/)) {
        if (!line || line.startsWith("#")) continue;
        if (line.startsWith("ADMIN_EMAILS=")) {
          return line.slice("ADMIN_EMAILS=".length).trim();
        }
      }
    } catch {
      // try next file
    }
  }

  return undefined;
}

function getRawAdminEmails(): string {
  return (process.env.ADMIN_EMAILS ?? readAdminEmailsFromEnvFile() ?? "").trim();
}

/** Supports: a@b.com, c@d.com  |  JSON array  |  one email per line */
export function getAdminEmails(): string[] {
  const raw = getRawAdminEmails();
  if (!raw) return [];

  if (raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item): item is string => typeof item === "string")
          .map(normalizeEmail)
          .filter(Boolean);
      }
    } catch {
      // fall through to delimiter parsing
    }
  }

  return raw
    .split(/[,;\n]+/)
    .map(normalizeEmail)
    .filter((email) => email.includes("@"));
}

export function getAdminEmailsStatus() {
  const admins = getAdminEmails();
  return {
    configured: admins.length > 0,
    count: admins.length,
  };
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = getAdminEmails();
  if (!admins.length) return false;
  return admins.includes(email.trim().toLowerCase());
}
