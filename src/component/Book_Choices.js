import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {favoriteBooks, recommendBooks, myBooks, setBookFav, setBookRek, setBookSeller, bookFavPage, myBookPage,
  setBookFavPage, setMyBookPage, countDataAppearsDefault, setBooks, setAllBookPage, setTrigger} from './funcredux/book_redux';
import {profile} from './funcredux/profile_redux';
import {ModifyBook,UploadImage,Container} from './subcomponent/otherComponent';
import {mainBookURL, getMyBookURL, getRecomendBookURL, getFavoriteBookURL} from './constant/constantDataURL';
import BookView from './subcomponent/Book_view';
import {Box, Typography, Button, Tabs, Tab, useMediaQuery} from '@mui/material';
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
    marginTop: '10px',
    maxWidth:'100%',
    width:'100%',
    color:'#ffff',
    [theme.breakpoints.up('md')]:{
      display: 'block',
    },
  },
  mobile: {
    maxWidth:'100%',
    width:'100%',
    display:'flex',
    [theme.breakpoints.up('md')]:{
      display: 'none',
    },
  },
  text: {
    color: '#ffff',
    marginBottom:'10px',
    fontFamily: 'Segoe UI',
  },
})

export default function BookChoice(props) {
  const {onError, setOpenModify} = props;
  const [page, setPage] = useState(3);
  const [pageMyBook, setPageMyBook] = useState(1);
  const [pageFavBook, setPageFavBook] = useState(1);
  const style = useStyle();
  const favBuku = useSelector(favoriteBooks);
  const recBuku = useSelector(recommendBooks);
  const prof = useSelector(profile);
  const myBuku = useSelector(myBooks);
  const initCountDataAppears = useSelector(countDataAppearsDefault);
  const myBukuAllPage = useSelector(myBookPage);
  const favBukuAllPage = useSelector(bookFavPage);
  const sm = useMediaQuery('(min-width:600px)');
  const dispatch = useDispatch();
  useEffect(()=>{
    if(prof){
      axios.get(getMyBookURL,{
        withCredentials:true,
        params:{
          page: 0,
          size: initCountDataAppears.book
        }
      }).then(item => {dispatch(setBookSeller(item.data.data));dispatch(setMyBookPage(item.data.sizeAllPage));})
      .catch(err => onError(err.message))
      axios.get(getFavoriteBookURL,{
        withCredentials:true,
        params:{
          page: 0,
          size: initCountDataAppears.book
        }
      }).then(item => {dispatch(setBookFav(item.data.data));dispatch(setBookFavPage(item.data.sizeAllPage));})
      .catch(err => onError(err.message))
    }
    axios.get(getRecomendBookURL,{
      withCredentials:true,
    }).then(item => {dispatch(setBookRek(item.data));})
    .catch(err => onError(err.message))
  },[prof])
  const handleChangeMyBook = (oldValue,newValue) => {
    setPageMyBook(newValue);
    axios.get(getMyBookURL,{
      withCredentials:true,
      params:{
        page: pageMyBook-1,
        size: initCountDataAppears.book
      }
    }).then(item => {dispatch(setBookSeller(item.data.data));})
    .catch(err => onError(err.message))
  }
  const handleChangeFavBook = (oldValue,newValue) => {
    setPageFavBook(newValue);
    axios.get(getFavoriteBookURL,{
      withCredentials:true,
      params:{
        page: pageFavBook-1,
        size: initCountDataAppears.book
      }
    }).then(item => {dispatch(setBookFav(item.data.data));})
    .catch(err => onError(err.message))
  }
  const handleChangePage = (oldValue,newValue) => {
    setPage(newValue)
  }
  const handleClickTabsBook = (url, isPagination, dataIndex) => (e) => {
    dispatch(setTrigger(dataIndex))
    axios.get(url, {
      withCredentials:true,
      params: (isPagination)?{
        page: 0,
        size: initCountDataAppears.book
      }:null
    }).then(item => {
      if(item.data !== null){
        if(isPagination){
          dispatch(setBooks(item.data.data))
          dispatch(setAllBookPage(item.data.sizeAllPage))
        }
        else{
          dispatch(setBooks(item.data))
          dispatch(setAllBookPage(1))
        }
      }
    }).catch(err => {
      if(prof){
        onError(err.message);
      }
      dispatch(setBooks([]));
      dispatch(setAllBookPage(0));});
  }
  return(
    <>
      <Box className={style.root}>
        {
          [
            {title:'Recommended Books', data:recBuku, page: 1, handlePage: null, maxPage: 1},
            {title:'Favorite Books', data:favBuku, page: pageFavBook, handlePage: handleChangeFavBook, maxPage: favBukuAllPage},
            {title:'My Books', data:myBuku, page: pageMyBook, handlePage: handleChangeMyBook, maxPage: myBukuAllPage}].map((item,i) => (
              <>
                <Typography className={style.text}>{item.title}</Typography>
                <Box>
                {(item.data.length > 0)?
                  <Container data={item.data} page={item.page} onPageChange={item.handlePage}
                    sx={{width:'100%', maxWidth:'100%', maxHeight:'500px', overflow:'auto',marginBottom:'20px'}}
                    countPage={item.maxPage} setOpenModify={setOpenModify} pattern="row"/>
                  :(i > 0)?
                  ((prof)?
                    <Typography sx={{textAlign:'center',padding:'10px',marginLeft:'30px',marginRight:'30px',
                      borderRadius:'10px',background:'rgba(0,0,0,.1)'}}>Your "{item.title}" is empty</Typography>
                  :<Box sx={{padding:'10px',marginLeft:'30px',marginRight:'30px',borderRadius:'10px',background:'rgba(0,0,0,.1)'}}>
                    <Typography sx={{textAlign:'center'}}>To view "{item.title}", You must login before see inside this</Typography>
                    <Box display='flex' justifyContent='center' alignItems='center'>
                      <Button variant='contained' sx={{marginTop:'10px'}} href='/login'>Login</Button>
                    </Box>
                  </Box>):<></>
                }
                </Box>
              </>
            ))
        }
      </Box>
      <Tabs className={style.mobile} variant={(sm)?'fullWidth':'scrollable'} scrollButtons='auto' value={page}
        onChange={handleChangePage} textColor='inherit' indicatorColor="secondary">
        {
            [{icon:<StarsIcon fontSize='small'/>,label:'Rekomend Book', url: getRecomendBookURL, pagination:false,refData: -2},
            {icon:<FavoriteIcon fontSize='small'/>,label:'Favorite Book', url: getFavoriteBookURL, pagination:true,refData: -3},
            {icon:<BookIcon fontSize='small'/>,label:'My Book', url: getMyBookURL, pagination:true, refData: -4},
            {icon:<LibraryBooksIcon fontSize='small'/>,label:'All Book', url: mainBookURL, pagination:true, refData: -1}].map((a,i) => {
              return <Tab key={i} sx={{color:'#ffff'}} icon={a.icon} label={a.label} onClick={handleClickTabsBook(a.url,a.pagination,a.refData)}/>
            })
        }
      </Tabs>
    </>
  );
}
