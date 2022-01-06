import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {profile} from './funcredux/profile_redux';
import axios from 'axios'
import {books, setBooks, setAllBookPage, setTrigger, countDataAppearsDefault, allBookPage, trigger} from './funcredux/book_redux';
import {Box, TextField, Typography, Stack, IconButton, useMediaQuery, Button, Drawer, Chip} from '@mui/material';
import {mainBookURL, searchBookURL, searchBookSuggestionURL, getBooksByTypeURL, getRecomendBookURL, getFavoriteBookURL, getMyBookURL,
  searchTitleBookURL, searchAuthorBookURL, searchPublisherBookURL, searchThemeBookURL, filterBookURL} from './constant/constantDataURL';
import {Search, Container, UploadImage, ModifyBook} from './subcomponent/otherComponent'
import TypeContainer from './Type_book';

export default function MainContainer(props) {
  const {onerror,setOpenModify} = props;
  const [page,setPage] = useState(1);

  const [value, setValue] = useState("");
  const user = useSelector(profile);
  const triggerType = useSelector(trigger);

  const [filter, setFilter] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState({id:null,name:""});
  const [publisher, setPublisher] = useState({id:null,name:""});
  const [type, setType] = useState({id:null,name:""});
  const [types, setTypes] = useState([]);

  var buku = useSelector(books);
  var initBooksCountPerFetch = useSelector(countDataAppearsDefault);
  var allBukuPage = useSelector(allBookPage);

  const dispatch = useDispatch();
  const md = useMediaQuery('(min-width:900px)')
  useEffect(()=>{
    axios.get(mainBookURL,{
      withCredentials:true,
      params: {
        page: 0,
        size: initBooksCountPerFetch.book
      }
    }).then(item => {
      if(item.data !== null){
        dispatch(setBooks(item.data.data))
        dispatch(setAllBookPage(item.data.sizeAllPage))
      }
      else{
        onerror("there is a network error")
      }
    }).catch(err => onerror(err.message));
  },[user])
  var url = "";
  const dataUrlPaginationBook = [filterBookURL,searchBookURL,getMyBookURL,getFavoriteBookURL,getRecomendBookURL,mainBookURL];
  const basicPagination = {page: page-1, size: initBooksCountPerFetch.book}
  const filterData = {title:title, idAuthor:author.id, idPublisher:publisher.id, idThemes: `${types.map(sa => sa.id)}`}
  const handlePageChange = (event,newValue) => {
    setPage(newValue);
    if(triggerType < 0){
      axios.get(dataUrlPaginationBook[dataUrlPaginationBook.length+triggerType],{
        withCredentials:true,
        params: (triggerType !== -2)?
          ((triggerType === -5)? {...basicPagination, words:value} :
          ((triggerType === -6)? {...basicPagination, ...filterData} :
           basicPagination)) : null
      }).then(item => {
          if(item !== null || item.data !== null){
            if(triggerType !== -2){
              dispatch(setBooks(item.data.data))
              dispatch(setAllBookPage(item.data.sizeAllPage))
            }
            else{
              dispatch(setBooks(item.data))
              dispatch(setAllBookPage(1))
            }
          }
          else {
            dispatch(setBooks([]))
            dispatch(setAllBookPage(0))
          }
      }).catch(err => {
        onerror(err.message)
        dispatch(setBooks([]))
        dispatch(setAllBookPage(0))
      });
    }
    else{
      axios.get(getBooksByTypeURL,{
        withCredentials:true,
        params: {
          page: page-1,
          size: initBooksCountPerFetch.book,
          theme: triggerType
        }
      }).then(item => {
        if(item.data !== null){
          dispatch(setBooks(item.data.data))
          dispatch(setAllBookPage(item.data.sizeAllPage))
        }
        else{
          onerror("there is a network error")
        }
      }).catch(err => onerror(err.message));
    }
  }
  const setTypesSetup = (val) => {
    setType({id:0,name:""});
    setTypes([...types,val]);
  }
  const filtering = (e) => {
    dispatch(setTrigger(-6))
    axios.get(filterBookURL, {
      withCredentials:true,
      params: {...basicPagination,...filterData},
      headers: {
        'Content-Type':'multipart/form-data',
      }
    }).then(item => {
      dispatch(setBooks(item.data.data))
      dispatch(setAllBookPage(item.data.sizeAllPage))
    })
    .catch(err => onerror(err.message))
  }
  const deleteTypes = (id) => {
    setTypes(types.filter(f => f.id !== id))
  }
  return(
    <>
      <Box width='100%' sx={{background: '#009999',marginTop:'20px'}}>
        <Box>
          <Search url={searchBookURL} triggerPage={setPage} triggerDataIndex={-5} value={value} setValue={setValue}
            callback={a => dispatch(setBooks(a))} count={a => dispatch(setAllBookPage(a))} isPagination={true} sx={{color:"white"}}
            urlSuggestion={searchBookSuggestionURL} onError={onerror} onFilter={setFilter} btnSubmitProps={{color:'white'}}/>
        </Box>
        <Box>
          <TypeContainer style={{display:(md)?'none':'flex'}} onError={onerror}/>
          <Box display='flex' sx={{marginTop:'20px', marginBottom:'20px', width:'100%', maxWidth:'100%', maxHeight:'500px', overflow:'auto'}}>
          {
            (buku.length > 0)?
              <Container data={buku} page={page} onPageChange={handlePageChange} countPage={allBukuPage} setOpenModify={setOpenModify}
              sx={{width:'100%', maxWidth:'100%', maxHeight:'500px', overflow:'auto',marginBottom:'20px'}}/>
            :((user)?
              <Typography sx={{textAlign:'center',padding:'10px',marginLeft:'30px',marginRight:'30px',
                borderRadius:'10px',background:'rgba(0,0,0,.1)'}}>Books is empty</Typography>
            :<Box sx={{padding:'10px',borderRadius:'10px',background:'rgba(0,0,0,.1)'}}>
              <Typography sx={{textAlign:'center',color:'white'}}>To view this, You must login before see inside this</Typography>
              <Box display='flex' justifyContent='center' alignItems='center'>
                <Button variant='contained' sx={{marginTop:'10px'}} href='/login'>Login</Button>
              </Box>
            </Box>)
          }
          </Box>
        </Box>
      </Box>
      <Drawer anchor='right' open={filter} onClose={() => setFilter(false)}>
        <Box sx={{padding:'10px', maxWidth:'70vw'}}>
          <Typography>Book Title</Typography>
          <Search value={title} setValue={setTitle} urlSuggestion={searchTitleBookURL} onError={onerror} isSuggestionSearch sx={{color:"black"}}/>
          <Typography>Book Author</Typography>
          <Search value={author} setValue={setAuthor} urlSuggestion={searchAuthorBookURL} onError={onerror} isSuggestionSearch isSuggestionDataList sx={{color:"black"}}/>
          <Typography>Book Publisher</Typography>
          <Search value={publisher} setValue={setPublisher} urlSuggestion={searchPublisherBookURL} onError={onerror} isSuggestionSearch isSuggestionDataList sx={{color:"black"}}/>
          <Typography>Book Types</Typography>
          <Search value={type} setValue={setType} urlSuggestion={searchThemeBookURL} onError={onerror} isSuggestionSearch isSuggestionDataList
            sx={{color:"black"}} onClickItemSuggestion={(item) => setTypesSetup(item)}/>
          <Box display='flex' flexWrap='wrap' sx={{width:'100%'}}>
          {(types.length > 0)?
            types.map((a,i) => (
              <Chip onDelete={() => deleteTypes(a.id)} label={a.name} sx={{marginBottom:'10px', marginLeft:'10px'}}/>
            )):<></>
          }
          </Box>
          <Button variant='contained' onClick={filtering} sx={{marginTop:'20px'}}>Filter</Button>
        </Box>
      </Drawer>
    </>
  );
}
