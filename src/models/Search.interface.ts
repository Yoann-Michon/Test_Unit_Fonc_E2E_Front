export interface ISearch {
    onSearch: (query: string) => void;
    placeholder?: string;
    searchService: (query: string) => Promise<any>;
  }