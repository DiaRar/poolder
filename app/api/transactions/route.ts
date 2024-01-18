import { createClient } from "@/utils/supabase/server";
import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from "@/utils/transactions";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    // As we have no auth, I won't check for session
    const obj = await req.json();
    const { id } = obj as { id: string };
    deleteTransaction(id);
    return new NextResponse(
      JSON.stringify({
        status: "ok",
      }),
      { status: 200 }
    );
  } catch (e) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: e,
      }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const obj = await req.json();
    const { title, description, value, created_at } = obj as {
      title: string;
      description: string;
      value: number;
      created_at?: string;
    };
    const transaction = await addTransaction({
      title,
      description,
      value,
      created_at,
    });
    return new NextResponse(
      JSON.stringify({
        status: "ok",
        transaction,
      }),
      { status: 200 }
    );
  } catch (e) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: e,
      }),
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const obj = await req.json();
    const { title, description, value, created_at, id } = obj as {
      title: string;
      description: string;
      value: number;
      created_at: string;
      id: string;
    };
    await updateTransaction({
      title,
      description,
      value,
      created_at,
      id,
    });
    return new NextResponse(
      JSON.stringify({
        status: "ok",
      }),
      { status: 200 }
    );
  } catch (e) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: e,
      }),
      { status: 500 }
    );
  }
}
