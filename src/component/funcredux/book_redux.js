import {createSlice} from '@reduxjs/toolkit';
import gbr from '../other/gambar.png';

export const bookFunc = createSlice({
  name:'book',
  initialState:{
    books: [{id:1,
      title:'Java Programming',
      author: 'Arrijal Amar M',
      publisher: 'AmrTm',
      publishDate: '2021-10-01T21:25',
      description: 'Wsandjag ajsgdu absdja buisbdj asb cha buasj',
      theme: 'COMPUTERS',
      data: null,
      image: gbr,
      favorite: true,
      status: false},
      {id:2,
        title:'Tanah',
        author: 'Ridwan N',
        publisher: 'AmrTm',
        publishDate: '2021-08-05T21:25',
        description: 'shdjsgdyugs sdgfuysdbf sdugcbsd cusdhjfb sdsdb',
        theme: 'SAINS',
        data: null,
        image: gbr,
        favorite: true,
        status: true}],
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
    addBookTheme: (s, a) => {s.bookTheme.push(a.payload)},
    addBookFav: (s, a) => {s.bookFav.push(a.payload)},
    addBookSeller: (s, a) => {s.bookSeller.push(a.payload)},
    removeBookFav: (s, a) => {s.bookFav.splice(s.bookFav.indexOf(a.payload),1)},
    removeBookSeller: (s, a) => {s.bookSeller.splice(s.bookFav.indexOf(a.payload),1)},
  },
})

export const {setBooks, setBookFav, setBookRek, setBookSeller, setBookTheme, addBookFav, addBookSeller, addBookTheme, removeBookFav, removeBookSeller} = bookFunc.actions

export const books = state => state.book.books

export const bookThemes = state => state.book.bookTheme

export const favoriteBooks = state => state.book.bookFav

export const recommendBooks = state => state.book.bookRek

export const myBooks = state => state.book.bookSeller

export default bookFunc.reducer
