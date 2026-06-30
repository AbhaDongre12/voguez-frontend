import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import type { CartItem } from "../types/cartitem";
import { userCartStore } from "../store/CartStore";
import { notify } from "../utils/notify";

export default function Checkout(){
    const [items,setItems]=useState<CartItem[]>([]);
    const [address,setAddress]=useState("");
    const [city,setCity]=useState("");
    const [postalCode,setPostalCode]=useState("");
    const [phoneNumber,setPhoneNumber]=useState("");
    const [loading,setLoading]=useState(false);

    const navigate=useNavigate();

    const fetchSavedAddress = async () => {
    try {
        const response = await api.get("/address");

        setAddress(response.data.street);
        setCity(response.data.city);
        setPostalCode(response.data.postalCode);
        setPhoneNumber(response.data.phoneNumber);
    }
    catch (error) {
        console.error(error);
    }
};

    useEffect(()=>{
        const fetchCart=async()=>{
            try{
                const response=await api.get("/cart");
                setItems(response.data);
            }catch(error){
                console.error(error);
            }
        };
        fetchCart();
        fetchSavedAddress();
    },[]);

    const total=items.reduce(
        (sum,item)=>sum+item.product.price*item.quantity,0
    );

    const setCount=userCartStore((state)=>state.setCount);

    const placeOrder=async()=>{
        if(!address.trim()){
            notify.warning("Address is required!");
            return;
        }
        if(!city.trim()){
            notify.warning("City is required");
            return;
        }
        if(!postalCode.trim()){
            notify.warning("Postal Code is required");
            return;
        }
        if(!phoneNumber.trim()){
            notify.warning("Phone number is required");
            return;
        }
        try{
            setLoading(true);
            const response=await api.post("/order",{
                address,
                city,
                postalCode,
                phoneNumber
            });
            notify.success(`Order placed successfully! (${response.data.orderCode})`);
            setCount(0);
            navigate("/order");
        }catch(error){
            console.error(error);
            notify.error("Failed to place order");
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            <div className="checkout-container">
                <div className="shipping-form">
                <h2>Shipping Information</h2>
                <input type="text" placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)}/>
                <br/>
                <input type="text" placeholder="City" value={city} onChange={(e)=>setCity(e.target.value)}/>
                <br/>
                <input type="text" placeholder="Postal Code" value={postalCode} onChange={(e)=>setPostalCode(e.target.value)}/>
                <br/>
                <br/>
                <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)}/>
                <br/>
                </div>
                <div className="order-recap">
                    <h2>Order Summary</h2>
                    {items.map((item)=>(
                        <p key={item.id}>
                            {item.product.name} x {item.quantity}
                        </p>
                    ))}<br/><br/>
                    <h3>Total: Rs. {total}</h3>
                    <p>Payment Method:<strong> Cash on Delivery</strong></p><br/>
                    <button className="btn-primary" onClick={placeOrder} disabled={loading}>
                        {loading?"Placing order...":"Place order"}
                    </button>
                </div>
            </div>
        </div>
    );
}