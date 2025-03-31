import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';

import ChatList from './ChatList';
import './style.css'
const NavRight = ({ userImage }) => {
  const [listOpen, setListOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('userEmail');
    if (storedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/login');
    setIsLoggedIn(false);
  };

  const firstName = localStorage.getItem('firstName');
  const lastName = localStorage.getItem('lastName');

  // Create display name based on available information
  const displayName = `${firstName}${lastName ? ` ${lastName}` : ''}`.trim();

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        <ListGroup.Item as="li" bsPrefix=" ">
              <div className="pro-head text-dark">
                {displayName}
                <Link to="/" className="dud-logout black fs-5" title="Logout" onClick={handleLogout}>
                  <i className="feather icon-log-out logout-icon" />
                </Link>
              </div>
        </ListGroup.Item>
      </ListGroup>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  );
};

export default NavRight;
