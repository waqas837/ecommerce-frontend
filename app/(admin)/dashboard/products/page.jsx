"use client";
import { apiUrl } from "@/lib/apiUrl";
import axios from "axios";
import React, { useState } from "react";

const Products = () => {
  // Sample product data - replace with your actual data source
  // Common units for grocery items
  const units = [
    "grams (g)",
    "kilograms (kg)",
    "ounces (oz)",
    "pounds (lb)",
    "milliliters (ml)",
    "liters (L)",
    "pieces (pcs)",
    "packets (pkt)",
  ];

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Rice",
      price: 5.99,
      quantity: 1000,
      unit: "grams (g)",
      category: "Grains",
      description: "Premium Basmati Rice",
    },
    {
      id: 2,
      name: "Sugar",
      price: 2.99,
      quantity: 500,
      unit: "grams (g)",
      category: "Baking",
      description: "Fine granulated sugar",
    },
  ]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    unit: units[0],
    category: "",
    description: "",
  });

  // Handle functions
  const handleAdd = async (e) => {
    try {
      e.preventDefault();
      let formdata = new FormData();
      formdata.append("title", newProduct.name);
      formdata.append("description", newProduct.description);
      formdata.append("category", newProduct.category);
      formdata.append("price", newProduct.price);
      formdata.append("quantity", newProduct.quantity);
      formdata.append("unit", newProduct.unit);
      formdata.append("image", newProduct.image);
      await axios.post(`${apiUrl}/admin/addProduct`, formdata);
      setProducts([...products, { ...newProduct, id: products.length + 1 }]);
      setNewProduct({
        name: "",
        price: "",
        quantity: "",
        unit: units[0],
        category: "",
        description: "",
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    setProducts(
      products.map((p) => (p.id === editProduct.id ? editProduct : p))
    );
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Grocery Management</h2>
        <button
          style={styles.addButton}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Units</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={styles.td}>{product.name}</td>
              <td style={styles.td}>${product.price}</td>
              <td style={styles.td}>{product.category}</td>
              <td style={styles.td}>{product.quantity}</td>
              <td style={styles.td}>{product.unit}</td>
              <td style={styles.td}>{product.description}</td>
              <td style={styles.td}>
                <button
                  style={{
                    ...styles.actionButton,
                    backgroundColor: "#ff69b4",
                    color: "white",
                  }}
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
                <button
                  style={{
                    ...styles.actionButton,
                    backgroundColor: "#ff4444",
                    color: "white",
                  }}
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div style={styles.modal}>
          <form style={styles.modalContent} onSubmit={handleAdd}>
            <h3>Add New Product</h3>
            <br />
            <div style={styles.formGroup}>
              <label>Name:</label>
              <input
                style={styles.input}
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Price:</label>
              <input
                style={styles.input}
                type="number"
                onChange={(e) =>
                  setEditProduct({ ...editProduct, price: e.target.value })
                }
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label>Quantity:</label>
              <input
                style={styles.input}
                type="number"
                onChange={(e) =>
                  setEditProduct({ ...newProduct, quantity: e.target.value })
                }
                required
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>Unit:</label>
              <select
                style={styles.input}
                className="w-full p-2 border rounded"
                value={editProduct.unit}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, unit: e.target.value })
                }
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Category:</label>
              <input
                style={styles.input}
                type="text"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Cateogry Image:</label>
              <input
                style={styles.input}
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.files[0] })
                }
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Description:</label>
              <textarea
                style={styles.input}
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                required
              />
            </div>
            <button style={styles.modalButton} type="submit">
              Add
            </button>
            <button
              style={{ ...styles.modalButton, backgroundColor: "#999" }}
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Edit Product</h3>
            <br />
            <div style={styles.formGroup}>
              <label>Name:</label>
              <input
                style={styles.input}
                type="text"
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label>Price:</label>
              <input
                style={styles.input}
                type="number"
                value={editProduct.price}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, price: e.target.value })
                }
              />
            </div>

            <div style={styles.formGroup}>
              <label>Quantity:</label>
              <input
                style={styles.input}
                type="number"
                value={editProduct.quantity}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, quantity: e.target.value })
                }
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label>Unit:</label>
              <select
                style={styles.input}
                className="w-full p-2 border rounded"
                value={editProduct.unit}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, unit: e.target.value })
                }
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Category:</label>
              <input
                style={styles.input}
                type="text"
                value={editProduct.category}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, category: e.target.value })
                }
              />
            </div>

            <div style={styles.formGroup}>
              <label>Cateogry Image:</label>
              <input
                style={styles.input}
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) =>
                  setEditProduct({ ...editProduct, image: e.target.files[0] })
                }
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label>Description:</label>
              <textarea
                style={styles.input}
                value={editProduct.description}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <button style={styles.modalButton} onClick={handleUpdate}>
              Update
            </button>
            <button
              style={{ ...styles.modalButton, backgroundColor: "#999" }}
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
// Styles
const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    paddingTop: 50,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  addButton: {
    backgroundColor: "#ff69b4",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    backgroundColor: "#ff69b4",
    color: "white",
    padding: "12px",
    textAlign: "left",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
  },
  actionButton: {
    marginRight: "10px",
    padding: "5px 10px",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  },
  modal: {
    paddingTop: "350px",
    paddingBottom: "100px",
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    overflowY: "scroll",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "5px",
    width: "400px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    border: "1px solid #ddd",
    borderRadius: "3px",
  },
  modalButton: {
    backgroundColor: "#ff69b4",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
};

export default Products;
