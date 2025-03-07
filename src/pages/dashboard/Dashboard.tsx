import Box from '@mui/material/Box';
import SideMenu from '../../components/dasboard/SideMenu';
import NavbarBreadcrumbs from '../../components/dasboard/NavbarBreadcrumbs';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

export default function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <SideMenu onSelect={setActivePage} />
      
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <NavbarBreadcrumbs activeItem={activePage} />
        
        <Box sx={{ 
          flexGrow: 1,
          p: 3 ,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
