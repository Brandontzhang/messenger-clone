import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    const users = await prisma.user.findMany({
      where: {
        name: {
          startsWith: query ? query : "",
        },
      },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGES');
    return new NextResponse('Internal Error', { status: 500 });
  }

}

