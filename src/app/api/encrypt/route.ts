import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";

import { Secret, sqlite } from "@/db/sqlite";
import { KEY, encrypt } from "@/lib/crypto";

const EncryptBodySchema = z.object({
  secret: z
    .string()
    .min(1, "Secret must contain at least 1 character(s)")
    .max(280, "Secret must contain less than 280 character(s)"),
});

export const POST = async (request: Request) => {
  const body = await request.json();

  const valid = EncryptBodySchema.safeParse(body);

  if (!valid.success) {
    return new Response(JSON.stringify(valid.error), { status: 400 });
  }

  const ciphertext = encrypt(valid.data.secret, KEY);

  const uuid = uuidv4();

  try {
    const result = await sqlite.batch([
      {
        sql: "insert into secrets values (:uuid, :secret) returning *",
        args: { uuid, secret: ciphertext },
      },
      {
        sql: "update counter set count = count + 1 where name = ?",
        args: ["generated"],
      },
    ]);

    const created = result[0].rows as unknown as Secret[];

    return NextResponse.json({
      uuid: created[0].uuid,
      encrypted: created[0].secret,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json({ err }, { status: 500 });
  }
};
