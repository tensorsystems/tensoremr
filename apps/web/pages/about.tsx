import React from "react";

export default function About() {
  console.log("Test", process.env.NEXT_PUBLIC_APP_SERVER_URL);
  return <div className="text-red-600">About</div>;
}
