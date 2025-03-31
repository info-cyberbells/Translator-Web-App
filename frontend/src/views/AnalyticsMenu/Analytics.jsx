import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  Table,
  Button,
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Stack,
  CircularProgress,
  TableContainer,
  Pagination,
  IconButton,
  Collapse,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const AnalyticsMenu = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoading, setIsLoading] = useState(true);
<<<<<<< HEAD
  const ITEMS_PER_PAGE = 5;
=======
  const ITEMS_PER_PAGE = 10;
>>>>>>> 9d8938c (latest code pushed to git)

  const [churches, setChurches] = useState([]);
  const [sermonData, setSermonData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [liveSessionsData, setLiveSessionsData] = useState([]);
  const [endedSessionsData, setEndedSessionsData] = useState([]);


  const [livePage, setLivePage] = useState(1);
  const [endedPage, setEndedPage] = useState(1);
  const [jesusPage, setJesusPage] = useState(1);


  const [expandedLiveSermons, setExpandedLiveSermons] = useState({});
  const [expandedEndedSermons, setExpandedEndedSermons] = useState({});
  const [jesusClickedUsers, setJesusClickedUsers] = useState([]);


  useEffect(() => {
    fetchChurches();
    fetchAllSermonsAndUsers();
    fetchJesusClickedUsers();
  }, []);


  const fetchJesusClickedUsers = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/listen/usersfetch`);
      console.log("Jesus Clicked Users API Response:", response.data);
      setJesusClickedUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching Jesus clicked users:", error);
      toast.error('Error fetching users who clicked Jesus');
    }
  };

  const fetchAllSermonsAndUsers = async () => {
    setIsLoading(true);
    try {
      const sermonResponse = await axios.get(`${apiBaseUrl}/sermon/fetchAll`);
      console.log("Sermon API Response:", sermonResponse.data);
      setSermonData(sermonResponse.data);


      const usersResponse = await axios.get(`${apiBaseUrl}/fetchAll`);
      console.log("All Users API Response:", usersResponse.data);
      setAllUsers(usersResponse.data);


      const liveSessionsResponse = await axios.get(`${apiBaseUrl}/listen/getallliveusers`);
      console.log("Live Sessions API Response:", liveSessionsResponse.data);
      setLiveSessionsData(liveSessionsResponse.data);


      const endedSessionsResponse = await axios.get(`${apiBaseUrl}/listen/getallusers`);
      console.log("Ended Sessions API Response:", endedSessionsResponse.data);
      setEndedSessionsData(endedSessionsResponse.data);

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error('Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChurches = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/church/fetchAll`);
      setChurches(response.data);
    } catch (error) {
      toast.error('Error fetching churches');
    }
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);

    const options = {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    };

    return date.toLocaleString('en-US', options);
  };

  const calculateDuration = (startDateTime, endDateTime) => {
    if (!startDateTime || !endDateTime) return 'N/A';

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    const durationMs = end - start;
    if (durationMs < 0) return 'N/A';

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

    if (hours === 0 && minutes === 0) {
      return `${seconds}s`;
    } else if (hours === 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
  };


  const toggleLiveSermonExpand = (sermonId) => {
    setExpandedLiveSermons(prev => ({
      ...prev,
      [sermonId]: !prev[sermonId]
    }));
  };

  const toggleEndedSermonExpand = (sermonId) => {
    setExpandedEndedSermons(prev => ({
      ...prev,
      [sermonId]: !prev[sermonId]
    }));
  };


  const getPaginatedLiveSermons = () => {
    const startIndex = (livePage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return liveSessionsData.slice(startIndex, endIndex).map((sermon, index) => ({
      ...sermon,
      serialNumber: startIndex + index + 1
    }));
  };

  const getPaginatedEndedSermons = () => {
    const startIndex = (endedPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return endedSessionsData.slice(startIndex, endIndex).map((sermon, index) => ({
      ...sermon,
      serialNumber: startIndex + index + 1
    }));
  };

  const getPaginatedJesusClickedUsers = () => {
    const startIndex = (jesusPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return jesusClickedUsers.slice(startIndex, endIndex).map((user, index) => ({
      ...user,
      serialNumber: startIndex + index + 1
    }));
  };


  const handleLivePageChange = (event, value) => {
    setLivePage(value);
    setExpandedLiveSermons({});
  };

  const handleEndedPageChange = (event, value) => {
    setEndedPage(value);
    setExpandedEndedSermons({});
  };
  const handleJesusPageChange = (event, value) => {
    setJesusPage(value);
  };


  const liveTotalPages = Math.ceil(liveSessionsData.length / ITEMS_PER_PAGE);
  const endedTotalPages = Math.ceil(endedSessionsData.length / ITEMS_PER_PAGE);
  const jesusTotalPages = Math.ceil(jesusClickedUsers.length / ITEMS_PER_PAGE);


  const handleDeleteSermon = async (sermonId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this sermon?");

    if (confirmDelete) {
      try {
        await axios.delete(`${apiBaseUrl}/sermon/delete/${sermonId}`);
        fetchAllSermonsAndUsers();
        toast.success("Sermon deleted successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete sermon");
      }
    }
  };


  return (
    <React.Fragment>
      <ToastContainer />


      <Grid container spacing={2}>
        {/*Accepted Jeasus Section */}
        {/* Accepted Jesus Section */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            Accepted Jesus
          </Typography>
          <Card sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <TableContainer
              component={Paper}
              sx={{
                overflowX: 'auto',
                p: { xs: 1, sm: 2, md: 3 }
              }}
            >
              <Table sx={{ minWidth: { xs: '100%', sm: 650 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        padding: theme => theme.spacing(isMobile ? 1 : 2),
                        width: '5%',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      Sr. No
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: theme => theme.spacing(isMobile ? 1 : 2),
                        width: '25%',
                        textAlign: 'left',
                        fontWeight: 'bold'
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: theme => theme.spacing(isMobile ? 1 : 2),
                        width: '40%',
                        textAlign: 'left',
                        fontWeight: 'bold'
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: theme => theme.spacing(isMobile ? 1 : 2),
                        width: '30%',
                        textAlign: 'left',
                        fontWeight: 'bold'
                      }}
                    >
                      Phone
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: theme => theme.spacing(isMobile ? 1 : 2),
                        width: '30%',
                        textAlign: 'left',
                        fontWeight: 'bold'
                      }}
                    >
                      Count
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', padding: theme => theme.spacing(2) }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <CircularProgress size={40} sx={{ color: '#231f20' }} />
                          <Typography variant="body1" color="#231f20">Loading users...</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : jesusClickedUsers.length > 0 ? (
                    getPaginatedJesusClickedUsers().map((user) => ( // Updated to use paginated data
                      <TableRow key={user._id} sx={{ backgroundColor: (user.serialNumber - 1) % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                        <TableCell
                          sx={{
                            padding: theme => theme.spacing(isMobile ? 1 : 2),
                            textAlign: 'center'
                          }}
                        >
                          {user.serialNumber} {/* Updated to use serialNumber */}
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: theme => theme.spacing(isMobile ? 1 : 2),
                            textAlign: 'left'
                          }}
                        >
                          {`${user.firstName} ${user.lastName}`}
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: theme => theme.spacing(isMobile ? 1 : 2),
                            textAlign: 'left'
                          }}
                        >
                          {user.email}
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: theme => theme.spacing(isMobile ? 1 : 2),
                            textAlign: 'left'
                          }}
                        >
                          {user.phone}
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: theme => theme.spacing(isMobile ? 1 : 2),
                            textAlign: 'left'
                          }}
                        >
                          {user.jesusClickCount}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', padding: theme => theme.spacing(2) }}>
                        No users have clicked Jesus yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination for Accepted Jesus */}
              {jesusClickedUsers.length > ITEMS_PER_PAGE && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 1, pr: 2 }}>
                  <Pagination
                    count={jesusTotalPages}
                    page={jesusPage}
                    onChange={handleJesusPageChange}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#231f20',
                      },
                      '& .Mui-selected': {
                        backgroundColor: '#231f20 !important',
                        color: 'white !important',
                      }
                    }}
                  />
                </Box>
              )}
            </TableContainer>
          </Card>
        </Grid>


        {/* Live Sermons Section */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            Live Sermons
          </Typography>
          <Card sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <TableContainer
              component={Paper}
              sx={{
                overflowX: 'auto',
                p: { xs: 1, sm: 2, md: 3 }
              }}
            >
              <Table sx={{ minWidth: { xs: '100%', sm: 650 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        padding: theme => theme.spacing(isMobile ? 1 : 2),
                        width: '5%',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      Sr. No
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: theme => theme.spacing(isMobile ? 1 : 2),
                        width: '20%',
                        display: isTablet ? 'none' : 'table-cell',
                        textAlign: 'left',
                        fontWeight: 'bold'
                      }}
                    >
                      Church Name
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: theme => theme.spacing(isMobile ? 1 : 2),
                        width: '20%',
                        display: isTablet ? 'none' : 'table-cell',
                        textAlign: 'left',
                        fontWeight: 'bold'
                      }}
                    >
                      Hosted By
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: theme => theme.spacing(isMobile ? 1 : 2),
                        width: '20%',
                        display: isTablet ? 'none' : 'table-cell',
                        textAlign: 'left',
                        fontWeight: 'bold'
                      }}
                    >
                      Start Date Time
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: theme => theme.spacing(isMobile ? 1 : 2),
                        width: '20%',
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', padding: theme => theme.spacing(2) }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <CircularProgress size={40} sx={{ color: '#231f20' }} />
                          <Typography variant="body1" color="#231f20">Loading sermons...</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : liveSessionsData.length > 0 ? (
                    getPaginatedLiveSermons().map((sermon) => (
                      <React.Fragment key={sermon.sermonId}>
                        <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                          <TableCell
                            sx={{
                              padding: theme => theme.spacing(isMobile ? 1 : 2),
                              textAlign: 'center'
                            }}
                          >
                            {sermon.serialNumber}
                          </TableCell>
                          <TableCell
                            sx={{
                              padding: theme => theme.spacing(isMobile ? 1 : 2),
                              display: isTablet ? 'none' : 'table-cell',
                              textAlign: 'left'
                            }}
                          >
                            {sermon.churchName}
                          </TableCell>
                          <TableCell
                            sx={{
                              padding: theme => theme.spacing(isMobile ? 1 : 2),
                              display: isTablet ? 'none' : 'table-cell',
                              textAlign: 'left'
                            }}
                          >
                            {sermon.adminName}
                          </TableCell>
                          <TableCell
                            sx={{
                              padding: (theme) => theme.spacing(isMobile ? 1 : 2),
                              display: isTablet ? 'none' : 'table-cell',
                              textAlign: 'left'
                            }}
                          >
                            {(() => {
                              try {
                                // Ensure we have a value and it's a valid date
                                if (sermon && sermon.SermonStartDateTime && !isNaN(new Date(sermon.SermonStartDateTime).getTime())) {
                                  return formatDateTime(sermon.SermonStartDateTime);
                                } else {
                                  // If there's an issue with the console, log it for debugging
                                  console.error('Invalid date value:', sermon?.SermonStartDateTime);
                                  return 'N/A'; // This will still show N/A if the date is invalid
                                }
                              } catch (error) {
                                console.error('Error formatting date:', error);
                                return 'N/A';
                              }
                            })()}
                          </TableCell>

                          <TableCell
                            sx={{
                              padding: theme => theme.spacing(isMobile ? 1 : 2),
                              textAlign: 'center'
                            }}
                          >
                            <Stack direction="row" spacing={0} justifyContent="center">
                              <IconButton
                                size="small"
                                style={{ color: "black" }} // Changed color to black
                                onClick={() => handleDeleteSermon(sermon.sermonId)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>

                              {/* Add a small invisible spacer */}
                              <Box sx={{ width: 8 }} />
                              <Button
                                onClick={() => toggleLiveSermonExpand(sermon.sermonId)}
                                variant="contained"
                                color="primary"
                                className="bg-b"
                                sx={{
                                  padding: '5px 10px',
                                  minHeight: '30px',
                                  fontSize: '0.875rem',
                                  textTransform: 'none',
                                  width: 'auto'
                                }}
                              >
                                View Details
                              </Button>

                              <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => toggleLiveSermonExpand(sermon.sermonId)}
                              >
                                {expandedLiveSermons[sermon.sermonId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                              </IconButton>
                            </Stack>

                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} sx={{ padding: 0, border: 'none' }}>
                            <Collapse in={expandedLiveSermons[sermon.sermonId]} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 1, backgroundColor: '#f5f5f5', borderRadius: 1, p: 2 }}>
                                <Typography variant="h6" gutterBottom component="div" sx={{ fontSize: '1rem' }}>
                                  Members Joined <b>({sermon.listeners.length})</b>  | Members Active <b>({sermon.activeListeners})</b> | Members Inactive <b>({sermon.inactiveListeners})</b>
                                </Typography>

                                <Table size="small" aria-label="all listeners">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'center', fontWeight: 'bold' }}>Sr. No</TableCell>
                                      <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'left', fontWeight: 'bold' }}>User Name</TableCell>
                                      <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'left', fontWeight: 'bold' }}>Email</TableCell>
                                      <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'left', fontWeight: 'bold' }}>Start Date Time</TableCell>
                                      <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'center', fontWeight: 'bold' }}>Status</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {sermon.listeners.map((listener, index) => (
                                      <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                                        < TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'center' }}>{index + 1}</TableCell>
                                        <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'left' }}>{listener.userName}</TableCell>
                                        <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'left' }}>{listener.userEmail}</TableCell>
                                        <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'left' }}>{formatDateTime(listener.startDateTime)}</TableCell>
                                        <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'center' }}>
                                          <Chip
                                            label={listener.status === "Live" ? "Active" : "Inactive"} // Change Live → Active, End → Inactive
                                            sx={{
                                              backgroundColor: listener.status === "Live" ? '#e8f5e9' : '#ffebee', // Keep existing colors
                                              color: listener.status === "Live" ? '#2e7d32' : '#c62828',
                                              fontWeight: 'bold',
                                              borderRadius: '20px',
                                              minWidth: '80px',
                                            }}
                                          />
                                        </TableCell>

                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', padding: theme => theme.spacing(2) }}>
                        No Live Sessions available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination for live sermons - only show if more than ITEMS_PER_PAGE records */}
              {liveSessionsData.length > ITEMS_PER_PAGE && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 1, pr: 2 }}>
                  <Pagination
                    count={liveTotalPages}
                    page={livePage}
                    onChange={handleLivePageChange}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#231f20',
                      },
                      '& .Mui-selected': {
                        backgroundColor: '#231f20 !important',
                        color: 'white !important',
                      }
                    }}
                  />
                </Box>
              )}
            </TableContainer>
          </Card>
        </Grid>

        {/* Ended Sermons Section */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mb: 2, mt: 4, fontWeight: 'bold' }}>
            Ended Sermons
          </Typography>
          <Card sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <TableContainer component={Paper} sx={{ overflowX: 'auto', p: { xs: 1, sm: 2, md: 3 } }}>
              <Table sx={{ minWidth: { xs: '100%', sm: 650 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        padding: theme => theme.spacing(isMobile ? 1 : 2),
                        width: '5%',
                        whiteSpace: 'nowrap',
                        fontWeight: 'bold'
                      }}
                    >
                      Sr. No
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: theme => theme.spacing(isMobile ? 1 : 2),
                        width: '20%',
                        display: isTablet ? 'none' : 'table-cell',
                        fontWeight: 'bold'
                      }}
                    >
                      Church Name
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: theme => theme.spacing(isMobile ? 1 : 2),
                        width: '20%',
                        fontWeight: 'bold'
                      }}
                    >
                      Hosted By
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: theme => theme.spacing(isMobile ? 1 : 2),
                        width: '20%',
                        display: isTablet ? 'none' : 'table-cell',
                        fontWeight: 'bold'
                      }}
                    >
                      Start Date Time
                    </TableCell>
                    {/* <TableCell
                      sx={{
                        padding: theme => theme.spacing(isMobile ? 1 : 2),
                        width: '20%',
                        display: isTablet ? 'none' : 'table-cell',
                        fontWeight: 'bold'
                      }}
                    >
                      End Date Time
                    </TableCell> */}
                    <TableCell
                      sx={{
                        padding: theme => theme.spacing(isMobile ? 1 : 2),
                        width: '15%',
                        fontWeight: 'bold'
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>


                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', padding: theme => theme.spacing(2) }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <CircularProgress size={40} sx={{ color: '#231f20' }} />
                          <Typography variant="body1" color="#231f20">Loading sermons...</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : endedSessionsData.length > 0 ? (
                    getPaginatedEndedSermons().map((sermon) => (
                      <React.Fragment key={sermon.sermonId}>
                        <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                          <TableCell
                            sx={{
                              padding: theme => theme.spacing(isMobile ? 1 : 2),
                              textAlign: 'center',
                            }}
                          >
                            {sermon.serialNumber}
                          </TableCell>
                          <TableCell
                            sx={{
                              padding: theme => theme.spacing(isMobile ? 1 : 2),
                              display: isTablet ? 'none' : 'table-cell',
                              textAlign: 'left',
                            }}
                          >
                            {sermon.churchName}
                          </TableCell>
                          <TableCell
                            sx={{
                              padding: theme => theme.spacing(isMobile ? 1 : 2),
                              display: isTablet ? 'none' : 'table-cell',
                              textAlign: 'left',
                            }}
                          >
                            {sermon.adminName}
                          </TableCell>
                          <TableCell
                            sx={{
                              padding: (theme) => theme.spacing(isMobile ? 1 : 2),
                              display: isTablet ? 'none' : 'table-cell',
                              textAlign: 'left'
                            }}
                          >
                            {formatDateTime(sermon.SermonStartDateTime || sermon.sermonStartDateTime)}
                          </TableCell>

                          <TableCell
                            sx={{
                              padding: theme => theme.spacing(isMobile ? 1 : 2),
                              textAlign: 'center',
                            }}
                          >
                            <Stack direction="row" spacing={0} justifyContent="center" alignItems="center">
                              <IconButton
                                size="small"
                                style={{ color: "black" }} // Changed color to black
                                onClick={() => handleDeleteSermon(sermon.sermonId)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>


                              {/* Add a small invisible spacer */}
                              <Box sx={{ width: 8 }} />

                              <Button
                                variant="contained"
                                color="primary"
                                className="bg-b"
                                onClick={() => toggleEndedSermonExpand(sermon.sermonId)}
                                sx={{
                                  padding: '4px 6px',
                                  fontSize: '0.75rem',
                                  textTransform: 'none',
                                  minWidth: '85px',
                                  whiteSpace: 'nowrap',
                                  lineHeight: '1.5',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                View Details
                              </Button>

                              <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => toggleEndedSermonExpand(sermon.sermonId)}
                              >
                                {expandedEndedSermons[sermon.sermonId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                              </IconButton>
                            </Stack>

                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={6} sx={{ padding: 0, border: 'none' }}>
                            <Collapse in={expandedEndedSermons[sermon.sermonId]} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 1, backgroundColor: '#f5f5f5', borderRadius: 1, p: 2 }}>
                                <Typography variant="h6" gutterBottom component="div" sx={{ fontSize: '1rem' }}>
                                  Members Joined ({sermon.listeners ? sermon.listeners.length : 0})
                                </Typography>
                                <Table size="small" aria-label="listeners">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'center', fontWeight: 'bold' }}>
                                        Sr. No
                                      </TableCell>
                                      <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'left', fontWeight: 'bold' }}>
                                        User Name
                                      </TableCell>
                                      <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'left', fontWeight: 'bold' }}>
                                        Email
                                      </TableCell>
                                      <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'left', fontWeight: 'bold' }}>
                                        Start Time
                                      </TableCell>
                                      <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'left', fontWeight: 'bold' }}>
                                        End Time
                                      </TableCell>
                                      <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'center', fontWeight: 'bold' }}>
                                        Duration
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {sermon.listeners && sermon.listeners.length > 0 ? (
                                      sermon.listeners.map((listener, index) => (
                                        <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                                          <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'center' }}>
                                            {index + 1}
                                          </TableCell>
                                          <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'left' }}>
                                            {listener.userName}
                                          </TableCell>
                                          <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'left' }}>
                                            {listener.userEmail}
                                          </TableCell>
                                          <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'left' }}>
                                            {formatDateTime(listener.startDateTime)}
                                          </TableCell>
                                          <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'left' }}>
                                            {listener.endDateTime ? formatDateTime(listener.endDateTime) : 'N/A'}
                                          </TableCell>
                                          <TableCell sx={{ padding: theme => theme.spacing(1), textAlign: 'center' }}>
                                            {listener.endDateTime ? calculateDuration(listener.startDateTime, listener.endDateTime) : 'N/A'}
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    ) : (
                                      <TableRow>
                                        <TableCell colSpan={6} sx={{ textAlign: 'center', padding: theme => theme.spacing(2) }}>
                                          No listeners found
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', padding: theme => theme.spacing(2) }}>
                        No Ended Sessions available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination for ended sermons */}
              {endedSessionsData.length > ITEMS_PER_PAGE && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 1, pr: 2 }}>
                  <Pagination
                    count={endedTotalPages}
                    page={endedPage}
                    onChange={handleEndedPageChange}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#231f20',
                      },
                      '& .Mui-selected': {
                        backgroundColor: '#231f20 !important',
                        color: 'white !important',
                      },
                    }}
                  />
                </Box>
              )}
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default AnalyticsMenu;