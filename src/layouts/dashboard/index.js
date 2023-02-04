import { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import LoginDialog from '../../components/LoginComponent';
import { UserContextProvider } from 'src/context/UserContext';
import { UserContext } from '../../context/UserContext';
import { ProfileContextProvider } from 'src/context/ProfileContext';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {

  const [open, setOpen] = useState(false);

  const [valueX, setValueX] = useState(false)

  //set time out 
  setTimeout(()=> {
           //call api
           //check response
           //update user context
  }, 60*60*5*1000)
  

  return (
    <RootStyle>

      <ProfileContextProvider>
        <UserContextProvider>

          <UserContext.Consumer>
            {value => !value.loginStatus && <LoginDialog setValueX = {setValueX} />}
          </UserContext.Consumer>


          <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
          
          <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />

          {
            valueX &&
            <MainStyle sx={{ marginTop: -4 }} >
              <Outlet />
            </MainStyle>
          }


        </UserContextProvider>
      </ProfileContextProvider>

    </RootStyle>
  );
}
