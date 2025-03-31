import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Button,
} from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const AdminDeleteRequests = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDeleteRequests();
    }, []);

    const fetchDeleteRequests = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${apiBaseUrl}/user/delete-requests`);
            const pendingRequests = response.data.filter((request) => request.status === 'pending');
            setRequests(pendingRequests);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error fetching deletion requests';
            toast.error(errorMessage);
            console.error('Error fetching delete requests:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (request) => {
        try {
<<<<<<< HEAD
            await axios.patch(`${apiBaseUrl}/user/delete-request/${request._id}`, {
                status: 'approved',
            });

            const deleteResponse = await axios.delete(`${apiBaseUrl}/user/delete/${request.userId._id}`);
            if (deleteResponse.data) {
                toast.success('User account deleted successfully');
                fetchDeleteRequests();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error approving and deleting account';
            toast.error(errorMessage);
            console.error('Error approving delete request:', err);
        }
    };
=======
          
          const response = await axios.patch(`${apiBaseUrl}/user/delete-request/${request._id}`, {
            status: 'approved',
          });
      
          if (response.data) {
            toast.success('Request approved and user deleted successfully');
            fetchDeleteRequests(); 
          }
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.message || 'Error approving and deleting account';
          toast.error(errorMessage);
          console.error('Error approving delete request:', err);
        }
      };
      
>>>>>>> 9d8938c (latest code pushed to git)

    const handleReject = async (requestId) => {
        try {
            const response = await axios.patch(`${apiBaseUrl}/user/delete-request/${requestId}`, {
                status: 'rejected',
            });
            if (response.data) {
                toast.success('Deletion request rejected successfully');
                fetchDeleteRequests();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error rejecting request';
            toast.error(errorMessage);
            console.error('Error rejecting delete request:', err);
        }
    };

    return (
        <React.Fragment>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Box
                sx={{
                    maxWidth: 1000,
                    mx: 'auto',
                    mt: 6,
                    p: 4,
                    borderRadius: 3,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fff',
                }}
            >
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: 'bold', color: '#231f20' }}
                >
                    Account Deletion Requests
                </Typography>
                <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 4 }}>
                    Review and manage pending account deletion requests from users.
                </Typography>

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress sx={{ color: '#231f20' }} size={40} />
                    </Box>
                ) : requests.length === 0 ? (
                    <Typography
                        align="center"
                        sx={{ py: 4, fontSize: '1.2rem', color: '#666' }}
                    >
                        No new requests
                    </Typography>
                ) : (
                    <TableContainer
                        component={Paper}
                        sx={{
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        <Table sx={{ minWidth: 650 }} aria-label="deletion requests table">
                            <TableHead>
                                <TableRow
                                    sx={{
                                        backgroundColor: '#f5f5f5',
                                        '& th': {
                                            fontWeight: 'bold',
                                            color: '#231f20',
                                            borderBottom: '2px solid #ddd',
                                            py: 2,
                                        },
                                    }}
                                >
                                    <TableCell>Sr No</TableCell> {/* Added Sr No column */}
                                    <TableCell>User</TableCell>
                                    <TableCell>Reason</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Requested At</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.map((request, index) => (
                                    <TableRow
                                        key={request._id}
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                                            '&:hover': { backgroundColor: '#f0f0f0' },
                                            '& td': { borderBottom: '1px solid #eee', py: 1.5 },
                                        }}
                                    >
                                        <TableCell>{index + 1}</TableCell> {/* Serial number starting from 1 */}
                                        <TableCell>
                                            {request.userId
                                                ? `${request.userId.firstName || ''} ${request.userId.lastName || ''} (${request.userId.email || ''})`
                                                : 'Unknown User'}
                                        </TableCell>
                                        <TableCell>{request.reason}</TableCell>
                                        <TableCell>{request.status}</TableCell>
                                        <TableCell>{new Date(request.requestedAt).toLocaleString()}</TableCell>
                                        <TableCell align="center">
                                            {request.status === 'pending' && (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => handleApprove(request)}
                                                        sx={{
                                                            mr: 1,
                                                            backgroundColor: '#231f20',
                                                            color: '#fff',
                                                            '&:hover': { backgroundColor: '#1a1718' },
                                                            textTransform: 'none',
                                                            px: 2,
                                                        }}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => handleReject(request._id)}
                                                        sx={{
                                                            backgroundColor: '#231f20',
                                                            color: '#fff',
                                                            '&:hover': { backgroundColor: '#1a1718' },
                                                            textTransform: 'none',
                                                            px: 2,
                                                        }}
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </React.Fragment>
    );
};

export default AdminDeleteRequests;