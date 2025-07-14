// src/services/productService.ts
import { db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    Timestamp,
} from "firebase/firestore";

export interface Product {
    productCode: string;
    name: string;
    price: number;
    owner: string;
}

const productCollection = collection(db, "products");

export const addProduct = async (product: Product): Promise<void> => {
    const q = query(productCollection, where("productCode", "==", product.productCode));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) throw new Error("This product code has already been used.");

    await addDoc(productCollection, {
        ...product,
        createdAt: Timestamp.now(),
    });
};

export const getAllProducts = async (): Promise<Product[]> => {
    const snapshot = await getDocs(productCollection);
    return snapshot.docs.map((doc) => doc.data() as Product);
};

export const searchProducts = async (keyword: string): Promise<Product[]> => {
    const snapshot = await getDocs(productCollection);
    return snapshot.docs
        .map((doc) => doc.data() as Product)
        .filter(
            (p) =>
                p.productCode.toLowerCase().includes(keyword.toLowerCase()) ||
                p.name.toLowerCase().includes(keyword.toLowerCase())
        );
};

export const deleteProduct = async (productCode: string) => {

};

export const updateProduct = async (product: Product) => {

};