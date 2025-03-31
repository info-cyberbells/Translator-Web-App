// src/components/ChildComponent.js

import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { TextField, Button, Box, Typography } from "@mui/material";

function ChildComponent({ user = null, onCancel = null, onSave = null }) {
  const { createUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = () => {
    console.log("handleSubmit called"); // Function Invocation

    if (user) {
      // Editing an existing user
      console.log("Editing user:", user);
      const updatedUser = { ...user, ...formData };
      console.log("Updated user data:", updatedUser); // Data Being Sent
      onSave(updatedUser);
      console.log("onSave called with:", updatedUser); // After Operation
    } else {
      // Creating a new user
      console.log("Creating new user with data:", formData);
      createUser(formData);
      console.log("createUser called with:", formData); // After Operation
      setFormData({ name: "", email: "", phone: "" });
      console.log("Form data reset:", { name: "", email: "", phone: "" });
    }
  };

  return (
    <Box sx={{ mt: 4, p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        {user ? "Edit User" : "Add New User"}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          fullWidth
        />
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {user ? "Save Changes" : "Add User"}
          </Button>
          {user && (
            <Button variant="outlined" color="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ChildComponent;
