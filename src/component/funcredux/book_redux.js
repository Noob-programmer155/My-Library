import {createSlice} from '@reduxjs/toolkit';
import gbr from '../other/gambar.png';

export const bookFunc = createSlice({
  name:'book',
  initialState:{
    books: [],
    bookFav: [],
    bookRek: [],
    bookSeller: [],
    bookTheme: [],
  },
  reducers:{
    setBooks: (s, a) => {s.books = a.payload},
    setBookRek: (s, a) => {s.bookRek = a.payload},
    setBookFav: (s, a) => {s.bookFav = a.payload},
    setBookSeller: (s, a) => {s.bookSeller = a.payload},
    setBookTheme: (s, a) => {s.bookTheme = a.payload},
  },
})

export const {setBooks, setBookFav, setBookRek, setBookSeller, setBookTheme} = bookFunc.actions

export const books = state => state.book.books

export const bookThemes = state => state.book.bookTheme

export const favoriteBooks = state => state.book.bookFav

export const recommendBooks = state => state.book.bookRek

export const myBooks = state => state.book.bookSeller

export default bookFunc.reducer
