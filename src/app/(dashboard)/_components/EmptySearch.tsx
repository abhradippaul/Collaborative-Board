import Image from "next/image";

function EmptySearch() {
  return (
    <div className="min-h-[85dvh] flex flex-col items-center justify-center">
      <Image src="/logo.svg" alt="Empty" height={200} width={200} />
      <h2 className="text-2xl font-semibold mt-6">No results found!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Try searching for something else
      </p>
    </div>
  );
}

export default EmptySearch;
