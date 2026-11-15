import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return [
    { slug: "driving" },
    { slug: "house" },
    { slug: "gardening" },
    { slug: "livestock" },
    { slug: "automotive" },
    { slug: "firearms" },
    { slug: "communication" },
  ];
}

export default function Page() {
  return <ClientPage />;
}
