import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, deleteProduct } from '../features/productsSlice'; // Implement similar to usersSlice
import ProductForm from '../components/ProductForm'; // Create ProductForm similar to UserForm
import '../styles/products.css';

const Products = () => {
  const { list, loading, error } = useSelector((state) => state.products);
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isFormVisible, setFormVisible] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchProducts());
    }
  }, [dispatch, loggedInUser]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormVisible(true);
  };

  const handleCreate = () => {
    setEditProduct(null); // Reset form for creating a new product
    setFormVisible(true);
  };

  if (!loggedInUser) {
    return <p>Please log in to view and manage products.</p>;
  }

  return (
    <div className="products-page">
      <div className="header">
        <h2>Products</h2>
        <button className="create-button" onClick={handleCreate}>Create Product</button>
      </div>

      {isFormVisible && (
        <ProductForm
          product={editProduct}
          onClose={() => setFormVisible(false)}
        />
      )}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : list.length === 0 ? (
        <p>No products available. Start by creating one.</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(product)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Products;
