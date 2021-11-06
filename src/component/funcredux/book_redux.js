import {createSlice} from '@reduxjs/toolkit';
import gbr from '../other/gambar.png';

export const bookFunc = createSlice({
  name:'book',
  initialState:{
    books: [{id:'11:gy2g',
      title:'Java Programming',
      author: 'Arrijal Amar M',
      publisher: 'AmrTm',
      publishDate: '2021-10-01T21:25',
      description: 'Wsandjag ajsgdu absdja buisbdj asb cha buasj huibuias iasj iash uhsaui uasbu gusag usauig usag uygsu gydsuv usdgy guydsvh vdshv yusd vgyusdv usdg yubsdui gyusdg fuysdgu ygysduv ytvsdhgyusdv uydsgu ihsdu bsdg yusdgu bsd usgd hgsdu giusdg usgyu gsdu fyusfdfusid guisdg uisdg uisg iusdg iugsdiu gisd isd giusdg usdg uisbdu igsdiu gsdiu gsiudg iusdg iusdg ui',
      theme: ['COMPUTERS','PROGRAMMING LANGUAGE'],
      data: null,
      image: gbr,
      favorite: true,
      status: false},
      {id:'12:gy2y',
        title:'Tanah',
        author: 'Ridwan N',
        publisher: 'AmrTm',
        publishDate: '2021-08-05T21:25',
        description: 'shdjsgdyugs sdgfuysdbf sdugcbsd cusdhjfb sdsdb',
        theme: ['SAINS','GEOGRAPHICS'],
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
  },
})

export const {setBooks, setBookFav, setBookRek, setBookSeller, setBookTheme} = bookFunc.actions

export const books = state => state.book.books

export const bookThemes = state => state.book.bookTheme

export const favoriteBooks = state => state.book.bookFav

export const recommendBooks = state => state.book.bookRek

export const myBooks = state => state.book.bookSeller

export default bookFunc.reducer
