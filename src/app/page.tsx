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
    <section className="flex-grow">
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
    </section>
  );
};

export default Home;
