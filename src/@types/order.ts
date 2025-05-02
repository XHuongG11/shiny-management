// Định nghĩa kiểu Category
export type Category = {
    id?: number;
    name: string;
    parent?: Category | null;
};

// Định nghĩa kiểu Collection
export type Collection = {
    id?: number;
    name: string;
    description: string;
};

// Định nghĩa kiểu ProductSize
export type ProductSize = {
    id?: number;
    size: string;
    stock: number;
    price: number;
    sold: number;
    discountPrice: number;
    discountRate: number;
    isDeleted: boolean;
};

// Định nghĩa kiểu ImageResponse
export type ImageResponse = {
    id?: number;
    name: string;
    url: string;
    file?: File;
};

// Định nghĩa kiểu ImageRequest
export type ImageRequest = {
    file: File;
};

// Định nghĩa kiểu AttributeValue
export type AttributeValue = {
    attributeId?: number;
    name: string;
    value: string;
};

// Định nghĩa kiểu Product
export type Product = {
    id?: number;
    title: string;
    description?: string;
    material?: string;
    category?: Category;
    collection?: Collection;
    status: string;
    attributes?: AttributeValue[];
    productSizes: ProductSize[];
    images?: ImageResponse[];
    createdAt: string;
    updatedAt?: string;
};

// Định nghĩa kiểu ShippingAddress
export type ShippingAddress = {
    id?: number;
    recipientName: string;
    recipientPhone: string;
    province: string;
    district: string;
    village: string;
    address: string;
    default: boolean;
};

// Định nghĩa kiểu ReturnItem
export type ReturnItem = {
    id?: number;
    quantity: number;
    reason: string;
    description?: string;
    proofImages: ImageResponse[];
};

// Định nghĩa kiểu OrderItem
export type OrderItem = {
    id?: number;
    product: Product;
    productSize: ProductSize;
    quantity: number;
    price: number;
    discountPrice: number;
    totalPrice: number;
    returnItem?: ReturnItem;
};

// Định nghĩa kiểu OrderRequest
export type OrderRequest = {
    id?: string;
    orderItems: OrderItem[];
    totalProductPrice: number;
    shippingAddress: ShippingAddress;
    shippingMethod: string;
    shippingFee: number;
    totalPrice: number;
    freeShipDiscount: number;
    promotionDiscount: number;
    paymentMethod: string;
    status: string;
    note?: string;
    orderDate: string;
    reviewed: boolean;
};

// Định nghĩa kiểu OrderResponse
export type OrderResponse = {
    id?: string;
    orderItems: OrderItem[];
    totalProductPrice: number;
    shippingAddress: ShippingAddress;
    shippingMethod: string;
    shippingFee: number;
    totalPrice: number;
    freeShipDiscount: number;
    promotionDiscount: number;
    paymentMethod: string;
    status: string;
    note?: string;
    orderDate: string;
    reviewed: boolean;
    createdAt?: string;
    updatedAt?: string;
};