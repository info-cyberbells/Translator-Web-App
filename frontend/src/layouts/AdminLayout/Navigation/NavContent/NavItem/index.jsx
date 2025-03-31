import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUser, FaUsers, FaChurch,FaUserSlash,FaUserMinus , FaUserShield, FaPlay, FaRegComment, FaDonate, FaFileContract , FaBookOpen, FaCalendarAlt, FaShieldAlt, FaChartLine   } from 'react-icons/fa'; // Import additional icons as needed


import NavBadge from '../NavBadge';
import { ConfigContext } from '../../../../../contexts/ConfigContext';
import * as actionType from '../../../../../store/actions';
import useWindowSize from '../../../../../hooks/useWindowSize';

// Icon mapping based on the title
const iconMapping = {
  'Dashboard': FaHome,
  'Manage Profile': FaUser,
  'Manage Administrators': FaUserShield,
  'Manage Staff Members': FaUsers,
  'Manage Churches': FaChurch,
  'Manage Users': FaUser,
  'Manage Church': FaChurch,
  'Go Live': FaPlay,
  'Join Live Sermons': FaPlay, //Go Live
  
  'Daily Devotional': FaPlay, 
  'Manage Prayer Request': FaRegComment, //New icon for Prayer Request
  'Manage Donate': FaDonate, //New icon for Donate
  'Manage Events': FaCalendarAlt, //New icon for Donate
  'Events': FaCalendarAlt, //New icon for Donate
  'Privacy Policy': FaShieldAlt ,
  'Today Sermon': FaFileContract,
  'Analytics' : FaChartLine ,
  'Delete My Account' : FaUserSlash,
  'Delete Request Accounts' : FaUserMinus,
};

const NavItem = ({ item }) => {
  const 
  { 
    title = '', 
    target = '', 
    external = false, 
    url = '', 
    classes = '' 
  } = item;

  const windowSize = useWindowSize();
  const configContext = useContext(ConfigContext);
  const { dispatch } = configContext;

  // Get the appropriate icon based on the title from iconMapping
  const IconComponent = iconMapping[title] || null;

  // Render the item title with the icon if available
  let itemTitle;
  if (IconComponent) {
    itemTitle = (
      <span className="pcoded-mtext">
        <IconComponent style={{ marginRight: '8px', color: 'white' }} />
        {title}
         {/* <hr style={{ 
        margin: '10px 0',
        border: 'none',
        height: '1px',
        backgroundColor: '#ffff'
      }} /> */}
      </span>
    );
  } else {
    itemTitle = title;
  }

  // Set target if specified
  let itemTarget;
  if (target) {
    itemTarget = '_blank';
  }

  // SubContent: For external links or internal navigation
  let subContent;
  if (external) {
    subContent = (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {itemTitle}
        <NavBadge items={item} />
      </a>
    );
  } else {
    subContent = (
      <NavLink to={url} className="nav-link" target={itemTarget}>
        {itemTitle}
        <NavBadge items={item} />
      </NavLink>
    );
  }

  // Main content based on screen size
  let mainContent;
  if (windowSize.width < 992) {
    mainContent = (
      <ListGroup.Item
        as="li"
        bsPrefix=" "
        className={classes}
        onClick={() => dispatch({ type: actionType.COLLAPSE_MENU })}
      >
        {subContent}
      </ListGroup.Item>
    );
  } else {
    mainContent = (
      <ListGroup.Item as="li" bsPrefix=" " className={classes}>
        {subContent}
      </ListGroup.Item>
    );
  }

  return <React.Fragment>{mainContent}</React.Fragment>;
};

// Define PropTypes
NavItem.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    target: PropTypes.string,
    external: PropTypes.bool,
    url: PropTypes.string,
    classes: PropTypes.string,
  }).isRequired,
};

export default NavItem;
