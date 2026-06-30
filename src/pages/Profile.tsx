import { useEffect, useState } from "react";
import api from "../services/api";
import axios from "axios";
import Modal from "../components/Modal";
import Drawer from "../components/Drawer";

interface Profile {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Order {
  id: number;
  totalAmount: number;
}

interface CartItem {
  id: number;
  quantity: number;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [editingAddress, setEditingAddress] = useState(false);

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [editingPassword, setEditingPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const fetchAddress = async () => {
    try {
      const response = await api.get("/address");

      setStreet(response.data.street);
      setCity(response.data.city);
      setPostalCode(response.data.postalCode);
      setPhoneNumber(response.data.phoneNumber);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/me");
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get("/order/my-orders");
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await api.get("/cart");
      setCartItems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchOrders();
    fetchCartItems();
    fetchAddress();
  }, []);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [profile]);

  if (!profile) {
    return <div className="loading-state">Loading profile...</div>;
  }

  const totalOrders = orders.length;

  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const openEditProfile = () => {
    setName(profile.name);
    setEmail(profile.email);
    setEditing(true);
  };

  const closeEditProfile = () => {
    setName(profile.name);
    setEmail(profile.email);
    setEditing(false);
  };

  const openEditAddress = () => {
    setEditingAddress(true);
  };

  const closeEditAddress = () => {
    fetchAddress();
    setEditingAddress(false);
  };

  const updateProfile = async () => {
    try {
      await api.put("/profile", {
        name,
        email,
      });
      setProfile({
        ...profile,
        name,
        email,
      });
      setEditing(false);
      setMessage("Profile updated successfully!");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const updateAddress = async () => {
    await api.put("/address", {
      street,
      city,
      postalCode,
      phoneNumber,
    });

    setEditingAddress(false);
  };

  const changePassword = async () => {
    try {
      const response = await api.put("/profile/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setPasswordMessage(response.data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setEditingPassword(false);
        setPasswordMessage("");
      }, 1500);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setPasswordMessage(
          err.response?.data?.message ?? "Unable to change password.",
        );
      } else {
        setPasswordMessage("Something went wrong.");
      }
    }
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <div className="profile-card">
        <div className="profile-avatar">
          {profile.name.charAt(0).toUpperCase()}
        </div>

        <div className="profile-details">
          <div className="profile-row">
            <span>Name</span>
            <p>{profile.name}</p>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <p>{profile.email}</p>
          </div>

          <div className="profile-row">
            <span>Role</span>
            <p>{profile.role}</p>
          </div>

          <div className="profile-row">
            <span>Member Since</span>
            <p>
              {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          {message && <p className="success-message">{message}</p>}
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-section">
          <h2>Shipping Information</h2>
          <p>
            <strong>Address:</strong>
          </p>
          <p>{street}</p>
          <p>{city}</p>
          <p>{postalCode}</p>
          <p>
            <strong>Phone Number:</strong> {phoneNumber}
          </p>
          <button className="btn-outline" onClick={openEditAddress}>
            Edit Address
          </button>
        </div>

        <div className="profile-section">
          <h2>Account Summary</h2>

          <div className="summary-row">
            <span>Orders</span>
            <strong>{totalOrders}</strong>
          </div>

          <div className="summary-row">
            <span>Cart Items</span>
            <strong>{totalCartItems}</strong>
          </div>

          <div className="summary-row">
            <span>Total Spent</span>
            <strong>Rs. {totalSpent}</strong>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn-outline" onClick={openEditProfile}>
          Edit Profile
        </button>

        <button className="btn-outline" onClick={() => setEditingPassword(true)}>
          Change Password
        </button>
      </div>

      <Modal
        open={editing}
        onClose={closeEditProfile}
        title="Edit Profile"
        footer={
          <>
            <button className="btn-outline" onClick={closeEditProfile}>
              Cancel
            </button>
            <button className="btn-primary" onClick={updateProfile}>
              Save Changes
            </button>
          </>
        }
      >
        <div className="form-group">
          <label htmlFor="profile-name">Name</label>
          <input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="profile-email">Email</label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </Modal>

      <Drawer
        open={editingAddress}
        onClose={closeEditAddress}
        title="Edit Address"
        footer={
          <>
            <button className="btn-outline" onClick={closeEditAddress}>
              Cancel
            </button>
            <button className="btn-primary" onClick={updateAddress}>
              Save Address
            </button>
          </>
        }
      >
        <div className="form-group">
          <label htmlFor="address-street">Street</label>
          <input
            id="address-street"
            type="text"
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address-city">City</label>
          <input
            id="address-city"
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address-postal">Postal Code</label>
          <input
            id="address-postal"
            type="text"
            placeholder="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address-phone">Phone Number</label>
          <input
            id="address-phone"
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </Drawer>

      {editingPassword && (
        <div
          className="modal-overlay"
          onClick={() => setEditingPassword(false)}
        >
          <div className="modal admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Change Password</h2>

            <div className="form-group">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {passwordMessage && (
              <p
                className={
                  passwordMessage.toLowerCase().includes("success")
                    ? "success-message"
                    : "error-message"
                }
              >
                {passwordMessage}
              </p>
            )}

            <div className="modal-buttons">
              <button
                className="btn-outline"
                onClick={() => setEditingPassword(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={changePassword}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
