import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../services/firebase';
import AddProductDialog from '../components/AddProductDialog';
import { deleteProduct, editProduct, getAllProducts, searchProducts, type Product } from '../services/productService';
import { logout } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa";
import EditProductDialog from '../components/EditProductDialog';

const ProductListPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddProduct = (product: Product) => {
        setProducts((prev) => [...prev, product]);
        fetchProducts();
    };

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setKeyword(value);
        const results = await searchProducts(value);
        setProducts(results);
    };

    const handleDeleteProduct = async (docId: string) => {
        try {
            await deleteProduct(docId);
            setProducts((prev) => prev.filter((p) => p.docId !== docId));
        } catch (err) {
            alert("Failed to delete product.");
            console.error(err);
        }
    };

    const handleEditProduct = async (updated: Partial<Product>) => {
        if (!editingProduct?.docId) return;
        await editProduct(editingProduct.docId, updated);
        fetchProducts();
        setEditingProduct(null);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen">
            <header className="w-full bg-gradient-to-r from-indigo-600 to-indigo-300 h-28 flex flex-col justify-center px-4 sm:px-8 text-white">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Welcome</h1>
                {user && (
                    <p className="text-md sm:text-lg font-medium mt-1">{user.email}</p>
                )}
            </header>

            <main className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex items-center bg-white rounded-full shadow-md w-full md:max-w-xl">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={keyword}
                            onChange={handleSearch}
                            className="flex-grow px-4 py-2 rounded-full outline-none text-gray-700"
                        />
                        <button className="p-2 text-gray-500 hover:text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-semibold text-sm w-full flex justify-center items-center"
                            onClick={() => setShowModal(true)}>
                            <div className='flex items-center gap-2'>
                                <FaPlus /> New product
                            </div>
                        </button>
                        <button className="bg-white text-red-600 border-2 border-red-500 px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition font-semibold text-sm"
                            onClick={() => handleLogout()}>Logout</button>
                    </div>
                </div>

                {showModal && (
                    <AddProductDialog
                        existingProducts={products}
                        onAdd={handleAddProduct}
                        onClose={() => setShowModal(false)}
                        owner={user?.email ?? "unknown"}
                    />
                )}

                {editingProduct && (
                    <EditProductDialog
                        product={editingProduct}
                        onEdit={handleEditProduct}
                        onClose={() => setEditingProduct(null)}
                    />
                )}

                {loading ? (
                    <div className="flex justify-center items-center min-h-[300px]">
                        <p className="text-gray-500 text-lg animate-pulse">Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[300px]">
                        <p className="text-gray-500 text-lg">No products available.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {products.map((product) => (
                            <div
                                key={product.docId}
                                className="bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <p className="text-sm text-gray-500">Product ID: {product.productCode}</p>
                                    <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                                    <p className="text-blue-600 font-medium">Price: ฿{product.price.toFixed(2)}</p>
                                </div>
                                <div className="flex mt-4 sm:mt-0 space-x-2">
                                    <button className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 text-sm font-semibold"
                                        onClick={() => setEditingProduct(product)}>Edit</button>
                                    <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm font-semibold"
                                        onClick={() => handleDeleteProduct(product.docId!)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProductListPage;
