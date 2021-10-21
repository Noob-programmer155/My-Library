import {createSlice} from '@reduxjs/toolkit';

export const profileFunc = createSlice({
  name: 'profile',
  initialState: {
    profile: {
      id: 1,
      name:'Arrijal Amar M',
      email:'Rijal.amar29@gmail.com',
      role:'ADMINISTRATIF',
      image:null,
      imageUrl:null,
    },
    book: [],
  },
  reducers:{
    setProf: (state, value) => {state.profile = value.payload},
    setBooks: (state,value) => {state.book = value.payload}
  }
});

export const {setProf, setBooks} = profileFunc.actions

export const profile = state => state.profile.profile

export const myBook = state => state.profile.book

export default profileFunc.reducer
