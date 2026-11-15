import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return [
    { slug: "flags" }, { slug: "quran" }, { slug: "geography" },
    { slug: "science" }, { slug: "sports" }, { slug: "literature" },
    { slug: "movies" }, { slug: "brands" }, { slug: "books" },
    { slug: "history" },
  ];
}

export default function Page() {
  return <ClientPage />;
}
