"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ClipboardIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button, buttonVariants } from "@/components/atomic/button";
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
import { cs } from "@/utils/cs";

export const CopyLink = ({ link }: { link: string }) => {
  const [buttonText, setButtonText] = useState("Copy Link");
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-2 md:gap-10 md:p-6">
      <Input
        value={link}
        readOnly
        className="h-full px-4 py-3 text-lg text-muted-foreground"
        onFocus={(e) => e.target.select()}
        ref={inputRef}
      />
      <Button
        className={cs(
          buttonVariants({ size: "lg" }),
          "px-4 text-base",
          buttonText === "Copied!" &&
            "text-white dark:bg-neutral-800 dark:hover:bg-neutral-800",
        )}
        onClick={() => {
          navigator.clipboard.writeText(link);
          setButtonText("Copied!");
          inputRef.current?.focus();
        }}
      >
        {buttonText === "Copy Link" && (
          <ClipboardIcon className="mr-2 h-5 w-5" />
        )}
        {buttonText === "Copied!" && <CheckIcon className="mr-2 h-6 w-6" />}
        {buttonText}
      </Button>
    </div>
  );
};

const SecretFormSchema = z.object({
  secret: z.string().min(1).max(280),
});

type SecretFormProps = {
  id: string | undefined;
};

export const SecretForm = ({ id }: SecretFormProps) => {
  const router = useRouter();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaElement = textareaRef.current;

  const form = useForm<z.infer<typeof SecretFormSchema>>({
    resolver: zodResolver(SecretFormSchema),
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof SecretFormSchema>) => {
      const response = await fetch("/api/encrypt", {
        method: "POST",
        body: JSON.stringify({ secret: data.secret }),
      });
      const { uuid } = await response.json();

      router.push(`/?success=true&id=${uuid}`);
      form.reset();
    },
    [form, router],
  );

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Enter" && event.metaKey) {
        form.handleSubmit(onSubmit)();
      }
    };

    if (textareaElement) {
      textareaElement.addEventListener("keydown", listener);
    }

    return () => {
      if (textareaElement) {
        textareaElement.removeEventListener("keydown", listener);
      }
    };
  }, [textareaElement, form, onSubmit]);

  const SITE_URL =
    env.NEXT_PUBLIC_SITE_URL || `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

  if (id) {
    return <CopyLink link={`${SITE_URL}/${decodeURIComponent(id)}`} />;
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto flex max-w-5xl flex-col gap-4 px-8"
        >
          <FormField
            control={form.control}
            name="secret"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Secret</FormLabel>
                <FormControl>
                  <Text
                    placeholder="Enter your secret here"
                    className={cs(
                      "resize-none p-4 font-mono md:text-lg",
                      Object.keys(form.formState.errors).length > 0 &&
                        "border-destructive placeholder:text-destructive",
                    )}
                    rows={9}
                    {...field}
                    ref={textareaRef}
                  />
                </FormControl>
                <div className="min-h-[20px]">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={
              Object.keys(form.formState.errors).length > 0 ||
              form.formState.isSubmitting
            }
            className={cs(
              buttonVariants({ size: "lg" }),
              "w-auto self-center text-base",
            )}
          >
            {form.formState.isSubmitting ? (
              <div className="flex animate-pulse items-center">
                <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />
                Encrypting...
              </div>
            ) : (
              "Generate Secret URL"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};
