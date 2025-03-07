import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import Typography from '@mui/material/Typography';
import { Breadcrumbs } from '@mui/material';

export default function NavbarBreadcrumbs({ activeItem }: { activeItem: string }) {
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
      sx={{
        margin: '8px',
        '& .MuiBreadcrumbs-separator': {
          color: '#B0B0B0',
          margin: 1,
        },
        '& .MuiBreadcrumbs-ol': {
          alignItems: 'center',
        },
      }}
    >
      <Typography variant="body1">Dashboard</Typography>
      <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
      {activeItem}
      </Typography>
    </Breadcrumbs>
  );
}
