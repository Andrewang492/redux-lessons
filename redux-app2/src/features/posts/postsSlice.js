import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from 'date-fns'; //subtract, subtracting 10 minutes.
import axios from 'axios';

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';


const initialState = {
    posts: [], // in contrast to first, we must push to this part posts.
    status: 'idle', //'idle', 'loading', 'succeeded', 'failed'
    error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get(POSTS_URL)
    return [...response.data]
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        // write function here. createSlice() will create an action creator function with the same name.
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload) //payload is the form data when dispatching the postAdded action
                // does not actually mutate state. You should never mutate state except in this file but like so.
                // i'm guessing this pushing only happens after prepare().
            },
            prepare(title, content, userId) {
                // prepare: sets up new post.
                return {
                    payload: {
                        id: nanoid(), 
                        title,
                        content,
                        date: new Date().toISOString(), //creating a timestamp
                        userId,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                }
            } // now we have a prepare function for the whole postAdded reducer function
        },
        // another reducer: (doesn't need prepare)
        reactionAdded: {
            reducer(state, action) {
                const { postId, reaction } = action.payload
                const existingPost = state.posts.find(post => post.id === postId)
                if (existingPost) {
                    existingPost.reactions[reaction]++ //mutate state here.
                }
            }
        }
    },
    // when you need to respond to something not part of the reducers, use extraReducers
    extraReducers(builder) {
        //builder parameter is an object that allows different case reducers which run in response to actions outside of slice.
        builder
            .addCase(fetchPosts.pending, (state, action) => {                    
                // if pending, set our status to loading.
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Adding date and reactions since the API doesn't have it.
                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });

                // Add any fetched posts to the array
                state.posts = state.posts.concat(loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                // Fix for API post IDs:
                // Creating sortedPosts & assigning the id 
                // would be not be needed if the fake API 
                // returned accurate new post IDs
                const sortedPosts = state.posts.sort((a, b) => {
                    if (a.id > b.id) return 1
                    if (a.id < b.id) return -1
                    return 0
                })
                action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
                // End fix for fake API post IDs 

                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                console.log(action.payload)
                state.posts.push(action.payload)
            })
    }
})

export const selectAllPosts = (state) => state.posts.posts; //so that the useSelector will work more often, we jsut change here.
                                                // state.posts is the array, .posts again is the slice name????????
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

export const { postAdded, reactionAdded } = postsSlice.actions // export the action function created bye createSlice. (or this is called an aciton creator...)

export default postsSlice.reducer