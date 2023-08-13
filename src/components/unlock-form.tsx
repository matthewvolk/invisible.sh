"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/atomic/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atomic/form";
import { Input } from "@/components/atomic/input";
import { Text } from "@/components/atomic/textarea";
import { env } from "@/lib/env.mjs";

export const CopySecret = ({ secret }: { secret: string }) => {
  const [buttonText, setButtonText] = useState("Copy Secret");

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-2 md:gap-4 md:p-6">
      <Text value={secret} readOnly className="h-full px-4 py-3 text-lg" />
      <Button
        className="h-full w-36 py-2.5 text-lg"
        onClick={() => {
          navigator.clipboard.writeText(secret);
          setButtonText("Copied!");
        }}
      >
        {buttonText}
      </Button>
    </div>
  );
};

const UnlockFormSchema = z.object({
  link: z.string().min(1).max(280),
});

export const UnlockForm = ({ uuid }: { uuid: string }) => {
  const [secret, setSecret] = useState<string | null>(null);

  const SITE_URL =
    env.NEXT_PUBLIC_SITE_URL || `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

  const form = useForm<z.infer<typeof UnlockFormSchema>>({
    resolver: zodResolver(UnlockFormSchema),
    defaultValues: {
      link: `${SITE_URL}/${uuid}`,
    },
  });

  const onSubmit = async () => {
    const response = await fetch("/api/decrypt", {
      method: "POST",
      body: JSON.stringify({
        uuid,
      }),
    });

    const result = await response.json();

    setSecret(result.secret);
  };

  if (secret) {
    return <CopySecret secret={secret} />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-w-5xl flex-col items-center gap-8 rounded-lg border px-4 py-16 text-center md:mx-auto"
      >
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="sr-only">Secret URL</FormLabel>
              <FormControl>
                <Input
                  className="w-full border-0 text-center font-mono text-lg"
                  type="text"
                  {...field}
                  readOnly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="h-12 text-lg lg:w-1/4">
          Unlock
        </Button>
      </form>
    </Form>
  );
};
