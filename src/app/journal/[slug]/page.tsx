import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return [
    { slug: "10-flags-southeast-asia" },
    { slug: "why-sky-is-blue-rayleigh-scattering" },
  ];
}

export default function Page() {
  return <ClientPage />;
}
