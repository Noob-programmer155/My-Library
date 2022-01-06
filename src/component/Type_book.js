import React,{useState, useEffect} from 'react';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {setBookTheme, setBooks, setAllBookPage, bookThemes, countDataAppearsDefault, setTrigger} from './funcredux/book_redux';
import {getTypeURL,getBooksByTypeURL,mainBookURL} from './constant/constantDataURL';
import {Stack, Tab, Tabs, Skeleton, Box, useMediaQuery, IconButton, Button} from '@mui/material';
import {createTheme} from '@mui/material/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';

export default function TypeContainer(props) {
  const {onError, ...attr} = props;
  const [maxPageType,setMaxPageType] = useState(0);
  const [page, setPage] = useState(1);
  const [typeTab, setTypeTab] = useState(0);
  const dispatch = useDispatch();
  const themes = useSelector(bookThemes);
  const initCountData = useSelector(countDataAppearsDefault);
  const med = useMediaQuery('(min-width:900px)')
  const handleChange = (a, n) => {
    setTypeTab(n)
  }
  useEffect(()=>{
    axios.get(getTypeURL,{
      withCredentials:true,
      params:{
        page: 0,
        size: initCountData.type
      }
    }).then(res => {
      if(res.data != null){
        dispatch(setBookTheme(res.data.data))
        setMaxPageType(res.data.sizeAllPage)
      }
    }).catch(err => onError(err.message));
  },[]);
  const handleClick = (item) => (e) => {
    dispatch(setTrigger(item))
    axios.get(getBooksByTypeURL,{
      withCredentials:true,
      params:{
        page: 0,
        size: initCountData.book,
        theme: item
      }
    }).then(res => {
      if(res.data != null){
        dispatch(setAllBookPage(res.data.sizeAllPage));
        dispatch(setBooks(res.data.data));
      }
    }).catch(err => onError(err.message));
  }
  const handleClickAll = () => {
    dispatch(setTrigger(-1))
    axios.get(mainBookURL,{
      withCredentials:true,
      params:{
        page: 0,
        size: initCountData.book,
      }
    }).then(res => {
      if(res.data != null){
        dispatch(setAllBookPage(res.data.sizeAllPage));
        dispatch(setBooks(res.data.data));
      }
    }).catch(err => onError(err.message));
  }
  var getType = () => {
    axios.get(getTypeURL,{
      withCredentials:true,
      params:{
        page: page,
        size: initCountData.type
      }
    }).then(res => dispatch(setBookTheme(res.data.data)))
    .catch(err => onError(err.message));
  }
  const handlePrev = (e) => {
    setPage(page-1)
    getType()
  }
  const handleNext = (e) => {
    setPage(page+1)
    getType()
  }
  return(
    <>
      {(themes.length !== 0)?
        (<Box {...attr}>
          {(page > 1)?
            <IconButton onClick={handlePrev}>
              {(med)?<ArrowForwardIosIcon sx={{transform:'rotate(-0.25turn)'}}/>:<ArrowForwardIosIcon sx={{transform:'rotate(0.5turn)'}}/>}
            </IconButton>:<></>}
          {(med)?
            <Button sx={{color:'white',width:'100%'}} startIcon={<CollectionsBookmarkIcon/>} onClick={handleClickAll}>All Books</Button>:<></>
          }
          <Tabs variant={(med)?"fullWidth":'scrollable'} value={typeTab} textColor='inherit' indicatorColor="secondary"
            onChange={handleChange} visibleScrollbar={true} orientation={(med)?'vertical':'horizontal'} sx={{maxWidth:'100%', maxHeight:'500px',color:'#ffff'}}>
            {
              themes.map((a, i) => {
                return <Tab key={i} value={i} label={a.name} onClick={handleClick(a.id)}/>
              })
            }
          </Tabs>
          {(page < maxPageType)?
            <IconButton onClick={handleNext}>
              {(med)?<ArrowForwardIosIcon sx={{transform:'rotate(0.25turn)'}}/>:<ArrowForwardIosIcon/>}
            </IconButton>:<></>}
        </Box>):(
          <Box {...attr}>
            {
              [1,2,3,4,5,6,7,8,9,10].map((a,i)=> (
                <Skeleton key={i} variant='rectangular' sx={{width:'100%', height:'40px', marginBottom: '3px'}}/>
              ))
            }
          </Box>
        )
      }
    </>
  );
}
