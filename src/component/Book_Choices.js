import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {setChoices, linkchoice} from './funcredux/linkedRes';
import {favoriteBooks, recommendBooks, myBooks, books, setBooks, setBookFav, setBookRek, setBookSeller} from './funcredux/book_redux';
import BookView from './subcomponent/Book_view';
import {Box, Typography, Skeleton, Stack, IconButton, Tabs, Tab} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import StarsIcon from '@mui/icons-material/Stars';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookIcon from '@mui/icons-material/Book';

import {makeStyles} from '@mui/styles';
import {createTheme} from '@mui/material/styles';

const theme = createTheme();

const useStyle = makeStyles({
  root:{
    background: '#009999',
    display: 'none',
    paddingTop: '10px',
    marginLeft: '10px',
    width:'100%',
    paddingBottom: '20px',
    color:'#ffff',
    [theme.breakpoints.up('md')]:{
      display: 'block',
    },
  },
  mobile: {
    minWidth:'100vw',
    display:'block',
    [theme.breakpoints.up('md')]:{
      display: 'none',
    },
  },
  text: {
    paddingBottom: '8px',
    color: '#ffff',
    fontFamily: 'Segoe UI',
  },
  scroll: {
    maxWidth:'100%',
    overflow: 'auto',
    marginBottom:'8px',
    marginRight: '10px',
    '&::-webkit-scrollbar': {
      backgroundColor: 'rgba(0, 32, 128, 0.3)',
      paddingTop: '12px',
      borderRadius: '20px',
      height: '8px',
    },
    '&::-webkit-scrollbar-button':{
      display: 'none',
    },
    '&::-webkit-scrollbar-thumb':{
      background: '#002080',
      borderRadius: '20px',
    },
  }
})

export default function BookChoice() {
  const style = useStyle();
  const {format} = require('date-fns');
  const favBuku = useSelector(favoriteBooks);
  const recBuku = useSelector(recommendBooks);
  const myBuku = useSelector(myBooks);
  const buku = useSelector(books);
  const link = useSelector(linkchoice);
  const dispatch = useDispatch();
  var choice = (ds) => {
    return {
      id: `mob-cho-${ds}`,
      'aria-controls': `btn-Cho-${ds}`
    }
  }
  useEffect(()=>{
    if(buku.length > 0){
      let bookfav = buku.filter(by => by.favorite === true)
      if(bookfav){dispatch(setBookFav(bookfav))}
    }
    if(buku.length > 0) {
      if(buku.length > 10){
        let bookrek = buku.slice(0, 10)
        if(bookrek){dispatch(setBookRek(bookrek))}
      }
      else{
        let bookrek2 = buku.slice(0, buku.length)
        if(bookrek2){dispatch(setBookRek(bookrek2))}
      }
    }
    if(buku.length > 0) {
      let bookmy = buku.filter(by => by.status === true)
      if(bookmy){dispatch(setBookSeller(bookmy))}
    }
  },[buku])
  const handleChange = (a,n) =>{
    dispatch(setChoices(n))
  }
  return(
    <>
      <Box className={style.root}>
        <Typography className={style.text}>Recommended Books</Typography>
        <Stack direction='row' spacing={1} className={style.scroll}>
          {(recBuku.length===0)?(
            [1,2,3,4,5,6,7,8,9,10].map((a,i) => {
              return(<BookView key={i} id={null}/>)
            })
          ):(
            recBuku.map((a,i) => {
              return(<BookView key={i} id={a.id} title={a.title} author={a.author} image={a.image}
                publisher={a.publisher} date={format(new Date(a.publishDate), 'dd-MM-yyyy')} description={a.description} theme={a.theme} data={a.data} favorite={a.favorite}/>)
            })
          )}
        </Stack>
        <Typography className={style.text}>Favorite Books</Typography>
        <Stack direction='row' spacing={1} className={style.scroll}>
          {(favBuku.length===0)?(
            [1,2,3,4,5,6,7,8,9,10].map((a,i) => {
              return(<BookView key={i} id={null}/>)
            })
          ):(
            favBuku.map((a,i) => {
              return(<BookView key={i} id={a.id} title={a.title} author={a.author} image={a.image}
                publisher={a.publisher} date={format(new Date(a.publishDate), 'dd-MM-yyyy')} description={a.description} theme={a.theme} data={a.data} favorite={a.favorite}/>)
            })
          )}
        </Stack>
        <Typography className={style.text}>My Books</Typography>
        <Stack direction='row' spacing={1} className={style.scroll}>
          {(myBuku.length===0)?(
            [1,2,3,4,5,6,7,8,9,10].map((a,i) => {
              return(<BookView key={i} id={null}/>)
            })
          ):(
            myBuku.map((a,i) => {
              return(<BookView key={i} id={a.id} title={a.title} author={a.author} image={a.image}
                publisher={a.publisher} date={format(new Date(a.publishDate), 'dd-MM-yyyy')} description={a.description} theme={a.theme} data={a.data} favorite={a.favorite}/>)
            })
          )}
        </Stack>
      </Box>
      <Tabs variant='fullWidth' className={style.mobile} value={link} onChange={handleChange}
        textColor='inherit' indicatorColor="secondary">
        {
            [<StarsIcon fontSize='small'/>, <FavoriteIcon fontSize='small'/>, <BookIcon fontSize='small'/>, <LibraryBooksIcon fontSize='small'/>].map((a,i) => (
              <Tab sx={{color:'#ffff'}} icon={a} {...choice(i)}/>
            ))
        }
      </Tabs>
    </>
  );
}
