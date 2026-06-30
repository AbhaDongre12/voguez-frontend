import { useEffect, useState } from "react";
import api from "../../services/api";
import type Product from "../../types/product";
import type Category from "../../types/category";
import { useConfirm } from "../../components/ConfirmDialog";
import { notify } from "../../utils/notify";
import { usePagination } from "../../hooks/usePagination";
import AdminTablePagination from "../../components/AdminTablePagination";
export default function AdminProducts() {
  const confirm = useConfirm();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/product");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/category");
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [productForm, setProductForm] = useState({
    id: 0,
    name: "",
    description: "",
    price: "",
    quantity: "",
    imageUrl: "",
    categoryId: 0,
  });

  const deleteProduct = async (id: number) => {
    const confirmed = await confirm({
      title: "Delete Product",
      message: "Are you sure you want to delete this product? This action cannot be undone.",
      confirmLabel: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      await api.delete(`product/${id}`);
      fetchProducts();
      notify.success("Product deleted successfully");
    } catch (error) {
      console.error(error);
      notify.error("Failed to delete product");
    }
  };

  const handleSave = async () => {
    try {
      if (mode === "add") {
        await api.post("/product", {
          ...productForm,
          price: Number(productForm.price),
          quantity: Number(productForm.quantity),
        });
      } else {
        await api.put(`/product/${productForm.id}`, {
          ...productForm,
          price: Number(productForm.price),
          quantity: Number(productForm.quantity),
        });
      }
      fetchProducts();
      setShowModal(false);
      notify.success(mode === "add" ? "Product added successfully" : "Product updated successfully");
    } catch (error) {
      console.error(error);
      notify.error("Failed to save product");
    }
  };

  const pagination = usePagination(products);

  return (    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Products</h1>
        <button
          className="btn-primary"
          onClick={() => {
          setMode("add");
          setProductForm({
            id: 0,
            name: "",
            description: "",
            price: "",
            quantity: "",
            imageUrl: "",
            categoryId: 0,
          });
          setShowModal(true);
        }}
      >
        + Add Product
        </button>
      </div>
      <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Image</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pagination.paginatedItems.length === 0 ? (
            <tr>
              <td colSpan={7} className="table-empty">No products found</td>
            </tr>
          ) : (
          pagination.paginatedItems.map((product) => (            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>
              <td>
                <img
                  src={`/src/assets/images/products/${product.imageUrl}`}
                  alt={product.name}
                  width="80"
                  height="80"
                  style={{ objectFit: "cover", borderRadius: "8px" }}
                />
              </td>
              <td>{product.category?.name}</td>
              <td>
                <div className="table-actions">
                <button
                  className="btn-outline btn-sm"
                  onClick={() => {
                    setMode("edit");
                    setProductForm({
                      id: product.id,
                      name: product.name,
                      description: product.description,
                      price: product.price.toString(),
                      quantity: product.quantity.toString(),
                      imageUrl: product.imageUrl,
                      categoryId: product.categoryId,
                    });
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
                <button className="btn-danger btn-sm" onClick={() => deleteProduct(product.id)}>
                  Delete
                </button>
                </div>
              </td>
            </tr>
          ))
          )}
        </tbody>
      </table>
      <AdminTablePagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        rowsPerPage={pagination.rowsPerPage}
        rowsOptions={pagination.rowsOptions}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        total={pagination.total}
        onPageChange={pagination.setPage}
        onRowsPerPageChange={pagination.setRowsPerPage}
      />
      </div>      {showModal && (
        <div className="modal-overlay">
          <div className="modal admin-modal">
            <h2>{mode === "add" ? "Add Product" : "Edit Product"}</h2>
            <div className="form-group">
            <input
              placeholder="Product Name"
              value={productForm.name}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  name: e.target.value,
                })
              }
            />
            </div>
            <div className="form-group">
            <input
              placeholder="Product Description"
              value={productForm.description}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  description: e.target.value,
                })
              }
            />
            </div>
            <div className="form-group">
            <input
              placeholder="Product Price"
              value={productForm.price}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  price: e.target.value,
                })
              }
            />
            </div>
            <div className="form-group">
            <input
              placeholder="Product Quantity"
              value={productForm.quantity}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  quantity: e.target.value,
                })
              }
            />
            </div>
            <div className="form-group">
            <input
              placeholder="Product Image URL"
              value={productForm.imageUrl}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  imageUrl: e.target.value,
                })
              }
            />
            </div>
            <div className="form-group">
            <select
              value={productForm.categoryId}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  categoryId: Number(e.target.value),
                })
              }
            >
              <option value={0}>Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            </div>
            <div className="modal-buttons">
              <button className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
