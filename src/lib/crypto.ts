import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

import { env } from "@/lib/env.mjs";

const ALG = "aes-256-gcm";

export const KEY = Buffer.from(env.ENC_KEY, "base64");

export const encrypt = (secret: string, key: Buffer) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALG, key, iv);
  const enc = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);

  return [enc, iv, cipher.getAuthTag()]
    .map((e) => e.toString("base64"))
    .join("~");
};

export const decrypt = (ciphertext: string, key: Buffer) => {
  const [enc, iv, authTag] = ciphertext
    .split("~")
    .map((e) => Buffer.from(e, "base64"));
  const decipher = createDecipheriv(ALG, key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([
    decipher.update(enc as unknown as string, "utf8"),
    decipher.final(),
  ]).toString();
};
