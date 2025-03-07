import { Box, Typography } from '@mui/material';
import { IUser } from '../models/User.interface'
import OptionsMenu from './dasboard/SideMenuOptions';

const UserInfo = ({ firstname, lastname, email }: IUser) => {
  return (
    <>
    <Box sx={{ mr: 'auto' }}>
      <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
        {lastname} {firstname}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {email}
      </Typography>
    </Box>
      <OptionsMenu />
    </>
  );
};

export default UserInfo;
