import Link from "next/link";

import { SecretForm } from "@/components/secret-form";
import { ThemeToggle } from "@/components/theme-toggle";

const Home = ({ searchParams }: { searchParams: { id: string } }) => {
  return (
    <main className="mx-auto flex min-h-screen flex-col">
      <header className="container flex items-center justify-between p-4">
        <Link href="/" className="text-lg font-bold tracking-wide">
          Invisible.sh
        </Link>
        <ThemeToggle />
      </header>

      <section className="flex-grow">
        <div className="mt-12 text-center">
          <h1 className="mx-auto max-w-5xl bg-gradient-to-b from-black to-neutral-800/80 bg-clip-text px-3 py-8 text-5xl font-extrabold tracking-[-0.035em] text-transparent dark:from-white dark:to-neutral-300/90 md:text-6xl lg:text-7xl lg:leading-[76px]">
            Self-destructing links built for sharing sensitive data
          </h1>
        </div>
        <SecretForm id={searchParams.id} />
      </section>

      <footer className="mb-8 mt-24">
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()}, Invisible.sh
        </p>
      </footer>
    </main>
  );
};

export default Home;
