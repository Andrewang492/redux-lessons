import { createSlice, nanoid } from "@reduxjs/toolkit";
import { sub } from 'date-fns'; //subtract, subtracting 10 minutes.

const initialState = [
    {
        id: '1',
        title: 'Learning Redux Toolkit',
        content: "I've heard good things.",
        date: sub(new Date(), { minutes: 10 }).toISOString(),
        reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
        }
    },
    {
        id: '2',
        title: 'Slices...',
        content: "The more I say slice, the more I want pizza.",
        date: sub(new Date(), { minutes: 5 }).toISOString(),
        reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
        }
    }
]

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        // write function here. createSlice() will create an action creator function with the same name.
        postAdded: {
            reducer(state, action) {
                state.push(action.payload) //payload is the form data when dispatching the postAdded action
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
                const existingPost = state.find(post => post.id === postId)
                if (existingPost) {
                    existingPost.reactions[reaction]++ //mutate state here.
                }
            }
        }
    }
})

export const selectAllPosts = (state) => state.posts; //so that the useSelector will work more often, we jsut change here.

export const { postAdded, reactionAdded } = postsSlice.actions // export the action function created bye createSlice. (or this is called an aciton creator...)

export default postsSlice.reducer