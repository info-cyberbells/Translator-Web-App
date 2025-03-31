import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { FaChurch, FaUser, FaUsers, FaUserCheck, FaChartLine, FaMoneyBillAlt, FaVideo, FaCalendarAlt } from 'react-icons/fa';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const DashDefault = () => {
  const [dashSalesData, setDashSalesData] = useState([
    { title: 'Total Churches', icon: <FaChurch />, count: 0 },
    { title: 'Total Admininisters', icon: <FaUser />, count: 0 },
    { title: 'Total Staff Members', icon: <FaUsers />, count: 0 },
    { title: 'Total Users', icon: <FaUserCheck />, count: 0 },
    { title: 'Total Events', icon: <FaCalendarAlt />, count: 0 },
  ]);

  const [superadminTotalUsers, setSuperadminTotalUsers] = useState(0);
  const [error, setError] = useState(null);

  const fetchData = async (index, url, churchId) => {
    try {
      const completeUrl = churchId ? `${url}?churchId=${churchId}` : url;
      const response = await axios.get(completeUrl);
      const { total, totalCount } = response.data;

      if (url.includes('/user/counts/4') && !churchId) {
        setSuperadminTotalUsers(totalCount || 0);
      } else {
        const newData = [...dashSalesData];
        newData[index].count = total || totalCount || newData[index].count;
        setDashSalesData(newData);
      }
    } catch (err) {
      setError(err.message || 'Error fetching data');
    }
  };

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const churchId = localStorage.getItem('churchId');

    fetchData(0, `${apiBaseUrl}/church/count`);
    
    if (userType === "1") {
      fetchData(1, `${apiBaseUrl}/user/counts/2`);
      fetchData(2, `${apiBaseUrl}/user/counts/3`);
      fetchData(3, `${apiBaseUrl}/user/counts/4`);
    } else {
      fetchData(1, `${apiBaseUrl}/user/counts/2`, churchId);
      fetchData(2, `${apiBaseUrl}/user/counts/3`, churchId);
      fetchData(3, `${apiBaseUrl}/user/counts/4`, churchId);
    }
    
    // Fetch Total Events for all user types
    fetchData(4, `${apiBaseUrl}/event/count`);
  }, []);

  const userType = localStorage.getItem('userType');

  const userSpecificData = [
    { title: 'Attended Sermons', icon: <FaChartLine /> },
    { title: 'Live Sermons', icon: <FaVideo /> },
    // { title: 'Donations', icon: <FaMoneyBillAlt /> },
  ];

  const userSpecificDataStaff = [
    { title: 'Total Users', icon: <FaUserCheck />, count: dashSalesData[3].count },
    { title: 'Total Events', icon: <FaCalendarAlt />, count: dashSalesData[4].count },
  ];

  const userSpecificDataAdmin = [
    { title: 'Total Sermons', icon: <FaMoneyBillAlt /> },
    { title: 'Today Sermons', icon: <FaMoneyBillAlt /> },
    { title: 'Total Staff Members', icon: <FaUsers />, count: dashSalesData[2].count },
    { title: 'Total Users', icon: <FaUserCheck />, count: dashSalesData[3].count },
    { title: 'Total Events', icon: <FaCalendarAlt />, count: dashSalesData[4].count },
  ];

  const renderCards = (dataSet) => {
    return dataSet.map((data, index) => (
      <Col key={index} xl={6} xxl={4}>
        <Card style={{marginBottom: '25px'}}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">{data.title}</h3>
              <div className="f-30">{data.icon}</div>
            </div>
            <div className="row d-flex align-items-center">
              <div className="col-9">
                <h3 className="f-w-300 d-flex align-items-center m-b-0">
                  {data.count !== undefined ? data.count : (dashSalesData[index] ? dashSalesData[index].count : 0)}
                </h3>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  if (parseInt(userType) === 1) {
    const superadminData = [
      ...dashSalesData.slice(0, 3),
      { ...dashSalesData[3], count: superadminTotalUsers },
      dashSalesData[4],
    ];
    return (
      <React.Fragment>
        <Row>{renderCards(superadminData)}</Row>
        {error && <div className="alert alert-danger">{error}</div>}
      </React.Fragment>
    );
  }

  if (parseInt(userType) === 4) {
    return (
      <React.Fragment>
        <Row>{renderCards(userSpecificData)}</Row>
        {error && <div className="alert alert-danger">{error}</div>}
      </React.Fragment>
    );
  }

  if (parseInt(userType) === 3) {
    return (
      <React.Fragment>
        <Row>{renderCards(userSpecificDataStaff)}</Row>
        {error && <div className="alert alert-danger">{error}</div>}
      </React.Fragment>
    );
  }

  if (parseInt(userType) === 2) {
    return (
      <React.Fragment>
        <Row>{renderCards(userSpecificDataAdmin)}</Row>
        {error && <div className="alert alert-danger">{error}</div>}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Row>{renderCards(dashSalesData)}</Row>
      {error && <div className="alert alert-danger">{error}</div>}
    </React.Fragment>
  );
};

export default DashDefault;