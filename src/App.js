import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Process user data to extract required fields
  const processUserData = (userData) => {
    return userData.map((user) => ({
      id: user.id,
      firstName: user.name.split(" ")[0],
      lastName: user.name.split(" ").slice(1).join(" "),
      email: user.email,
      department: user.company.name,
    }));
  };

  // Fetch Users
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

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add/Update User
  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditing) {
        // Update existing user
        setUsers(
          users.map((user) =>
            user.id === editingId ? { ...user, ...formData } : user
          )
        );
        setIsEditing(false);
        setEditingId(null);
      } else {
        // Add new user
        const newUser = {
          ...formData,
          id: users.length + 1,
        };
        setUsers([...users, newUser]);
      }

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        department: "",
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding/updating user:", error);
      setError("Failed to add/update user. Please try again.");
      setIsLoading(false);
    }
  };

  // Edit User
  const handleEditUser = (user) => {
    setIsEditing(true);
    setEditingId(user.id);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      department: user.department,
    });
  };

  // Delete User
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
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>User Management Dashboard</h1>
      </div>

      {/* Error Handling */}
      {error && <div className="error-message">{error}</div>}

      {/* User Form */}
      <form onSubmit={handleAddUser} className="user-form">
        <div className="form-grid">
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

      {/* Loading Spinner */}
      {isLoading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

      {/* User List */}
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
