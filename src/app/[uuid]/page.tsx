import { UnlockForm } from "@/components/unlock-form";

const Unlock = ({ params: { uuid } }: { params: { uuid: string } }) => {
  return (
    <section className="container mx-auto flex-grow">
      <div className="mt-12 text-center">
        <h1 className="mx-auto max-w-5xl bg-gradient-to-b from-black to-neutral-800/80 bg-clip-text px-3 py-8 text-5xl font-extrabold tracking-[-0.035em] text-transparent dark:from-white dark:to-neutral-300/90 md:text-6xl lg:text-7xl lg:leading-[76px]">
          Someone sent you something secret
        </h1>
      </div>
      <UnlockForm uuid={uuid} />
    </section>
  );
};

export default Unlock;
