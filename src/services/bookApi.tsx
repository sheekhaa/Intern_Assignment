import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number ;
  quantity: number ;
  year: number
}

const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000', 
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (build) => ({
  
    getBooks: build.query<Book[], string | void>({
      query: (searchTerm) =>
        searchTerm ? `search?query=${searchTerm}` : 'books',
    
      providesTags: (result) =>
        result ? [{ type: 'Books', id: 'LIST' }] : [],
    }),

    // Update book details
    updateBook: build.mutation<Book, Book>({
      query: (book) => ({
        url: `books/${book.id}`,
        method: 'PUT',
        body: book,
      }),
      // Invalidate the cache to refetch the book list after update
      invalidatesTags: [{ type: 'Books', id: 'LIST' }],
    }),

   
    deleteBook: build.mutation<void, number>({
      query: (id) => ({
        url: `books/${id}`,
        method: 'DELETE',
      }),
      
      invalidatesTags: [{ type: 'Books', id: 'LIST' }],
    }),

    
    createBook: build.mutation<Book, Omit<Book, 'id'>>({
      query: (book) => ({
        url: '/books',
        method: 'POST',
        body: book,
      }),
     
      invalidatesTags: [{ type: 'Books', id: 'LIST' }],
    }),

    
    buyBook: build.mutation<any, { items: Array<{ bookId: number; quantity: number }> }>({
      query: (body) => ({
        url: '/buy',
        method: 'POST',
        body,
      }),
    }),
  }),

 
  tagTypes: ['Books'],
});

export const {
  useGetBooksQuery,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useCreateBookMutation,
  useBuyBookMutation,
} = bookApi;

export default bookApi;
