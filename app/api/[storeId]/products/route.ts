import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function POST(
    req: Request, { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, images, price, categoryId, colors, sizes, isFeatured, isArchived, productType } = body;
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

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400 })
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

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                categoryId,
                isArchived,
                isFeatured,
                productType,
                storeId: params.storeId,
                colors: {
                    connect: colors.map((colorId: string) => ({ id: colorId }))
                },
                sizes: {
                    connect: sizes.map((sizeId: string) => ({ id: sizeId }))
                },
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCT_POST', error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function GET(
    req: Request, { params }: { params: { storeId: string } }
) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get('categoryId') || undefined;
        const colorId = searchParams.get('colorId') || undefined;
        const sizeId = searchParams.get('sizeId') || undefined;
        const isFeatured = searchParams.get('isFeatured');

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400 })
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colors: {
                    some: {
                        id: colorId,
                    },
                },
                sizes: {
                    some: {
                        id: sizeId,
                    },
                },
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                colors: true,
                sizes: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products)
    } catch (error) {
        console.log('[PRODUCT_POST', error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
