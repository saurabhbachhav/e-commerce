import Image from "next/image";
import SearchForm from "../../components/SearchForm";
import { title } from "process";
import StartupCard from "../../components/StartupCard";
import { client } from "@/sanity/lib/client";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";

export default async function Home({ searchParams }: {
  searchParams:Promise<{query?:string}>
}) {

  const query = (await searchParams).query;
  const posts = await client.fetch(STARTUPS_QUERY);
  
  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Spark Your Savings, <br /> Shop with Confidence
        </h1>

        <p className="sub-heading !max-w-3xl">
          Discover amazing deals, explore top products, and enjoy effortless
          shopping with Spargen.
        </p>

        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupCardType, index: number) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>
    </>
  );
}
