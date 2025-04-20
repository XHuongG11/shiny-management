export type Category = {
    id: string
    name: string
    parent: Category
}
export type Collection = {
    id: string
    name: string
    description: string
}
export type ProductSizeResponse = {
    id: number
    size: string
    stock: number
    price: number
    sold: number
    discountPrice: number
    discountRate: number
    isDeleted: boolean
}
export type ImageResponse = {
    id: number
    name: string
    url: string
}

export type AttributeValueResponse = {
    attributeId: number
    name: string
    value: string
}

export type ProductResponse = {
    id: number
    title: string
    description: string
    material: string
    category: Category
    collection: Collection
    status: string
    attributes: AttributeValueResponse[]
    productSizes: ProductSizeResponse[]
    images: ImageResponse[]
    createdAt: string
    updatedAt: string
}
