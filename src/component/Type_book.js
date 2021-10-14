import React,{useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setBookTheme, bookThemes, books} from './funcredux/book_redux';
import {setTypes, linktypes} from './funcredux/linkedRes';
import {Stack, Tab, Tabs, Skeleton, Box, useMediaQuery} from '@mui/material';
import {createTheme} from '@mui/material/styles';

export default function TypeContainer() {
  const dispatch = useDispatch();
  const themes = useSelector(bookThemes);
  const buku = useSelector(books);
  const link = useSelector(linktypes);
  const med = useMediaQuery('(min-width:900px)')
  var props = (i) => {
    return{
      id: `btn-type-${i}`,
      'aria-controls': `panel-main-${i}`
    }
  }
  const handleChange = (a, n) => {
    dispatch(setTypes(n))
  }
  useEffect(()=>{
    if(buku.length > 0) {
      var themeBook = []
      buku.forEach((item, i) => {
        if(themes.findIndex(x => x === item.theme) === -1){
          themeBook.push(item.theme)
        }
      });
      if(themeBook) {dispatch(setBookTheme(themeBook))}
    }
  },[buku]);
  return(
    <>
      {(themes.length !== 0)?
        (<Tabs variant="fullWidth" scrollButtons="auto" value={link} textColor='inherit' indicatorColor="secondary"
          onChange={handleChange} orientation={(med)?'vertical':'horizontal'} sx={{width:'100%', maxHeight:'500px', color:'#ffff'}}>
          {
            themes.map((a, i) => (
              <Tab label={a} {...props(i)}/>
            ))
          }
        </Tabs>):(
          <Box>
            {
              [1,2,3,4,5,6,7,8].map(a=> (
                <Skeleton variant='rectangular' sx={{width:'100%', height:'40px', marginBottom: '3px'}}/>
              ))
            }
          </Box>
        )
      }
    </>
  );
}
