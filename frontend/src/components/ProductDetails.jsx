import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProduct } from '../features/productsSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  if (loading) return <div className="text-center p-6 text-gray-500">Loading product details...</div>;
  if (error) return <div className="text-center p-6 text-red-500">Error: {error}</div>;
  if (!product) return <div className="text-center p-6 text-gray-500">Product not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Product Details</h2>
      <div className="mb-4">
        <strong>ID:</strong> {product.id}
      </div>
      <div className="mb-4">
        <strong>Name:</strong> {product.name}
      </div>
      <div className="mb-4">
        <strong>Price:</strong> ${product.price}
      </div>
      <div className="mb-4">
        <strong>Stock:</strong> {product.stock}
      </div>
      <div className="mt-6">
        <Link
          to="/products"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Back to Products
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;
