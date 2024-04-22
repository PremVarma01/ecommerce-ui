import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        const body = await req.json()
        const { name } = body;
        console.log(name)
        if (!name) {
            return new NextResponse("Name is required", { status: 404 })
        }

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 404 })
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId
            },
            data: {
                name
            }
        })
        return NextResponse.json(store);

    } catch (error) {
        console.log("(STORE_PATCH)", error)
        return new NextResponse("Internal Server Error", { status: 503 })
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 404 })
        }

        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId
            },
        })

        return NextResponse.json(store);

    } catch (error) {
        console.log("(STORE_DELETE)", error)
        return new NextResponse("Internal Server Error", { status: 503 })
    }
}

