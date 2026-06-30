import { useState,useEffect } from "react";
import api from "../../services/api";
import type User from "../../types/user";
import { usePagination } from "../../hooks/usePagination";
import AdminTablePagination from "../../components/AdminTablePagination";
export default function AdminUser(){
    const [users,setUsers]=useState<User[]>([]);

    const fetchUsers=async()=>{
        try{
            const response=await api.get("/user");
            setUsers(response.data);
        }catch(error){
            console.error(error);
        }
    };

    useEffect(()=>{
        fetchUsers();
    },[]);

    const pagination = usePagination(users);

    return(        <div className="admin-page">
            <div className="admin-page__header">
                <h1>Users</h1>
            </div>
            <div className="table-wrapper">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                    </tr>
                </thead>
                <tbody>
                    {pagination.paginatedItems.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="table-empty">No users found</td>
                        </tr>
                    ) : (
                    pagination.paginatedItems.map(user=>(
                        <tr key={user.id}>
                            <td>#{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <span className={`role-badge role-badge--${user.role.toLowerCase()}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
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
            </div>        </div>
    );
}
