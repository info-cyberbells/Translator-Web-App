import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { FaChurch, FaUser, FaUsers, FaUserCheck, FaChartLine, FaMoneyBillAlt, FaVideo } from 'react-icons/fa'; // Importing necessary icons

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL; // Replace with your actual API base URL

const DashDefault = () => {
  const [dashSalesData, setDashSalesData] = useState([
    { title: 'Total churches', icon: <FaChurch />, count: 0 }, // Icon for churches
    { title: 'Total Admininister', icon: <FaUser />, count: 0 }, // Icon for admin
    { title: 'Total Staff', icon: <FaUsers />, count: 0 }, // Icon for staff
    { title: 'Total User', icon: <FaUserCheck />, count: 0 }, // Icon for users
  ]);

  const [error, setError] = useState(null);

  // Function to fetch data and update the state
  const fetchData = async (index, url, churchId) => {
    try {
      const completeUrl = churchId ? `${url}?churchId=${churchId}` : url;
      const response = await axios.get(completeUrl);
      const { total, totalCount } = response.data;

      const newData = [...dashSalesData];
      newData[index].count = total || totalCount || dashSalesData[index].count; // Retain previous value if no valid data
      setDashSalesData(newData);
    } catch (err) {
      setError(err.message || 'Error fetching data');
    }
  };

  useEffect(() => {
    const userType = localStorage.getItem('userType'); // Get userType from localStorage
    const churchId = localStorage.getItem('churchId'); // Get churchId from localStorage

    // Fetch total churches
    fetchData(0, `${apiBaseUrl}/church/count`);

    // Conditional fetching based on userType
    if (userType === "1") {
      // Admin-level data fetching
      fetchData(1, `${apiBaseUrl}/user/counts/2`);
      fetchData(2, `${apiBaseUrl}/user/counts/3`);
      fetchData(3, `${apiBaseUrl}/user/counts/4`);
    } else {
      // For other user types (2, 3, 4), include churchId
      fetchData(1, `${apiBaseUrl}/user/counts/2`, churchId);
      fetchData(2, `${apiBaseUrl}/user/counts/3`, churchId);
      fetchData(3, `${apiBaseUrl}/user/counts/4`, churchId);
    }
  }, []);

  const userType = localStorage.getItem('userType'); // Get userType from localStorage

  // Common user-specific data structures for rendering
  const userSpecificData = [
    { title: 'Attended Sermons', icon: <FaChartLine /> },
    { title: 'Live Sermons', icon: <FaVideo /> },
    { title: 'Donations', icon: <FaMoneyBillAlt /> },
  ];

  const userSpecificDataStaff = [
    { title: 'Total Users', icon: <FaUserCheck /> }, // Staff should see only total users under their church
  ];

  const userSpecificDataAdmin = [
    { title: 'Total Sermons', icon: <FaMoneyBillAlt /> },
    { title: 'Today Sermons', icon: <FaMoneyBillAlt /> },
    { title: 'Total Staff', icon: <FaUsers /> },
    { title: 'Total Users', icon: <FaUserCheck /> },
    { title: 'Total Events', icon: <FaMoneyBillAlt /> },
  ];

  // Helper function to display cards
  const renderCards = (dataSet) => {
    return dataSet.map((data, index) => (
      <Col key={index} xl={6} xxl={4}>
        <Card>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">{data.title}</h3>
              <div className="f-30">{data.icon}</div>
            </div>
            <div className="row d-flex align-items-center">
              <div className="col-9">
                <h3 className="f-w-300 d-flex align-items-center m-b-0">
                  {dashSalesData[index] ? dashSalesData[index].count : 0} {/* Use 0 if no value */}
                </h3>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  if (parseInt(userType) === 4) {
    // User-type 4 specific view
    return (
      <React.Fragment>
        <Row>{renderCards(userSpecificData)}</Row>
        {error && <div className="alert alert-danger">{error}</div>}
      </React.Fragment>
    );
  }

  if (parseInt(userType) === 3) {
    // User-type 3 (Staff) specific view
    return (
      <React.Fragment>
        <Row>{renderCards(userSpecificDataStaff)}</Row>
        {error && <div className="alert alert-danger">{error}</div>}
      </React.Fragment>
    );
  }

  if (parseInt(userType) === 2) {
    // User-type 2 (Admin) specific view
    return (
      <React.Fragment>
        <Row>{renderCards(userSpecificDataAdmin)}</Row>
        {error && <div className="alert alert-danger">{error}</div>}
      </React.Fragment>
    );
  }

  // Default view (if no specific userType is matched)
  return (
    <React.Fragment>
      <Row>
        {dashSalesData.map((data, index) => (
          <Col key={index} xl={6} xxl={4}>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="mb-0">{data.title}</h3>
                  <div className="f-30">{data.icon}</div>
                </div>
                <div className="row d-flex align-items-center">
                  <div className="col-9">
                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                      {data.count ? data.count : 0} {/* Use 0 if no value */}
                    </h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {error && <div className="alert alert-danger">{error}</div>}
    </React.Fragment>
  );
};

export default DashDefault;
