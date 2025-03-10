import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { ChangeEvent } from 'react';
import type { ISearch } from '../models/Search.interface';

export default function Search({ onSearch, placeholder = "Search…", searchService }: ISearch) {

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.trim();
    if (query.length < 3) {
      return;
    }
  
    onSearch(query);
    searchService(query);
  };

  return (
    <FormControl sx={{ width: { xs: '100%', md: '25ch' } , mx:4}} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder={placeholder}
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search',
        }}
        onChange={handleSearch}
      />
    </FormControl>
  );
}
