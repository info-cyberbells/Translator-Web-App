// src/components/ResponsiveGrid.js

import React, { useContext, useState } from "react";
import { Grid, Typography, Box, IconButton, CircularProgress, Alert } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { UserContext } from "../../contexts/UserContext";
import ChildComponent from "../DailyDevotionals/DailyDevotional";

function ResponsiveGrid() {
  const { users, loading, error, deleteUser, updateUser } = useContext(UserContext);
  const [editingUser, setEditingUser] = useState(null); // To track which user is being edited

  // Handler to initiate editing
  const handleEdit = (user) => {
    setEditingUser(user);
  };

  // Handler to cancel editing
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  // Handler to save the edited user
  const handleSaveEdit = (updatedUser) => {
    updateUser(updatedUser.id, updatedUser);
    setEditingUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 5 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">Error fetching users!</Alert>}

      {!loading && !error && (
        <>
          <Grid container spacing={2}>
            {users.map((user) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={user.id}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "primary.light",
                    color: "black",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2">{user.email}</Typography>
                  <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                    <IconButton
                      aria-label="edit"
                      color="inherit"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      color="inherit"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* If a user is being edited, display the ChildComponent in edit mode */}
          {editingUser && (
            <ChildComponent
              user={editingUser}
              onCancel={handleCancelEdit}
              onSave={handleSaveEdit}
            />
          )}

          {/* Button to add a new user */}
          {!editingUser && (
            <ChildComponent />
          )}
        </>
      )}
    </Box>
  );
}

export default ResponsiveGrid;
