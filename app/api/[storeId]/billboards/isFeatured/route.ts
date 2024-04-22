import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const billboard = await prismadb.billboard.findFirst({
            where: {
                isFeatured: true
            },
        })

        return NextResponse.json(billboard);

    } catch (error) {
        console.log("(BILLBOARD_GET)", error)
        return new NextResponse("Internal Server Error", { status: 503 })
    }
}

