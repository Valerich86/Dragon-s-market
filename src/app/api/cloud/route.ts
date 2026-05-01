import { NextResponse } from "next/server";
import { useCloudPath } from "@/lib/cloud";

export async function GET () {
  const cloudPath =  useCloudPath();
  return NextResponse.json({cloudPath: cloudPath});
}