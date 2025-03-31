import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Carousel } from 'react-bootstrap';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { FaChurch, FaUser, FaUsers, FaUserCheck, FaChartLine, FaMoneyBillAlt, FaVideo, FaCalendarAlt, FaMoon, FaSun } from 'react-icons/fa';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const DashDefault = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const iconColor = isDarkMode ? '#FFFFFF' : '#000000';

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Modified icon components with dynamic color
  const getColoredIcon = (IconComponent) => <IconComponent color={iconColor} size={24} />;
  const [dashSalesData, setDashSalesData] = useState([
    { title: 'Total Churches', icon: getColoredIcon(FaChurch), count: 0 },
    { title: 'Total Admininisters', icon: getColoredIcon(FaUser), count: 0 },
    { title: 'Total Staff Members', icon: getColoredIcon(FaUsers), count: 0 },
    { title: 'Total Users', icon: getColoredIcon(FaUserCheck), count: 0 },
    { title: 'Total Events', icon: getColoredIcon(FaCalendarAlt), count: 0 }
  ]);

  const [churches, setChurches] = useState([]);
  const [superadminTotalUsers, setSuperadminTotalUsers] = useState(0);
  const [sermonCount, setSermonCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    setDashSalesData((prevData) =>
      prevData.map((item) => ({
        ...item,
        icon: getColoredIcon(
          item.title === 'Total Churches'
            ? FaChurch
            : item.title === 'Total Admininisters'
              ? FaUser
              : item.title === 'Total Staff Members'
                ? FaUsers
                : item.title === 'Total Users'
                  ? FaUserCheck
                  : FaCalendarAlt
        )
      }))
    );
  }, [isDarkMode]);

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

  const fetchSermonCount = async (churchId) => {
    try {
      const completeUrl = churchId ? `${apiBaseUrl}/sermon/fetchAll?churchId=${churchId}` : `${apiBaseUrl}/sermon/fetchAll`;
      const response = await axios.get(completeUrl);

      
      if (response.data && Array.isArray(response.data)) {
        setSermonCount(response.data.length);
      } else if (response.data && response.data.sermons && Array.isArray(response.data.sermons)) {
        setSermonCount(response.data.sermons.length);
      } else if (response.data && response.data.total) {
        setSermonCount(response.data.total);
      } else {
        setSermonCount(0);
      }
    } catch (err) {
      setError(err.message || 'Error fetching sermon data');
      setSermonCount(0);
    }
  };

  const fetchChurches = async () => {
    try {
      const churchId = localStorage.getItem('churchId');
      if (!churchId) {
        setError('Church ID not found in local storage');
        return;
      }

      const response = await axios.get(`${apiBaseUrl}/church/detail/${churchId}`);
     
      setChurches([response.data]); 
    } catch (err) {
      setError(err.message || 'Error fetching church details');
    }
  };

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const churchId = localStorage.getItem('churchId');

    if (userType === '4') {
      fetchChurches();
    }

    if (userType === '1' || userType === '2') {
      fetchData(0, `${apiBaseUrl}/church/count`);
    }

    if (userType === '1') {
      fetchData(1, `${apiBaseUrl}/user/counts/2`);
      fetchData(2, `${apiBaseUrl}/user/counts/3`);
      fetchData(3, `${apiBaseUrl}/user/counts/4`);
    } else {
      fetchData(1, `${apiBaseUrl}/user/counts/2`, churchId);
      fetchData(2, `${apiBaseUrl}/user/counts/3`, churchId);
      fetchData(3, `${apiBaseUrl}/user/counts/4`, churchId);
    }

    if (userType === '2' || userType === '3') {
      fetchData(4, `${apiBaseUrl}/event/count`, churchId); 
    } else {
      fetchData(4, `${apiBaseUrl}/event/count`); 
    }

    
    if (userType === '1') {
      fetchSermonCount();
    } else {
      fetchSermonCount(churchId); 
    }
  }, []);

  const userType = localStorage.getItem('userType');

  const userSpecificData = [
    // { title: 'Attended Sermons', icon: getColoredIcon(FaChartLine) },
    // { title: 'Live Sermons', icon: getColoredIcon(FaVideo) }
  ];

  const userSpecificDataStaff = [
    { title: 'Total Users', icon: getColoredIcon(FaUserCheck), count: dashSalesData[3].count },
    { title: 'Total Events', icon: getColoredIcon(FaCalendarAlt), count: dashSalesData[4].count },
    { title: 'Total Sermons Broadcasted', icon: getColoredIcon(FaMoneyBillAlt), count: sermonCount }
  ];

  const userSpecificDataAdmin = [
<<<<<<< HEAD
    { title: 'Total Churches', icon: getColoredIcon(FaChurch), count: dashSalesData[0].count },
=======

>>>>>>> 9d8938c (latest code pushed to git)
    { title: 'Total Sermons Broadcasted', icon: getColoredIcon(FaMoneyBillAlt), count: sermonCount },
    { title: 'Total Staff Members', icon: getColoredIcon(FaUsers), count: dashSalesData[2].count },
    { title: 'Total Users', icon: getColoredIcon(FaUserCheck), count: dashSalesData[3].count },
    { title: 'Total Events', icon: getColoredIcon(FaCalendarAlt), count: dashSalesData[4].count }
  ];

  const ChurchImageCarousel = () => (
    <Row className="mb-5">
      <Col className="d-flex justify-content-center">
        <Card style={{ maxWidth: '800px', width: '100%' }}>
          <Card.Body className="p-4">
            <Carousel
              indicators={false}
              controls={churches.length > 1}
              interval={3000}
              className="church-carousel"
            >
              {churches.map((church, index) => (
                <Carousel.Item key={index}>
                  <div className="church-slide">
                    <div className="church-image-container">
                      {church.image ? (
                        <img
                          src={church.image}
                          alt={church.name}
                          className="church-image"
                        />
                      ) : (
                        <div className="church-icon">
                          <FaChurch size={200} color="#231f20" />
                        </div>
                      )}
                    </div>
                    <div className="church-name-container">
                      <h2 className="church-name">
                        {church.name || 'Church Name Not Available'}
                      </h2>
                    </div>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderCards = (dataSet) => {
    return dataSet.map((data, index) => (
      <Col key={index} xl={6} xxl={4}>
        <Card
          style={{
            marginBottom: '25px',
            cursor: data.onClick ? 'pointer' : 'default',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            transition: 'all 0.3s ease',
            border: isDarkMode ? '1px solid #333' : '1px solid #dee2e6'
          }}
          onClick={data.onClick}
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3
                className="mb-0"
                style={{
                  color: isDarkMode ? '#ffffff' : '#000000',
<<<<<<< HEAD
                  fontSize: '23px',
                  textDecoration: data.onClick ? 'underline' : 'none'
=======
                  textDecoration: data.onClick ? 'underline' : 'none',
                  whiteSpace: 'nowrap', 
                  fontSize: '23px',
                overflow: 'hidden', 
                textOverflow: 'ellipsis'
>>>>>>> 9d8938c (latest code pushed to git)
                }}
              >
                {data.title}
              </h3>
              <div className="f-30">{data.icon}</div>
            </div>
            <div className="row d-flex align-items-center">
              <div className="col-9">
                <h3 className="f-w-300 d-flex align-items-center m-b-0" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                  {data.count !== undefined ? data.count : 0}
                </h3>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  const renderDashboard = () => {
    if (parseInt(userType) === 1) {
      const superadminData = [
        ...dashSalesData.slice(0, 3),
        { ...dashSalesData[3], count: superadminTotalUsers },
        dashSalesData[4],
        { title: 'Total Sermons Broadcasted', icon: getColoredIcon(FaMoneyBillAlt), count: sermonCount }
      ];
      return <Row>{renderCards(superadminData)}</Row>;
    }

    if (parseInt(userType) === 4) {
      return (
        <>
          <ChurchImageCarousel />
          <Row>{renderCards([...userSpecificData, { title: 'Total Sermons Broadcasted', icon: getColoredIcon(FaMoneyBillAlt), count: sermonCount }])}</Row>
        </>
      );
    }

    if (parseInt(userType) === 3) {
      return <Row>{renderCards(userSpecificDataStaff)}</Row>;
    }

    if (parseInt(userType) === 2) {
      return <Row>{renderCards(userSpecificDataAdmin)}</Row>;
    }

    return <Row>{renderCards([...dashSalesData, { title: 'Total Sermons Broadcasted', icon: getColoredIcon(FaMoneyBillAlt), count: sermonCount }])}</Row>;
  };
  return (
    <React.Fragment>
      {/* <div className="d-flex justify-content-end mb-3">
        <button
          onClick={toggleDarkMode}
          className="btn btn-light border"
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
        >
          {isDarkMode ? (
            <>
              <FaSun color="#FFD700" />
              Light Mode
            </>
          ) : (
            <>
              <FaMoon color="#6c757d" />
              Dark Mode
            </>
          )}
        </button>
      </div> */}

      {renderDashboard()}
      {error && <div className="alert alert-danger">{error}</div>}
      <style>{`
        .church-carousel.dark-mode {
          background-color: #1a1a1a;
        }

        .church-carousel.dark-mode .carousel-control-prev,
        .church-carousel.dark-mode .carousel-control-next {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .church-carousel.dark-mode .carousel-control-prev:hover,
        .church-carousel.dark-mode .carousel-control-next:hover {
          background-color: rgba(255, 255, 255, 0.4);
        }
        .church-carousel {
          background-color: #ffffff;
          border-radius: 4px;
        }
  
        .church-slide {
          min-height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
        }
  
        .church-image-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 250px;
          margin-bottom: 20px;
        }
  
        .church-image {
          // max-height: 300px;
          max-width: 100%;
          width: 100%;
          object-fit: contain;
        }
  
        .church-icon {
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
  
        .church-name-container {
          width: 100%;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 8px;
          margin-top: auto;
        }
  
        .church-name {
          color: #231f20;
          text-align: center;
          margin: 0;
          font-size: 24px;
          font-weight: bold;
          word-wrap: break-word;
        }
  
        .carousel-control-prev,
        .carousel-control-next {
          width: 5%;
          background-color: rgba(35, 31, 32, 0.2);
        }
  
        .carousel-control-prev:hover,
        .carousel-control-next:hover {
          background-color: rgba(35, 31, 32, 0.4);
        }
  
        .carousel-item {
          transition: transform 0.6s ease-in-out;
        }
  
        @media (max-width: 768px) {
          .church-slide {
            min-height: 300px;
            padding: 15px;
          }
  
          .church-image-container {
            min-height: 180px;
          }
  
          .church-image {
            max-height: 170px;
          }
  
          .church-icon {
            height: 170px;
          }
  
          .church-name {
            font-size: 20px;
          }
        }
      `}</style>
      {/* {renderDashboard()} */}
      {error && <div className="alert alert-danger">{error}</div>}
    </React.Fragment>
  );
};

export default DashDefault;
