import {createSlice} from '@reduxjs/toolkit';

export const profileFunc = createSlice({
  name: 'profile',
  initialState: {
    profile: {
      id: 1,
      name:'Arrijal Amar M',
      email:'Rijal.amar29@gmail.com',
      role:'ANON',
      imageUrl:null,
    },
    online : false,
  },
  reducers:{
    setProf: (state, value) => {state.profile = value.payload},
    setOnline: (state, value) => {state.online = value.payload},
  }
});

export const {setProf, setOnline} = profileFunc.actions

export const profile = state => state.profile.profile

export const userOnline = state => state.profile.online

export default profileFunc.reducer
