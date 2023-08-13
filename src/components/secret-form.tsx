"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { cs } from "@/utils/cs";

export const CopyLink = ({ link }: { link: string }) => {
  const [buttonText, setButtonText] = useState("Copy Link");

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-2 md:flex-row md:gap-4 md:p-6">
      <Input value={link} readOnly className="h-full px-4 py-3 text-lg" />
      <Button
        className="h-full w-36 py-2.5 text-lg"
        onClick={() => {
          navigator.clipboard.writeText(link);
          setButtonText("Copied!");
        }}
      >
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
    (data: z.infer<typeof SecretFormSchema>) => {
      router.push(`/?success=true&id=${data.secret}`);
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

  if (id) {
    return (
      <CopyLink link={`http://localhost:3000/${decodeURIComponent(id)}`} />
    );
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto flex max-w-5xl flex-col space-y-6 px-8 md:space-y-10"
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mx-auto h-12 text-lg lg:w-1/4">
            Generate Secret URL
          </Button>
        </form>
      </Form>
    </>
  );
};
