import { Typography, Box, Container } from '@mui/material';
import Dashboard from '../../assets/dashboard.svg';

const DashboardHome = () => {
    return (
        <Container sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" height="100%" width="100%">
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to your dashboard!
                </Typography>
                <img src={Dashboard} alt="Welcome" style={{ maxWidth: '50%', maxHeight: '50%', width: 'auto', height: 'auto' }} />
            </Box>
        </Container>
    );
};

export default DashboardHome;