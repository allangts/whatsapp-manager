import { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, IconButton, Box, Chip } from '@mui/material';
import { Menu as MenuIcon, Home as HomeIcon, Message as MessageIcon } from '@mui/icons-material';
import AlarmIcon from '@mui/icons-material/Alarm';
import emeronLogo from '../logo.png'; // Certifique-se de que o caminho da imagem esteja correto

const drawerWidth = 240;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/ping');
        if (response.ok) {
          setApiOnline(true);
        } else {
          setApiOnline(false);
        }
      } catch (error) {
        setApiOnline(false);
      }
    };

    checkApiStatus();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItem button component="a" href="/" onClick={() => setMobileOpen(false)}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Session Manager" />
        </ListItem>
        <ListItem button component="a" href="/message" onClick={() => setMobileOpen(false)}>
          <ListItemIcon>
            <MessageIcon />
          </ListItemIcon>
          <ListItemText primary="Disparar Mensagem" />
        </ListItem>
        <ListItem button component="a" href="/reminder" onClick={() => setMobileOpen(false)}>
          <ListItemIcon>
            <AlarmIcon />
          </ListItemIcon>
          <ListItemText primary="Agendar Mensagem" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              component="img"
              src={emeronLogo}
              alt="Emeron Logo"
              sx={{ width: '7%', mr: 'auto' }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Chip
              label={apiOnline ? 'API Online' : 'API Offline'}
              sx={{
                backgroundColor: apiOnline ? '#4CAF50' : '#f44336',
                color: 'white',
                borderRadius: '20px',
                padding: '4px 8px', // Ajuste o padding para reduzir o tamanho do Chip
                fontSize: '0.8rem',
                height: '24px', // Ajuste a altura do Chip
                '& .MuiChip-label': {
                  padding: '0px', // Remove o padding interno do texto do Chip
                },
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default Navbar;
