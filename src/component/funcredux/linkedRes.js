import {createSlice} from '@reduxjs/toolkit';

export const linkedRes = createSlice({
  name: 'linked',
  initialState: {
    booklink: 4,
    initstatechoicebook: 4,
  },
  reducers: {
    setBookLink: (s,a) => {s.booklink = a.payload},
  }
})

export const {setBookLink} = linkedRes.actions

export const linkbook = (state) => state.linked.booklink

export const initbooklink = (state) => state.linked.initstatechoicebook

export default linkedRes.reducer
