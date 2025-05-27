import { groq } from "next-sanity";

export const STARTUPS_QUERY = groq`
  *[_type == "startup" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    title,
    slug,
    author->{
      _id,
      name,
      image,
      bio
    },
    views,
    description,
    category,
    image,
    _createdAt
  }
`;
