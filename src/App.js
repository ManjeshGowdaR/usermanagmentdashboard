import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const processUserData = (userData) => {
    return userData.map((user) => ({
      id: user.id,
      firstName: user.name.split(" ")[0],
      lastName: user.name.split(" ").slice(1).join(" "),
      email: user.email,
      department: user.company.name,
    }));
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      const processedUsers = processUserData(response.data);
      setUsers(processedUsers);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (users.some((user) => user.id === Number(formData.id) && !isEditing)) {
        throw new Error("ID must be unique.");
      }

      if (isEditing) {
        setUsers(
          users.map((user) =>
            user.id === editingId
              ? { ...user, ...formData, id: Number(formData.id) }
              : user
          )
        );
        setIsEditing(false);
        setEditingId(null);
      } else {
        const newUser = {
          ...formData,
          id: Number(formData.id),
        };
        setUsers([...users, newUser]);
      }

      setFormData({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        department: "",
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding/updating user:", error);
      setError(error.message || "Failed to add/update user. Please try again.");
      setIsLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setIsEditing(true);
    setEditingId(user.id);
    setFormData({
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      department: user.department,
    });
  };

  const handleDeleteUser = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      setUsers(users.filter((user) => user.id !== id));
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>User Management Dashboard</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleAddUser} className="user-form">
        <div className="form-grid">
          <input
            type="number"
            name="id"
            placeholder="ID"
            value={formData.id}
            onChange={handleInputChange}
            className="form-input"
            required
            disabled={isEditing}
          />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            className="form-input"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            className="form-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
            required
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isEditing ? "Update User" : "Add User"}
        </button>
      </form>

      {isLoading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-card-header">
              <h2>
                {user.firstName} {user.lastName}
              </h2>
              <span className="user-id">ID: {user.id}</span>
            </div>
            <div className="user-info">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Department:</strong> {user.department}
              </p>
            </div>
            <div className="user-actions">
              <button
                onClick={() => handleEditUser(user)}
                className="action-btn edit-btn"
                disabled={isLoading}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="action-btn delete-btn"
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
