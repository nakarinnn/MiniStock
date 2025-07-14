import React, { useState } from 'react';
import type { Product } from '../services/productService';

type Props = {
    product: Product;
    onEdit: (updatedProduct: Partial<Product>) => void;
    onClose: () => void;
};

const EditProductDialog: React.FC<Props> = ({ product, onEdit, onClose }) => {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price.toString());

    const handleSubmit = () => {
        onEdit({
            name: name.trim(),
            price: Number(price),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 px-6 py-12 lg:px-8">
            <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-gray-900">Edit product</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Product name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900">Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 block w-full rounded-md border px-3 py-1.5 text-base text-gray-900 outline-none border-gray-300 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div className="mt-6 flex flex-col space-y-2">
                        <button
                            onClick={handleSubmit}
                            className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
                            Save
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-400">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProductDialog;