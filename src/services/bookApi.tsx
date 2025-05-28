import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number | string;
  quantity: number | string;
  year: number
}

// Define a type for the tag
type BookTag = { type: 'Books'; id: 'LIST' | number };

const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000', // Your API base URL
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (build) => ({
    // Get books with optional search term
    getBooks: build.query<Book[], string | void>({
      query: (searchTerm) =>
        searchTerm ? `search?query=${searchTerm}` : 'books',
      // Correctly typed providesTags
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

    // Delete a book
    deleteBook: build.mutation<void, number>({
      query: (id) => ({
        url: `books/${id}`,
        method: 'DELETE',
      }),
      // Invalidate the cache to refetch the book list after deletion
      invalidatesTags: [{ type: 'Books', id: 'LIST' }],
    }),

    // Create a new book
    createBook: build.mutation<Book, Omit<Book, 'id'>>({
      query: (book) => ({
        url: '/books',
        method: 'POST',
        body: book,
      }),
      // Invalidate the cache to refetch the book list after creation
      invalidatesTags: [{ type: 'Books', id: 'LIST' }],
    }),

    // Buy books (add to cart)
    buyBook: build.mutation<any, { items: Array<{ bookId: number; quantity: number }> }>({
      query: (body) => ({
        url: '/buy',
        method: 'POST',
        body,
      }),
    }),
  }),

  // Add custom tag type to be used throughout the API
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
