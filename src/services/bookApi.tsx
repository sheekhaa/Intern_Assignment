import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

    updateBook: build.mutation<Book, Book>({
      query: (book)=>({
        url: `books/${book.id}`,
        method: 'PUT',
        body: book,
      }),
    }),

    deleteBook: build.mutation<void, number>({
      query: (id)=> ({
        url: `books/${id}`,
        method: 'DELETE',
      }),
      
    }),
  }),
});
export const {useGetBooksQuery, useUpdateBookMutation, useDeleteBookMutation} = bookApi;

export default bookApi;