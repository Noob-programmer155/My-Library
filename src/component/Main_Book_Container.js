import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {profile} from './funcredux/profile_redux';
import {linkbook, initbooklink} from './funcredux/linkedRes';
import axios from 'axios'
import {books, setBooks, bookThemes, favoriteBooks, recommendBooks, myBooks} from './funcredux/book_redux';
import {Box, TextField, Typography, Stack, IconButton, useMediaQuery} from '@mui/material';
import {mainBookURL,mainBookUserURL} from './constant/constantDataURL';
import {Search, Container} from './subcomponent/otherComponent'
import TypeContainer from './Type_book';

export default function MainContainer(props) {
  const {onerror} = props;
  const prof = useSelector(profile);
  var buku = useSelector(books);
  var favBuku = useSelector(favoriteBooks);
  var recBuku = useSelector(recommendBooks);
  var myBuku = useSelector(myBooks);
  const themes = useSelector(bookThemes);
  const link = useSelector(linkbook);
  const initlink = useSelector(initbooklink);
  const dispatch = useDispatch();
  const md = useMediaQuery('(min-width:900px)')
  useEffect(()=>{
    if(prof !== null){
      if (prof.role !== 'ANON'){
        axios.get(mainBookUserURL,{
          withCredentials:true,
          params: {
            idUs: prof.id,
          },
        }).then(a => a.data !== null? dispatch(setBooks(a.data)):onerror("there is a network error"))
          .catch(err => onerror(err.message));
      }
      else {
        axios.get(mainBookURL,{
          withCredentials:true,
        }).then(a => a.data !== null? dispatch(setBooks(a.data)):onerror("there is a network error"))
          .catch(err => onerror(err.message));
      }
    }
    else{
      axios.get(mainBookURL,{
        withCredentials:true,
      }).then(a => a.data !== null? dispatch(setBooks(a.data)):onerror("there is a network error"))
        .catch(err => onerror(err.message));
    }
  },[prof])
  return(
    <Box sx={{marginTop:'20px'}}>
      <Box>
        <Search/>
      </Box>
      <Box>
        <TypeContainer style={{display:(md)?'none':'flex'}}/>
        <Box display='flex' flexWrap='wrap' sx={{paddingLeft:'10px', marginTop:'20px', maxWidth:'100%', maxHeight:'500px', overflow:'auto'}}>
        {
          (buku)? (
            [recBuku,favBuku,myBuku,buku].map((a,i) => (
                <Container index={i} ids='btn-Cho-' reverseids='mob-cho-' value={link} data={a}/>
              ))
          ):(<></>)
        }
        {
          (themes)? (
            themes.map((a,i) => (
              <Container index={initlink+i} ids='panel-main-' reverseids='btn-type-' value={link} data={buku.filter(b => b.theme.indexOf(a) !== -1)}/>
            ))
          ):(<></>)
        }
        </Box>
      </Box>
    </Box>
  );
}
