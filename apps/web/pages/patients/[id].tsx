import { useRouter } from "next/router";
import React from "react";

export default function Patient() {
  const router = useRouter();
  const { id } = router.query;

  console.log("patient id", id);
  return <div className="text-red-600">About</div>;
}
