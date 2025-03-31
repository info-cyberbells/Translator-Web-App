// views/SermonLayout.jsx
import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';

const SermonLayout = () => {
  const location = useLocation();
  const isBroadcast = location.pathname.includes('/broadcast');

  return (
    <div className="container-fluid mt-4">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <div className="btn-group" role="group">
            <Link 
              to="/sermons/broadcast"
              className={`btn ${isBroadcast ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              Broadcast Sermon
            </Link>
            <Link 
              to="/sermons/join"
              className={`btn ${!isBroadcast ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              Join Sermon
            </Link>
          </div>
        </div>
      </div>
      
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SermonLayout;