import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate, useLocation  } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';

// AuthGuard component to protect routes
const AuthGuard = ({ children }) => {
  const location = useLocation();
  // console.log("location", location)
  const isAuthenticated = !!localStorage.getItem('userEmail');
  console.log("isAuthenticated Check", isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

// GuestGuard component to prevent authenticated users from accessing login/signup
const GuestGuard = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('userEmail');
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};


export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    guard: GuestGuard,
    path: '/',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    guard: GuestGuard,
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    guard: GuestGuard,
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    path: '*',
    guard: AuthGuard,
    layout: AdminLayout,
    routes: [
      {
       
        exact: 'true',
        path: '/dashboard',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
      
        path: '/basic/button',
        element: lazy(() => import('./views/ui-elements/basic/BasicButton'))
      },
      {
        exact: 'true',
       
        path: '/basic/badges',
        element: lazy(() => import('./views/ui-elements/basic/BasicBadges'))
      },
      {
        exact: 'true',
       
        path: '/basic/breadcrumb-paging',
        element: lazy(() => import('./views/ui-elements/basic/BasicBreadcrumb'))
      },
      {
        exact: 'true',
     
        path: '/basic/collapse',
        element: lazy(() => import('./views/ui-elements/basic/BasicCollapse'))
      },
      {
        exact: 'true',
 
        path: '/basic/tabs-pills',
        element: lazy(() => import('./views/ui-elements/basic/BasicTabsPills'))
      },
      {
        exact: 'true',
    
        path: '/basic/typography',
        element: lazy(() => import('./views/ui-elements/basic/BasicTypography'))
      },
      // {
      //   exact: 'true',
      //   path: '/profile',
     
      //   element: lazy(() => import('./views/Profiles/Profiles'))
      // },
      {
        exact: 'true',
        path: '/profile',
     
        element: lazy(() => import('./views/Profile/Profile'))
      },
      {
        exact: 'true',
        path: '/view-profile',
     
        element: lazy(() => import('./views/Profile/SuperAdminProfile'))
      },
      {
        exact: 'true',
  
        path: '/administrators',
        element: lazy(() => import('./views/Administrators/Administrator'))
      },
      {
        exact: 'true',
  
        path: '/church',
        element: lazy(() => import('./views/ManageChurch/ManageChurch'))
      },
      {
        exact: 'true',
  
        path: '/events',
        element: lazy(() => import('./views/ManageEvents/ManageEvent'))
      },
      {
        exact: 'true',
  
        path: '/analytics',
        element: lazy(() => import('./views/AnalyticsMenu/Analytics'))
      },
      {
        exact: 'true',
  
        path: '/user/events',
        element: lazy(() => import('./views/userEvents/userEvents'))
      },
      {
        exact: 'true',
  
        path: '/admin/events',
        element: lazy(() => import('./views/adminEvents/adminEvents'))
      },
      {
        exact: 'true',
  
        path: '/real-time-sermon-translation',
        element: lazy(() => import('./views/GoLives/GoLive'))
      },
      {
        exact: 'true',
  
        path: '/today-sermons',
        element: lazy(() => import('./views/dashboard/index.jsx'))
      },
      {
        exact: 'true',
  
        path: '/live-sermon-translator',
        element: lazy(() => import('./views/JoinLiveSermons/JoinLiveSermon'))
      },
      {
        exact: 'true',
  
        path: '/daily-devotionals',
        element: lazy(() => import('./views/DailyDevotionals/DailyDevotional'))
      },
      {
        exact: 'true',
  
        path: '/prayer-requests',
        element: lazy(() => import('./views/PrayerRequests/PrayerRequest'))
      },
      {
        exact: 'true',
  
        path: '/donate',
        element: lazy(() => import('./views/Donates/Donate'))
      },
      
      {
        exact: true,
 
        path: '/churches',
        element: lazy(() => import('./views/charts/Church')),
      },
      {
        exact: 'true',
     
        path: '/staff-members',
        element: lazy(() => import('./views/StaffMembers/StaffMember'))
      },
      {
        exact: 'true',

        path: '/users',
        element: lazy(() => import('./views/Users/User'))
      },
      {
        exact: 'true',

        path: '/privacy-policy',
        element: lazy(() => import('./views/PrivacyPolicy/PrivacyPolicy'))
      },
      {
        exact: 'true',

        path: '/request-delete',
        element: lazy(() => import('./views/AccountManage/delete'))
      },
      {
        exact: 'true',

        path: '/request-accounts',
        element: lazy(() => import('./views/DeleteRequest/AccountRequests'))
      },
<<<<<<< HEAD
=======



>>>>>>> 9d8938c (latest code pushed to git)
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
