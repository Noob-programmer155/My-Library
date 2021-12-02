import React,{useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setBookTheme, bookThemes, books} from './funcredux/book_redux';
import {setBookLink, linkbook, initbooklink} from './funcredux/linkedRes';
import {Stack, Tab, Tabs, Skeleton, Box, useMediaQuery} from '@mui/material';
import {createTheme} from '@mui/material/styles';

export default function TypeContainer(props) {
  const {...attr} = props;
  const dispatch = useDispatch();
  const themes = useSelector(bookThemes);
  const buku = useSelector(books);
  const link = useSelector(linkbook);
  const initstate = useSelector(initbooklink);
  const med = useMediaQuery('(min-width:900px)')
  var props = (i) => {
    return{
      id: `btn-type-${i}`,
      'aria-controls': `panel-main-${i}`
    }
  }
  const handleChange = (a, n) => {
    dispatch(setBookLink(n))
  }
  useEffect(()=>{
    if(buku.length > 0) {
      let arr = []
      buku.forEach(it => {
        it.theme.forEach(item => {
          if(arr.findIndex(x => x === item) === -1){
            arr.push(item)
          }
        });
      });
      dispatch(setBookTheme(arr.sort()))
    }
  },[buku]);
  return(
    <>
      {(themes.length !== 0)?
        (<Tabs variant={(med)?"fullWidth":'scrollable'} scrollButtons="auto" value={(link<initstate)?false:link} textColor='inherit' indicatorColor="secondary"
          onChange={handleChange} orientation={(med)?'vertical':'horizontal'}
          sx={{maxWidth:'100%', maxHeight:'500px', color:'#ffff'}} {...attr}>
          {
            themes.map((a, i) => {
              return <Tab key={i} label={a} {...props(initstate+i)} value={initstate+i}/>
            })
          }
        </Tabs>):(
          <Box>
            {
              [1,2,3,4,5,6,7,8].map((a,i)=> (
                <Skeleton key={i} variant='rectangular' sx={{width:'100%', height:'40px', marginBottom: '3px'}}/>
              ))
            }
          </Box>
        )
      }
    </>
  );
}
