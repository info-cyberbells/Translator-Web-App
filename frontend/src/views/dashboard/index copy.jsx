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

  

  const fetchData = async (index, url, churchId) => {
    try {
        // Create the URL with query parameters based on userType
        const completeUrl = churchId ? `${url}?churchId=${churchId}` : url;
        const response = await axios.get(completeUrl);
        const { total, totalCount } = response.data;

        const newData = [...dashSalesData];
        newData[index].count = total || totalCount;
        setDashSalesData(newData);
    } catch (err) {
        setError(err.message || 'Error fetching data');
    }
};

useEffect(() => {
    const userType = localStorage.getItem('userType'); // Get userType from localStorage
    const churchId = localStorage.getItem('churchId'); // Get churchId from localStorage

    // Fetch total churches without churchId
    fetchData(0, `${apiBaseUrl}/church/count`);

    // Conditional fetching based on userType
    if (userType === "1") {
        fetchData(1, `${apiBaseUrl}/user/counts/2`); // Fetch total admin
        fetchData(2, `${apiBaseUrl}/user/counts/3`); // Fetch total staff
        fetchData(3, `${apiBaseUrl}/user/counts/4`); // Fetch total users
    } else {
        // For user types 2, 3, and 4, include churchId in the query
        fetchData(1, `${apiBaseUrl}/user/counts/2`, churchId); // Fetch total admin with churchId
        fetchData(2, `${apiBaseUrl}/user/counts/3`, churchId); // Fetch total staff with churchId
        fetchData(3, `${apiBaseUrl}/user/counts/4`, churchId); // Fetch total users with churchId
    }
}, []);
  const userType = localStorage.getItem('userType');
  const userSpecificData = [
    { title: 'Attended Sermon', icon: <FaChartLine /> }, // Icon for attended sermon
    { title: 'Live Sermon', icon: <FaVideo /> }, // Icon for live sermon
    { title: 'Donation', icon: <FaMoneyBillAlt /> }, // Icon for donation
  ];

  if (parseInt(userType) === 4) {
    return (
      <React.Fragment>
        <Row>
          {userSpecificData.map((data, index) => (
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
                        {dashSalesData[index] ? dashSalesData[index].count : 0}
                      </h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {error && <div className="alert alert-danger">{error}</div>} {/* Display error if any */}
      </React.Fragment>
    );
  }



  const userSpecificDataAdmin = [
    { title: 'Total Sermons ', icon: <FaMoneyBillAlt /> },
    { title: 'Today Sermons ', icon: <FaMoneyBillAlt /> },
    { title: 'Total Staff', icon: <FaUsers />, count: 0 }, // Icon for live sermon
  // Icon for donation
    { title: 'Total User', icon: <FaUserCheck />, count: 0 }, // Icon for attended sermon
    { title: 'Total Events ', icon: <FaMoneyBillAlt /> }, 
  ];

  if (parseInt(userType) === 2) {
    return (
      <React.Fragment>
        <Row>
          {userSpecificDataAdmin.map((data, index) => (
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
                        {dashSalesData[index] ? dashSalesData[index].count : 0}
                      </h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {error && <div className="alert alert-danger">{error}</div>} {/* Display error if any */}
      </React.Fragment>
    );
  }

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
                      {data.count ? data.count : 0}
                    </h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {error && <div className="alert alert-danger">{error}</div>} {/* Display error if any */}
    </React.Fragment>
  );
};

export default DashDefault;
