import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  try {

    const users = await prisma.user.findMany({
      where: {
        name: {
          startsWith: query ? query : "",
          mode: "insensitive"
        },
      },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGES');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
