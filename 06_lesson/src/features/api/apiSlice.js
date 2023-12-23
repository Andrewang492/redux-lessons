import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// the tags are important for caches.
// if you don't have them, results get cached and previous caches do not get invalidated.

// it is not updating to show new changes delete, update etc. sicne we only see cached data.
// We must assign a tag to the cache, then let it know what mutations invalidate the cahce,
// so it will automatically refecth the data for us, and cause re render.
export const apiSlice = createApi({
    reducerPath: 'api', //name
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
    tagTypes: ['Todos'],
    endpoints: (builder) => ({
        getTodos: builder.query({
            query: () => '/todos',
            transformResponse: res => res.sort((a, b) => b.id - a.id), // an option to let us sort. Like
            providesTags: ['Todos']
        }),
        addTodo: builder.mutation({ // mutation, not query, because we change.
            query: (todo) => ({
                url: '/todos',
                method: 'POST',
                body: todo
            }),
            invalidatesTags: ['Todos']
        }),
        updateTodo: builder.mutation({
            query: (todo) => ({
                url: `/todos/${todo.id}`,
                method: 'PATCH',
                body: todo
            }),
            invalidatesTags: ['Todos']
        }),
        deleteTodo: builder.mutation({
            query: ({ id }) => ({
                url: `/todos/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['Todos']
        }),
    })
})

export const {
    useGetTodosQuery, // RTK query creates custom hooks based on our name getTodos
    useAddTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation
} = apiSlice // our hooks we can export.