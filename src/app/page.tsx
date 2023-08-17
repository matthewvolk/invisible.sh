import { LockClosedIcon, RocketIcon } from "@radix-ui/react-icons";

import { Badge } from "@/components/atomic/badge";
import { SecretForm } from "@/components/secret-form";
import { Counter, sqlite } from "@/db/sqlite";

const Home = async ({ searchParams }: { searchParams: { id: string } }) => {
  const result = await sqlite.execute({
    sql: "select count from counter where name = ?",
    args: ["generated"],
  });

  const total = result.rows as unknown as Counter[];

  return (
    <section>
      <div className="mt-12 justify-center text-center">
        <Badge variant="outline" className="text-muted-foreground">
          Secured with 256-bit AES-GCM encryption!
          <span className="ml-2">
            <LockClosedIcon />
          </span>
        </Badge>
        <h1 className="mx-auto max-w-5xl bg-gradient-to-b from-black to-neutral-800/80 bg-clip-text px-3 py-8 text-5xl font-extrabold tracking-[-0.035em] text-transparent dark:from-white dark:to-neutral-400/90 md:text-6xl lg:text-7xl lg:leading-[76px]">
          Self-destructing links made for sharing sensitive data
        </h1>
        <p className="mb-6 flex items-center justify-center text-sm font-medium text-muted-foreground">
          <span className="mr-2">
            <RocketIcon />
          </span>
          {new Intl.NumberFormat().format(total[0].count)} secrets generated
          securely!
        </p>
      </div>
      <SecretForm id={searchParams.id} />
      <div className="container mt-24 max-w-5xl text-center">
        <h1 className="bg-gradient-to-b from-black to-neutral-800/80 bg-clip-text px-3 py-8 text-4xl font-bold tracking-[-0.035em] text-transparent dark:from-white dark:to-neutral-400/90 md:text-5xl lg:text-6xl">
          Stop sending sensitive data in plain text.
        </h1>
        <p className="font-light leading-relaxed tracking-wide dark:text-neutral-400 md:text-lg lg:text-xl">
          In the world of remote work, sharing confidential data like passwords
          and API keys with colleagues poses a recurring challenge. Secure your
          data sharing by adopting a safer approach that safeguards against
          unauthorized access.
        </p>
        <p className="mt-8 font-light leading-relaxed tracking-wide dark:text-neutral-400 md:text-lg lg:text-xl">
          Sending sensitive information in plaintext via Slack or email creates
          exploitable attack vectors that can lead to security breaches within
          your organization. If a malicious actor obtains access to an inbox
          that you sent a password to, you risk security breaches that can add
          costs to your operations.
        </p>
      </div>
    </section>
  );
};

export default Home;
