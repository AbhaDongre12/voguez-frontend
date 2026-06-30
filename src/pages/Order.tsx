import { useEffect,useState } from "react";
import api from "../services/api";

import type Order from "../types/order";
import { notify } from "../utils/notify";
import { useConfirm } from "../components/ConfirmDialog";

export default function Order(){
  const confirm = useConfirm();
  const [orders,setOrders]=useState<Order[]>([]);
  const [loading,setLoading]=useState(true);
  const [expandedOrder,setExpandedOrder]=useState<number|null>(null);
  const [filter,setFilter]=useState("All");

  useEffect(()=>{
    const fetchOrders=async()=>{
      try{
        const response=await api.get("/order/my-orders");
        setOrders(response.data);
      }catch(error){
        console.error(error);
      }finally{
        setLoading(false);
      }
    };
    fetchOrders();
  },[]);

  const toggleOrder=(orderId:number)=>{
    setExpandedOrder(expandedOrder===orderId?null:orderId);
  };

  if(loading){
    return <div className="loading-state">Loading orders...</div>
  }

  const filteredOrders=filter==="All"?orders:orders.filter((order)=>order.status===filter);

  const cancelOrder=async(id:number)=>{
    const confirmed = await confirm({
      title: "Cancel Order",
      message: "Are you sure you want to cancel this order?",
      confirmLabel: "Cancel Order",
      variant: "warning",
    });
    if (!confirmed) return;
    try{
      await api.put(`/order/${id}/cancel`);
      setOrders((prev)=>
        prev.map((order)=>
          order.id===id?{
            ...order,status:"Cancelled"
          }:order
        ));
      notify.success("Order cancelled successfully");
    }catch(error){
      console.error(error);
      notify.error("Failed to cancel order");
    }
  };

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <div className="filter-buttons">
        <button className={`btn-outline btn-sm${filter==="All"?" active":""}`} onClick={()=>setFilter("All")}>All</button>
        <button className={`btn-outline btn-sm${filter==="Pending"?" active":""}`} onClick={()=>setFilter("Pending")}>Pending</button>
        <button className={`btn-outline btn-sm${filter==="Delivered"?" active":""}`} onClick={()=>setFilter("Delivered")}>Delivered</button>
        <button className={`btn-outline btn-sm${filter==="Cancelled"?" active":""}`} onClick={()=>setFilter("Cancelled")}>Cancelled</button>
      </div>
      {orders.length===0?(
        <div className="empty-state"><p>No orders found.</p></div>
      ):(
        filteredOrders.map((order)=>(
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
            <h3>{order.orderCode}</h3>
            <p>Status: {order.status}</p>
            <p>
              Date: {""}
              {new Date(order.createdDate).toLocaleDateString()}
            </p>
            </div>
            <div className="order-total">
            <p>Total: Rs. {order.totalAmount}</p>
            </div>
            </div>
            <div className="order-actions">
            <button className="btn-outline btn-sm" onClick={()=>toggleOrder(order.id)}>
              {expandedOrder===order.id?"Hide Details":"View Details"}
            </button>
            {order.status==="Pending" && (
              <button className="btn-danger btn-sm" onClick={()=>cancelOrder(order.id)}>Cancel Order</button>
            )}
            </div>
            {expandedOrder===order.id && (
              <div className="order-items">
                <h4>Items</h4>
                {order.orderItems.map((item)=>(
                  <div key={item.id} className="order-item">
                    <img src={`/src/assets/images/products/${item.product.imageUrl}`} alt={item.product.name} width="80"/>
                    <div>                   
                    <p>{item.product.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: Rs. {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        ))
      )}
    </div>
  );
}