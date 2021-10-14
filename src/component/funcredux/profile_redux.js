import {createSlice} from '@reduxjs/toolkit';

export const profileFunc = createSlice({
  name: 'profile',
  initialState: {
    profile: {
      id:1,
      name:'Arrijal Amar M',
      email:'Rijal.amar29@gmail.com',
      role:'ADMINISTRATIF',
      image:null,
      imageUrl:null,
    },
    book: [],
  },
  reducers:{
    setId: (state, value) => {state.profile.id = value.payload},
    setName: (state, value) => {state.profile.name = value.payload},
    setEmail: (state, value) => {state.profile.email = value.payload},
    setRole: (state, value) => {state.profile.role = value.payload},
    setImage: (state, value) => {state.profile.image = value.payload},
    setImageUrl: (state, value) => {state.profile.imageUrl = value.payload},
    setBooks: (state,value) => {state.book = value.payload}
  }
});

export const {setId, setName, setEmail, setRole, setImage, setImageUrl, setBooks} = profileFunc.actions

export const profile = state => state.profile.profile

export const myBook = state => state.profile.book

export default profileFunc.reducer
