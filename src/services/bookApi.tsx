import { createApi, CreateApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Book{
  id: number;
  title: string;
  author: string;
  year: number;
  quantity: number;
  price: number;
}

const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3000'}),
  endpoints: (build)=>({
    getBooks: build.query<Book[], string | void>({
      query: (searchTerm)=>
        searchTerm ? `books?search=${searchTerm}` : 'books', 
    }),
  }),
});
export const {useGetBooksQuery} = bookApi;

export default bookApi;