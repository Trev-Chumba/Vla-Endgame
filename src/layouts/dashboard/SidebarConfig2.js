// component
import { Badge } from '@mui/material';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const userType = localStorage.getItem("userType")
console.log('UserType',userType)

const sidebarConfig2 = [
  {
    header : "PROFILE",
    items : [
      {
        title: 'dashboard',
        path:'/dashboard/comm',
        icon: getIcon('eva:pie-chart-2-fill')
      },
      {
        title : 'Search Subject',
        path : '/dashboard/search-subject',
        icon: getIcon('eva:person-fill')
      }, 
      {
        title : 'New Batch',
        path : '/dashboard/search-batch',
        icon: getIcon('eva:people-fill')
      },
      {
        title: 'New Profile',
        path: '/dashboard/profile',
        icon: getIcon('eva:person-fill')
      },
      {
        title : 'All Profiles',
        path : '/dashboard/all-profiles',
        icon: getIcon('eva:person-fill')
      },
      {
        title: 'Batch Profiles',
        path: '/dashboard/my-cases',
        icon: getIcon('eva:person-add-fill')
      },
    
    ]
  },

  // {
  //   header : "INQUIRIES",
  //   items : [
  //     {
  //       title: 'My Inquiries',
  //       path: '/dashboard/my-inquiries',
  //       icon: getIcon('eva:shopping-bag-fill')
  //     },
  //     // {
  //     //   title: 'blog',
  //     //   path: '/dashboard/blog',
  //     //   icon: getIcon('eva:file-text-fill')
  //     // },
  //     // {
  //     //   title: 'login',
  //     //   path: '/login',
  //     //   icon: getIcon('eva:lock-fill')
  //     // },
  //   ]
  // }, 

  {
    header : "CASES",
    items : [
      {
        title: 'My Cases',
        path: '/dashboard/my-inquiries',
        icon: getIcon('eva:shopping-bag-fill')
      },

      {
        title: 'Completed Cases',
        path: '/dashboard/case-history',
        icon: getIcon('eva:list-fill'),
      },
      // {
      //   title: 'Not found',
      //   path: '/404',
      //   icon: getIcon('eva:alert-triangle-fill')
      // }
    ]
  },

  {
    header : "TASKS",
    items : [
      {
        title: 'My Tasks',
        path: '/dashboard/my-tasks',
        icon: getIcon('eva:list-fill'),
      },
        
    ]
  },


  {
    header : "USER MANAGEMENT",
    items : [
      {
        title: 'Add User',
        path: '/dashboard/add-user',
        icon: getIcon('eva:person-add-fill')
      },
      {
        title: 'View Users',
        path: '/dashboard/user',
        icon: getIcon('eva:alert-triangle-fill')
      },
      {
        title: 'Access Management',
        path: '/dashboard/access-management',
        icon: getIcon('eva:alert-triangle-fill')
      },
     
    ]
  },

  {
    header : "SYSTEM",
    items : [
      {
        title: 'Audit Trail',
        path: '/dashboard/audit-trail',
        icon: getIcon('eva:alert-triangle-outline')
      }
    ]
  }
]

export default sidebarConfig2;
