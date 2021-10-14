import {createSlice} from '@reduxjs/toolkit';

export const linkedRes = createSlice({
  name: 'linked',
  initialState: {
    choices: 0,
    types: 0,
  },
  reducers: {
    setChoices: (s,a) => {s.choices = a.payload},
    setTypes: (s,a) => {s.types = a.payload},
  }
})

export const {setChoices, setTypes} = linkedRes.actions

export const linkchoice = (state) => state.linked.choices

export const linktypes = (state) => state.linked.types

export default linkedRes.reducer
