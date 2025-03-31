import { useEffect, useState } from 'react';

const generateMenuItems = (type, isDarkMode) => {
  const isSuperAdmin = type === '1';
  const isAdmin = type === '2';
  const isStaff = type === '3';
  const isUser = type === '4';
  // Base styles for dark/light mode
  const baseStyle = isDarkMode ? {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    borderColor: '#333'
  } : {
    backgroundColor: '#ffffff',
    color: '#000000',
    borderColor: '#dee2e6'
  };
  const items = [
    {
      id: 'navigation',
      title: '',
      type: 'group',
      icon: 'icon-navigation',
      style: baseStyle,
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/dashboard',
          style: baseStyle
        }
      ]
    },
    {
      id: 'ui-forms',
      title: '',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'forms',
          title: 'Manage Profile',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/profile'
        }
      ]
    }
  ];

  if (isSuperAdmin) {
    items.push(
      {
        id: 'pages',
        title: '',
        type: 'group',
        icon: 'icon-pages',
        children: [
          {
            id: 'sample-page',
            title: 'Manage Administrators',
            type: 'item',
            url: '/administrators',
            classes: 'nav-item',
            icon: 'feather icon-sidebar'
          }
        ]
      },
      {
        id: 'manage-staff',
        title: '',
        type: 'group',
        icon: 'icon-charts',
        children: [
          {
            id: 'manage-staff-item',
            title: 'Manage Staff Members',
            type: 'item',
            icon: 'feather icon-map',
            url: '/staff-members'
          }
        ]
      },
      {
        id: 'manage-users',
        title: '',
        type: 'group',
        icon: 'icon-group',
        children: [
          {
            id: 'manage-users-item',
            title: 'Manage Users',
            type: 'item',
            icon: 'feather icon-server',
            url: '/users'
          }
        ]
      },
      {
        id: 'manage-churches',
        title: '',
        type: 'group',
        icon: 'icon-charts',
        children: [
          {
            id: 'manage-churches-item',
            title: 'Manage Churches',
            type: 'item',
            icon: 'feather icon-pie-chart',
            url: '/churches'
          }
        ]
      }

      
      
    );
  }

  if (isAdmin) {
    items.push(
      {
        id: 'manage-churches',
        title: '',
        type: 'group',
        icon: 'icon-charts',
        children: [
          {
            id: 'manage-churches-item',
            title: 'Manage Church',
            type: 'item',
            icon: 'feather icon-pie-chart',
            url: '/church'
          }
        ]
      },
      {
        id: 'manage-staff',
        title: '',
        type: 'group',
        icon: 'icon-charts',
        children: [
          {
            id: 'manage-staff-item',
            title: 'Manage Staff Members',
            type: 'item',
            icon: 'feather icon-map',
            url: '/staff-members'
          }
        ]
      },

      {
        id: 'manage-users',
        title: '',
        type: 'group',
        icon: 'icon-group',
        children: [
          {
            id: 'manage-users-item',
            title: 'Manage Users',
            type: 'item',
            icon: 'feather icon-server',
            url: '/users'
          }
        ]
      },
      {
        id: 'manage-users',
        title: '',
        type: 'group',
        icon: 'icon-group',
        children: [
          {
            id: 'manage-users-item',
            title: 'Manage Events',
            type: 'item',
            icon: 'feather icon-server',
            url: '/events'
          }
        ]
      },
      
      {
        id: 'manage-churches',
        title: '',
        type: 'group',
        icon: 'icon-charts',
        children: [
          {
            id: 'manage-churches-item',
            title: 'Go Live',
            type: 'item',
            icon: 'feather icon-pie-chart',
            url: '/real-time-sermon-translation'
          }
        ]
      },
      {
        id: 'manage-churches',
        title: '',
        type: 'group',
        icon: 'icon-charts',
        children: [
          {
            id: 'manage-churches-item',
            title: 'Today Sermon',
            type: 'item',
            icon: 'feather icon-pie-chart',
            url: '/today-sermons'
          }
        ]
      },
      
    );
  }

  if (isStaff) {
    items.push(
      {
        id: 'manage-users',
        title: '',
        type: 'group',
        icon: 'icon-group',
        children: [
          {
            id: 'manage-users-item',
            title: 'Manage Users',
            type: 'item',
            icon: 'feather icon-server',
            url: '/users'
          }
        ]
      },
      {
        id: 'manage-users',
        title: '',
        type: 'group',
        icon: 'icon-group',
        children: [
          {
            id: 'manage-users-item',
            title: 'Manage Events',
            type: 'item',
            icon: 'feather icon-server',
            url: '/events'
          }
        ]
      },
      {
        id: 'manage-churches',
        title: '',
        type: 'group',
        icon: 'icon-charts',
        children: [
          {
            id: 'manage-churches-item',
            title: 'Go Live',
            type: 'item',
            icon: 'feather icon-pie-chart',
            url: '/real-time-sermon-translation'
          }
        ]
      },
  );
  }

  if (isUser) {
    items.push(
    {
      id: 'manage-users',
      title: '',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'manage-users-item',
          title: 'Join Live Sermons',
          type: 'item',
          icon: 'feather icon-server',
          url: '/live-sermon-translator'
        }
      ]
    },
    {
      id: 'manage-users',
      title: '',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'manage-users-item',
          title: 'Events',
          type: 'item',
          icon: 'feather icon-server',
          url: '/user/events'
        }
      ]
    },
    {
      id: 'manage-users',
      title: '',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'manage-users-item',
          title: 'Privacy Policy',
          type: 'item',
          icon: 'feather icon-server',
          url: '/privacy-policy'
        }
      ]
    },
    // {
    //   id: 'manage-users',
    //   title: '',
    //   type: 'group',
    //   icon: 'icon-group',
    //   children: [
    //     {
    //       id: 'manage-users-item',
    //       title: 'prayer-requests',
    //       type: 'item',
    //       icon: 'feather icon-server',
    //       url: '/prayer-requests'
    //     }
    //   ]
    // },
    // {
    //   id: 'manage-users',
    //   title: '',
    //   type: 'group',
    //   icon: 'icon-group',
    //   children: [
    //     {
    //       id: 'manage-users-item',
    //       title: 'Daily Devotional',
    //       type: 'item',
    //       icon: 'feather icon-server',
    //       url: '/daily-devotionals'
    //     }
    //   ]
    // },
    // {
    //   id: 'manage-users',
    //   title: '',
    //   type: 'group',
    //   icon: 'icon-group',
    //   children: [
    //     {
    //       id: 'manage-users-item',
    //       title: 'Manage Prayer Request',
    //       type: 'item',
    //       icon: 'feather icon-server',
    //       url: '/prayer-requests'
    //     }
    //   ]
    // },
    // {
    //   id: 'manage-users',
    //   title: '',
    //   type: 'group',
    //   icon: 'icon-group',
    //   children: [
    //     {
    //       id: 'manage-users-item',
    //       title: 'Manage Donate',
    //       type: 'item',
    //       icon: 'feather icon-server',
    //       url: '/donate'
    //     }
    //   ]
    // }
  );
  }

  return items;
};

const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const updateMenuItems = () => {
      const userType = localStorage.getItem('userType');
      setMenuItems(generateMenuItems(userType, isDarkMode));
    };
    updateMenuItems();
  }, [isDarkMode]); // Re-run when dark mode changes

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Optional: Save preference to localStorage
    localStorage.setItem('darkMode', !isDarkMode);
  };

  // Dark mode toggle button component
  const DarkModeToggle = () => (
    <button
      onClick={toggleDarkMode}
      style={{
        padding: '8px 16px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        border: `1px solid ${isDarkMode ? '#333' : '#dee2e6'}`,
        transition: 'all 0.3s ease',
        marginBottom: '15px'
      }}
    >
      {isDarkMode ? (
        <>
          <FaSun size={16} color="#FFD700" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <FaMoon size={16} color="#6c757d" />
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );

  // Apply dark mode styles to menu items
  const styledMenuItems = menuItems.map(item => ({
    ...item,
    style: {
      backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
      borderColor: isDarkMode ? '#333' : '#dee2e6',
      transition: 'all 0.3s ease'
    },
    children: item.children?.map(child => ({
      ...child,
      style: {
        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        transition: 'all 0.3s ease'
      }
    }))
  }));

  return {
    menuItems: styledMenuItems,
    DarkModeToggle,
    isDarkMode
  };
};

export default useMenuItems;