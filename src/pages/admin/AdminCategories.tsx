import { useEffect,useState } from "react";
import api from "../../services/api";
import type Category  from "../../types/category";
import { useConfirm } from "../../components/ConfirmDialog";
import { notify } from "../../utils/notify";
import { usePagination } from "../../hooks/usePagination";
import AdminTablePagination from "../../components/AdminTablePagination";
export default function AdminCategories(){
    const confirm = useConfirm();
    const [categories,setCategories]=useState<Category[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState<"add" | "edit">("add");
    const [categoryForm, setCategoryForm] = useState({
        id: 0,
        name: "",
        imageUrl: ""
    });

    const fetchCategories=async()=>{
        try{
            const response=await api.get("/category");
            console.log(response.data);
            setCategories(response.data);
        }catch(error){
            console.error(error);
        }
    };
    useEffect(()=>{
        fetchCategories();
    },[]);

    const handleSave = async () => {
    try {
      if (mode === "add") {
        await api.post("/category", {
          ...categoryForm,
        });
      } else {
        await api.put(`/category/${categoryForm.id}`, {
          ...categoryForm
        });
      }
      fetchCategories();
      setShowModal(false);
      notify.success(mode === "add" ? "Category added successfully" : "Category updated successfully");
    } catch (error) {
      console.error(error);
      notify.error("Failed to save category");
    }
  };

    const deleteCategory=async(id:number)=>{
        const confirmed = await confirm({
            title: "Delete Category",
            message: "Are you sure you want to delete this category?",
            confirmLabel: "Delete",
            variant: "danger",
        });
        if (!confirmed) return;
        try{
            await api.delete(`category/${id}`);
            fetchCategories();
            notify.success("Category deleted successfully");
        }catch(error){
            console.error(error);
            notify.error("Failed to delete category");
        }
    };
    const pagination = usePagination(categories);
    
    return (        <div className="admin-page">
            <div className="admin-page__header">
            <h1>Categories</h1>
            <button
        className="btn-primary"
        onClick={() => {
          setMode("add");
          setCategoryForm({
            id: 0,
            name: "",
            imageUrl: ""
          });
          setShowModal(true);
        }}
      >
        + Add Category
      </button>
            </div>
            <div className="table-wrapper">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pagination.paginatedItems.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="table-empty">No categories found</td>
                        </tr>
                    ) : (
                    pagination.paginatedItems.map(category=>(                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td><img src={category.imageUrl} alt={category.name} width="80" height="80" style={{objectFit:"cover",borderRadius:"8px"}}/></td>
                            <td>
                                <div className="table-actions">
                                <button
                                    className="btn-outline btn-sm"
                                    onClick={() => {
                                        setMode("edit");
                                        setCategoryForm({
                                            id: category.id,
                                            name: category.name,
                                            imageUrl: category.imageUrl,
                                        });
                                        setShowModal(true);
                                    }}
                                    >
                                      Edit
                                </button>
                                <button className="btn-danger btn-sm" onClick={()=>deleteCategory(category.id)}>Delete</button>
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
            <h2>{mode === "add" ? "Add Category" : "Edit Category"}</h2>
            <div className="form-group">
            <input
              placeholder="Category Name"
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  name: e.target.value,
                })
              }
            />
            </div>
            <div className="form-group">
            <input
              placeholder="Category Image URL"
              value={categoryForm.imageUrl}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  imageUrl: e.target.value,
                })
              }
            />
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