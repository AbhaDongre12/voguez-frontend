import { useState,useEffect } from "react";
import api from "../../services/api";
import type Order from "../../types/order";
import { usePagination } from "../../hooks/usePagination";
import AdminTablePagination from "../../components/AdminTablePagination";
interface DashboardStats{
  totalUsers:number;
  totalProducts:number;
  totalOrders:number;
  revenue:number;
}

export default function AdminDashboard(){
  const [stats,setStats]=useState<DashboardStats>({
    totalUsers:0,
    totalProducts:0,
    totalOrders:0,
    revenue:0
  });

  const fetchStats=async()=>{
    try{
      const response=await api.get("/dashboard/stats");
      setStats(response.data);
    }catch(error){
      console.error(error);
    }
  }

  const [orders,setOrders]=useState<Order[]>([]);

  const fetchOrders=async()=>{
    try{
      const response=await api.get("/order");
      setOrders(response.data.slice(0,5));
    }catch(error){
      console.error(error);
    }
  };

  const getStatusText=(status:number)=>{
    switch(status){
        case 0: return "Pending";
        case 1: return "Processing";
        case 2: return "Shipped";
        case 3: return "Delivered";
        case 4: return "Cancelled";
        default: return "Unknown";
    }
  };

  const getStatusClass=(status:number)=>{
    switch(status){
        case 0: return "status-badge status-badge--pending";
        case 1: return "status-badge status-badge--processing";
        case 2: return "status-badge status-badge--processing";
        case 3: return "status-badge status-badge--delivered";
        case 4: return "status-badge status-badge--cancelled";
        default: return "status-badge";
    }
  };

  useEffect(()=>{
    fetchStats();
    fetchOrders();
  },[]);

  const pagination = usePagination(orders);

  return (    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Dashboard</h1>
      </div>
      <div className="dashboard">
        <div className="card">
          <h3>Users</h3>
          <h2>{stats.totalUsers}</h2>
        </div>
        <div className="card">
          <h3>Products</h3>
          <h2>{stats.totalProducts}</h2>
        </div>
        <div className="card">
          <h3>Orders</h3>
          <h2>{stats.totalOrders}</h2>
        </div>
        <div className="card card--accent">
          <h3>Revenue</h3>
          <h2>Rs. {stats.revenue}</h2>
        </div>
      </div>
      <div className="admin-section">
        <h2>Recent Orders</h2>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="table-empty">No recent orders</td>
                </tr>
              ) : (
                pagination.paginatedItems.map(order=>(                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.name}</td>
                    <td>Rs. {order.totalAmount}</td>
                    <td>
                      <span className={getStatusClass(Number(order.status))}>
                        {getStatusText(Number(order.status))}
                      </span>
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
        </div>      </div>
    </div>
  );
}
