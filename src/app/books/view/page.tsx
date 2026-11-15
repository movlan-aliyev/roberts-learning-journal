import { Suspense } from "react";
import ClientPage from "./ClientPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto p-8 text-center text-muted">Loading...</div>}>
      <ClientPage />
    </Suspense>
  );
}
