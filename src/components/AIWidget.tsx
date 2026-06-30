import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import api from "../services/api";
import "./AIWidget.css";

interface ChatMessage {
    type: "user" | "bot";
    text?: string;
    data?: unknown;
}

const QUICK_ACTIONS = [
    { label: "Last Order", message: "Show my last order" },
    { label: "Cart", message: "What's in my cart?" },
    { label: "Pending", message: "List pending orders" },
    { label: "All Orders", message: "List all orders" },
];

export default function AIWidget(){
    const [open,setOpen]=useState(false);
    const [input,setInput]=useState("");
    const [messages,setMessages]=useState<ChatMessage[]>([]);
    const [loading,setLoading]=useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, loading, open]);

    const sendMessage=async (text?:string)=>{
        const message=text||input;
        if(!message.trim()) return;

        setMessages(prev=>[...prev,{type:"user",text:message}]);
        setInput("");
        setLoading(true);

        try{
            const res=await api.post("/ai/query",{
                message
            });
            setMessages(prev=>[
                ...prev,
                {
                    type:"bot",
                    data:res.data
                }
            ]);
        }catch{
            setMessages(prev=>[
                ...prev,
                {
                    type:"bot",
                    text:"Something went wrong."
                }
            ]);
        }
        setLoading(false);
    };

    const renderResponse=(data:unknown)=>{
        if(typeof data==="string")
            return <p>{data}</p>

        if (typeof data !== "object" || data === null) {
            return <p>Unknown Response.</p>;
        }

        if("items" in data && "total" in data){
            const cart=data as{
                items: {
                    productName:string;
                    quantity:number;
                    price:number;
                }[];
                total:number;
            };

            return (
                <div className="ai-response-block">
                    <h4>Cart</h4>
                    {cart.items.map((item,index)=>(
                        <div key={index} className="ai-card">
                            <b>{item.productName}</b>
                            <span>Qty: {item.quantity}</span>
                            <span>Rs. {item.price}</span>
                        </div>
                    ))}
                    <p className="ai-total"><b>Total: Rs. {cart.total}</b></p>
                </div>
            );
        }

        if(
            "orderCode" in data &&
            "status" in data &&
            "totalAmount" in data
        ){
            const order=data as {
                orderCode:string;
                status: string;
                totalAmount: number;
            };
            return(
                <div className="ai-card">
                    <b>{order.orderCode}</b>
                    <span>Status: {order.status}</span>
                    <span>Total: Rs. {order.totalAmount}</span>
                </div>
            );
        }

        if(Array.isArray(data)){
            const orders=data as {
                id:number;
                orderCode: string;
                status: string;
                totalAmount:number;
            }[];
            return (
                <div className="ai-response-block">
                    {orders.map((order)=>(
                        <div key={order.id} className="ai-card">
                            <b>{order.orderCode}</b>
                            <span>Status: {order.status}</span>
                            <span>Rs. {order.totalAmount}</span>
                        </div>
                    ))}
                </div>
            );
        }

        if ("message" in data) {
            const response = data as {
                message: string;
            };
            return (
                <p>{response.message}</p>
            );
        }

        return (
            <pre className="ai-json">
                {JSON.stringify(data,null,2)}
            </pre>
        );
    };

    return (
        <div className="ai-widget">
            <button
                className="ai-button"
                onClick={()=>setOpen(!open)}
                aria-label={open ? "Close shopping assistant" : "Open shopping assistant"}
                aria-expanded={open}
            ><img src="/src/assets/images/chatbot-icon.avif" className="chatbot-icon"/>
                {open ? (
                    <X size={22} strokeWidth={2} aria-hidden="true" />
                ) : (
                    <MessageCircle size={24} strokeWidth={1.75} aria-hidden="true" />
                )}
            </button>

            {open && (
                <div className="ai-panel" role="dialog" aria-label="Shopping Assistant">
                    <header className="ai-header">
                        <div className="ai-header__info">
                            <span className="ai-header__badge">AI</span>
                            <div>
                                <h3>Shopping Assistant</h3>
                                <p>Ask about orders, cart & more</p>
                            </div>
                        </div>
                        <button
                            className="ai-header__close"
                            onClick={() => setOpen(false)}
                            aria-label="Close panel"
                        >
                            ↓
                        </button>
                    </header>

                    <div className="chips">
                        {QUICK_ACTIONS.map((action) => (
                            <button
                                key={action.label}
                                onClick={() => sendMessage(action.message)}
                                disabled={loading}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>

                    <div className="messages">
                        {messages.length === 0 && !loading && (
                            <div className="ai-empty">
                                <div className="ai-empty__icon" aria-hidden="true">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                    </svg>
                                </div>
                                <p>Hi! How can I help you today?</p>
                                <span>Try a quick action above or type a question.</span>
                            </div>
                        )}
                        {messages.map((m,i)=>(
                            <div key={i} className={`message-bubble ${m.type}`}>
                                {m.type==="user"
                                    ? m.text
                                    : renderResponse(m.data ?? m.text)
                                }
                            </div>
                        ))}
                        {loading && (
                            <div className="message-bubble bot ai-loading">
                                <span className="ai-dot" />
                                <span className="ai-dot" />
                                <span className="ai-dot" />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="input">
                        <input
                            value={input}
                            onChange={(e)=>setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && !loading && sendMessage()}
                            placeholder="Type your message..."
                            disabled={loading}
                            aria-label="Message input"
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={loading || !input.trim()}
                            aria-label="Send message"
                            className="ai-send"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
