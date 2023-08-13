import { NextResponse } from "next/server";
import * as z from "zod";

import { type Secret, sqlite } from "@/db/sqlite";
import { KEY, decrypt } from "@/lib/crypto";

const EncryptBodySchema = z.object({
  uuid: z.string().min(1, "Secret must contain at least 1 character(s)"),
});

export const POST = async (request: Request) => {
  const body = await request.json();

  const valid = EncryptBodySchema.safeParse(body);

  if (!valid.success) {
    return new Response(JSON.stringify(valid.error), { status: 400 });
  }

  try {
    const result = await sqlite.execute({
      sql: "delete from secrets where uuid = ? returning *",
      args: [valid.data.uuid],
    });

    const deleted = result.rows as unknown as Secret[];

    const secret = decrypt(deleted[0].secret, KEY);

    return NextResponse.json({ secret });
  } catch (err) {
    console.error(err);

    return NextResponse.json({ err }, { status: 500 });
  }
};
