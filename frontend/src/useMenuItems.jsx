import { useEffect, useState } from 'react';

const generateMenuItems = (type) => {
  const isSuperAdmin = type === '1';
  const isAdmin = type === '2';
  const isStaff = type === '3';
  const isUser = type === '4';

  const items = [
    {
      id: 'navigation',
      title: '',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/dashboard'
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

      // {
      //   id: 'pages',
      //   title: '',
      //   type: 'group',
      //   icon: 'icon-pages',
      //   children: [
      //     {
      //       id: 'sample-page',
      //       title: 'Manage Profile',
      //       type: 'item',
      //       url: '/view-profile',
      //       classes: 'nav-item',
      //       icon: 'feather icon-sidebar'
      //     }
      //   ]
      // },
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
        id: 'manage-users',
        title: '',
        type: 'group',
        icon: 'Analytics',
        children: [
          {
            id: 'manage-users-item',
            title: 'Analytics',
            type: 'item',
            icon: 'Analytics M',
            url: '/analytics'
          }
        ]
      }



    );
  }

  if (isAdmin) {
    items.push(

      // {
      //   id: 'pages',
      //   title: '',
      //   type: 'group',
      //   icon: 'icon-pages',
      //   children: [
      //     {
      //       id: 'sample-page',
      //       title: 'Manage Profile',
      //       type: 'item',
      //       url: '/profile',
      //       classes: 'nav-item',
      //       icon: 'feather icon-sidebar'
      //     }
      //   ]
      // },
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
      // {
      //   id: 'manage-churches',
      //   title: '',
      //   type: 'group',
      //   icon: 'icon-charts',
      //   children: [
      //     {
      //       id: 'manage-churches-item',
      //       title: 'Today Sermon',
      //       type: 'item',
      //       icon: 'feather icon-pie-chart',
      //       url: '/today-sermons'
      //     }
      //   ]
      // },

      {
        id: 'manage-users',
        title: '',
        type: 'group',
        icon: 'Analytics',
        children: [
          {
            id: 'manage-users-item',
            title: 'Analytics',
            type: 'item',
            icon: 'Analytics M',
            url: '/analytics'
          }
        ]
      },
      {
        id: 'manage-users',
        title: '',
        type: 'group',
        icon: 'Delete Request Accounts',
        children: [
          {
            id: 'manage-users-item',
            title: 'Delete Request Accounts',
            type: 'item',
            icon: 'Analytics M',
            url: '/request-accounts'
          }
        ]
      }

    );
  }

  if (isStaff) {
    items.push(
      // {
      //   id: 'pages',
      //   title: '',
      //   type: 'group',
      //   icon: 'icon-pages',
      //   children: [
      //     {
      //       id: 'sample-page',
      //       title: 'Manage Profile',
      //       type: 'item',
      //       url: '/profile',
      //       classes: 'nav-item',
      //       icon: 'feather icon-sidebar'
      //     }
      //   ]
      // },
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
      // {
      //   id: 'pages',
      //   title: '',
      //   type: 'group',
      //   icon: 'icon-pages',
      //   children: [
      //     {
      //       id: 'sample-page',
      //       title: 'Manage Profile',
      //       type: 'item',
      //       url: '/profile',
      //       classes: 'nav-item',
      //       icon: 'feather icon-sidebar'
      //     }
      //   ]
      // },
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


      {
        id: 'manage-users',
        title: '',
        type: 'group',
        icon: 'icon-group',
        children: [
          {
            id: 'manage-users-item',
            title: 'Delete My Account',
            type: 'item',
            icon: 'feather icon-server',
            url: '/request-delete'
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

  useEffect(() => {
    const updateMenuItems = () => {
      const userType = localStorage.getItem('userType');
      console.log("userType", userType);
      setMenuItems(generateMenuItems(userType));
    };
    updateMenuItems();
    // window.addEventListener('storage', updateMenuItems);
    // return () => {
    //   window.removeEventListener('storage', updateMenuItems);
    // };
  }, []);

  return menuItems;
};

export default useMenuItems;


