import { useState, useEffect } from "react";
import api from "../../services/api";
import type Order from "../../types/order";
import { notify } from "../../utils/notify";
import { usePagination } from "../../hooks/usePagination";
import AdminTablePagination from "../../components/AdminTablePagination";
export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/order");
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: number, status: number) => {
    try {
      await api.put(`/order/${id}/status`, { status });
      fetchOrders();
      notify.success("Order status updated");
    } catch (error) {
      console.error(error);
      notify.error("Failed to update order status");
    }
  };

  const pagination = usePagination(orders);

  return (    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Orders</h1>
      </div>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {pagination.paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-empty">No orders found</td>
              </tr>
            ) : (
              pagination.paginatedItems.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.name}</td>
                  <td>Rs. {order.totalAmount}</td>
                  <td>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, Number(e.target.value))}
                    >
                      <option value={0}>Pending</option>
                      <option value={1}>Processing</option>
                      <option value={2}>Shipped</option>
                      <option value={3}>Delivered</option>
                      <option value={4}>Cancelled</option>
                    </select>
                  </td>
                  <td>{new Date(order.createdDate).toLocaleDateString()}</td>
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
      </div>    </div>
  );
}
