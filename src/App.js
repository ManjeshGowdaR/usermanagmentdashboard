import React, { useState, useEffect } from "react";
// import axios from "axios"; // No longer needed for mock data
import "./styles.css";

const ORDER_STATUSES = ["All", "Pending", "Shipped", "Completed", "Cancelled"];

function App() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [formData, setFormData] = useState({
    orderId: "",
    customerName: "",
    orderDate: "",
    status: "",
    totalAmount: 0,
    itemCount: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const processOrderData = (orderData) => {
    // Assuming orderData is already in the correct format
    return orderData;
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Define mock sales order data
      const mockOrders = [
        { orderId: "SO001", customerName: "Alice Wonderland", orderDate: "2023-10-26", status: "Shipped", totalAmount: 150.00, itemCount: 3 },
        { orderId: "SO002", customerName: "Bob The Builder", orderDate: "2023-10-27", status: "Pending", totalAmount: 200.50, itemCount: 5 },
        { orderId: "SO003", customerName: "Charlie Brown", orderDate: "2023-10-28", status: "Completed", totalAmount: 75.20, itemCount: 2 },
        { orderId: "SO004", customerName: "Diana Prince", orderDate: "2023-10-29", status: "Cancelled", totalAmount: 120.00, itemCount: 1 }
      ];

      const processedOrders = processOrderData(mockOrders);
      setOrders(processedOrders);
      setIsLoading(false);
    } catch (error) {
      // This catch block might be less relevant for mock data but good for structure
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const orderData = {
        ...formData,
        totalAmount: parseFloat(formData.totalAmount),
        itemCount: parseInt(formData.itemCount, 10),
      };

      if (isEditing) {
        // ID uniqueness check is not needed when editing an existing order
        setOrders(
          orders.map((order) =>
            order.orderId === editingId
              ? { ...order, ...orderData } // orderData already has correct types
              : order
          )
        );
        setIsEditing(false);
        setEditingId(null);
      } else {
        // ID uniqueness check for new orders
        if (orders.some((order) => order.orderId === orderData.orderId)) {
          throw new Error("Order ID must be unique.");
        }
        const newOrder = { ...orderData }; // orderData already has correct types
        setOrders([...orders, newOrder]);
      }

      setFormData({
        orderId: "",
        customerName: "",
        orderDate: "",
        status: "",
        totalAmount: 0,
        itemCount: 0,
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding/updating order:", error);
      setError(error.message || "Failed to add/update order. Please try again.");
      setIsLoading(false);
    }
  };

  const handleEditOrder = (orderToEdit) => {
    setIsEditing(true);
    setEditingId(orderToEdit.orderId);
    setFormData({
      orderId: orderToEdit.orderId,
      customerName: orderToEdit.customerName,
      orderDate: orderToEdit.orderDate,
      status: orderToEdit.status,
      totalAmount: orderToEdit.totalAmount, // Already a number from mock/previous add
      itemCount: orderToEdit.itemCount,   // Already a number
    });
  };

  const handleDeleteOrder = async (orderIdToDelete) => {
    setIsLoading(true);
    setError(null);
    try {
      setOrders(orders.filter((order) => order.orderId !== orderIdToDelete));
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting order:", error);
      setError("Failed to delete order. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto p-4 md:p-6 lg:p-8 bg-gray-100 text-gray-800 min-h-screen">
      <header className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-6 md:p-8 rounded-lg shadow-xl mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">Sales Order Dashboard</h1>
      </header>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-md shadow-md mb-6 text-center">
          {error}
        </div>
      )}

      <div className="filter-container mb-6 p-4 bg-white shadow-lg rounded-lg">
        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          name="statusFilter"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md shadow-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {ORDER_STATUSES.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <form 
        onSubmit={handleAddOrder} 
        className="bg-white p-6 md:p-8 rounded-lg shadow-xl mb-6 md:mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          <input
            type="text"
            name="orderId"
            placeholder="Order ID"
            value={formData.orderId}
            onChange={handleInputChange}
            className="form-input w-full p-3 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
            disabled={isEditing}
          />
          <input
            type="text"
            name="customerName"
            placeholder="Customer Name"
            value={formData.customerName}
            onChange={handleInputChange}
            className="form-input w-full p-3 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
          <input
            type="date"
            name="orderDate"
            placeholder="Order Date"
            value={formData.orderDate}
            onChange={handleInputChange}
            className="form-input w-full p-3 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
          <input
            type="text"
            name="status"
            placeholder="Status"
            value={formData.status}
            onChange={handleInputChange}
            className="form-input w-full p-3 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
          <input
            type="number"
            name="totalAmount"
            placeholder="Total Amount"
            value={formData.totalAmount}
            onChange={handleInputChange}
            className="form-input w-full p-3 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <input
            type="number"
            name="itemCount"
            placeholder="Item Count"
            value={formData.itemCount}
            onChange={handleInputChange}
            className="form-input w-full p-3 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <button 
          type="submit" 
          className="submit-btn w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
          disabled={isLoading}
        >
          {isEditing ? "Update Order" : "Add Order"}
        </button>
      </form>

      {isLoading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="spinner border-4 border-t-4 border-t-teal-500 border-gray-200 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {orders
          .filter(order => statusFilter === "All" || order.status === statusFilter)
          .map((order) => (
          <div key={order.orderId} className="order-card bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 border border-gray-200">
            <div className="order-card-header bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-teal-700">{order.customerName}</h2>
              <span className="order-id text-sm font-medium text-teal-700 bg-teal-100 px-2 py-1 rounded-full">Order ID: {order.orderId}</span>
            </div>
            <div className="order-info p-4 space-y-2">
              <p className="text-gray-700"><strong className="font-medium text-gray-900">Order Date:</strong> {order.orderDate}</p>
              <p className="text-gray-700"><strong className="font-medium text-gray-900">Status:</strong> 
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold
                  ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : ''} 
                  ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : ''}
                  ${order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : ''}
                `}>
                  {order.status}
                </span>
              </p>
              <p className="text-gray-700"><strong className="font-medium text-gray-900">Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
              <p className="text-gray-700"><strong className="font-medium text-gray-900">Items:</strong> {order.itemCount}</p>
            </div>
            <div className="order-actions p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => handleEditOrder(order)}
                className="action-btn edit-btn bg-teal-400 hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                disabled={isLoading}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteOrder(order.orderId)}
                className="action-btn delete-btn bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
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
