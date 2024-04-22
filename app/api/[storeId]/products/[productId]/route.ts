import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(req: Request, { params }: { params: { productId: string } }) {
    try {
        if (!params.productId) {
            return new NextResponse("Product Id is required", { status: 404 })
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                sizes: true,
                colors: true
            }
        })

        return NextResponse.json(product);

    } catch (error) {
        console.log("(PRODUCT_GET)", error)
        return new NextResponse("Internal Server Error", { status: 503 })
    }
}


export async function PATCH(req: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {
        const { userId } = auth();
        const body = await req.json()
        const { name, images, price, categoryId, sizes, colors, isFeatured, productType, isArchived } = body;
        if (!userId) {
            return new NextResponse("Unautenticated", { status: 401 })
        }

        if (!name) {
            return new NextResponse("Name is Required", { status: 400 })
        }

        if (!images || !images.length) {
            return new NextResponse("Images are Required", { status: 400 })
        }

        if (!price) {
            return new NextResponse("Price URL is Required", { status: 400 })
        }

        if (!categoryId) {
            return new NextResponse("category ID is Required", { status: 400 })
        }

        if (!sizes || !sizes.length) {
            return new NextResponse("Size Id is Required", { status: 400 })
        }

        if (!colors || !colors.length) {
            return new NextResponse("Color Id is Required", { status: 400 })
        }

        if (!params.productId) {
            return new NextResponse("Product Id is required", { status: 404 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 400 })
        }



        const formattedColors = colors.map((colorId: string) => ({ "id": colorId }));
        const formattedSizes = sizes.map((sizeId: string) => ({ "id": sizeId }));


        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                productType,
                isArchived,
                isFeatured,
                sizes: {
                    set: formattedSizes,
                },
                colors: {
                    set: formattedColors,
                },
                images: {
                    deleteMany: {}
                }
            }
        })
        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [...images.map((image: { url: string }) => image)]
                    }
                }
            }
        })
        return NextResponse.json(product);

    } catch (error) {
        console.log("(PRODUCT_PATCH)", error)
        return new NextResponse("Internal Server Error", { status: 503 })
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!params.productId) {
            return new NextResponse("Product Id is required", { status: 404 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 400 })
        }


        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            },
        })

        return NextResponse.json(product);

    } catch (error) {
        console.log("(PRODUCT_DELETE)", error)
        return new NextResponse("Internal Server Error", { status: 503 })
    }
}



