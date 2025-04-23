export type Category = {
    id?: number
    name: string
    parent?: Category | null
}
export type Collection = {
    id?: number
    name: string
    description: string
}
export type ProductSize = {
    id?: number
    size: string
    stock: number
    price: number
    sold: number
    discountPrice: number
    discountRate: number
    isDeleted: boolean
}
export type ImageResponse = {
    id?: number
    name: string
    url: string
    file?: File
}
export type ImageRequest = {
    file: File
}

export type AttributeValue = {
    attributeId?: number
    name: string
    value: string
}

export type ProductRequest = {
    id?: number
    title: string
    description?: string
    material?: string
    category?: Category
    collection?: Collection
    status: string
    attributes?: AttributeValue[]
    productSizes: ProductSize[]
    images?: ImageResponse[]
    createdAt: string
    updatedAt: string
}
export type ProductResponse = {
    id?: number
    title: string
    description?: string
    material?: string
    category?: Category
    collection?: Collection
    status: string
    attributes?: AttributeValue[]
    productSizes: AttributeValue[]
    images?: ImageResponse[]
    createdAt: string
    updatedAt: string
}
