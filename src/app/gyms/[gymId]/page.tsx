"use client";
import { useParams } from "next/navigation";


export default function Gym() {
  const params = useParams();
  const { gymId } = params;
  return (
    <div className="flex min-h-screen flex-col">


     <h1>GYM {gymId} PAGE</h1>
    </div>
  );
}
