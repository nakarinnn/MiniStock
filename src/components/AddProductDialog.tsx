import React, { useState } from 'react';
import { addProduct, type Product } from '../services/productService';

type Props = {
  existingProducts: Product[];
  onAdd: (product: Product) => void;
  onClose: () => void;
  owner: string;
};

const AddProductDialog: React.FC<Props> = ({ onAdd, onClose, owner }) => {
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!productId.trim()) newErrors.id = 'Product ID is required';
    if (!productName.trim()) newErrors.name = 'Product name is required';
    if (!price || isNaN(Number(price))) newErrors.price = 'Valid price is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const newProduct: Product = {
      productCode: productId.trim(),
      name: productName.trim(),
      price: Number(price),
      owner,
    };

    try {
      setLoading(true);
      await addProduct(newProduct);
      onAdd(newProduct);
      onClose();
    } catch (err: any) {
      if (err.message.includes("This product code has already been used.")) {
        setErrors({ id: err.message });
      } else {
        alert("Failed to add product.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 px-6 py-12 lg:px-8">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-gray-900">Add new product</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900">Product ID</label>
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-1.5 text-base text-gray-900 outline-none border-gray-300 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.id && <p className="text-red-600 text-sm mt-1">{errors.id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Product name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-1.5 text-base text-gray-900 outline-none border-gray-300 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-1.5 text-base text-gray-900 outline-none border-gray-300 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
          </div>

          <div className="mt-6 flex flex-col space-y-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add product"}
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductDialog;
