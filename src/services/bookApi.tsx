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
  baseQuery: fetchBaseQuery
    ({baseUrl: 'http://localhost:3000',
      prepareHeaders: (headers)=>{
        const token = localStorage.getItem('token');
        if(token){
          headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
      }
    }),
 
  endpoints: (build)=>({
    getBooks: build.query<Book[], string | void>({
      query: (searchTerm)=>
        searchTerm ? `search?query=${searchTerm}` : 'books', 
    }),

    updateBook: build.mutation<Book, Book>({
      query: (book)=>({
        url: `books/${book.id}`,
        method: 'PUT',
        body: {
          title: book.title,
          author: book.author,
          year: book.year,
          quantity: book.quantity,
          price: book.price
        }
      }),
    }),

    deleteBook: build.mutation<void, number>({
      query: (id)=> ({
        url: `books/${id}`,
        method: 'DELETE',
      }),      
    }),

    createBook: build.mutation<Book, Omit<Book, 'id'>>({
      query: (book)=>({
        url: '/books',
        method: 'POST',
        body: book,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    }),
    buyBook: build.mutation<any,{ items: Array<{bookId: number; quantity: number}>}>({
      query: (body)=> ({
        url: '/buy',
        method: 'POST',        
        body,
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      })
    })

  }),
});
export const {useGetBooksQuery, useUpdateBookMutation, useDeleteBookMutation, useCreateBookMutation, useBuyBookMutation} = bookApi;

export default bookApi;