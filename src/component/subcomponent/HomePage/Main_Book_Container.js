import React, {useState, useEffect} from 'react';
import TypeContainer from './Type_book';
import axios from 'axios'
import {profile} from './../../funcredux/profile_redux';
import {useDispatch, useSelector} from 'react-redux';
import {Search, Container} from '../utils/otherComponent'
import {books, setBooks, setAllBookPage, setTrigger, countDataAppearsDefault, allBookPage, trigger} from './../../funcredux/book_redux';
import {Box, Typography, Stack, useMediaQuery, Button, Drawer, Chip} from '@mui/material';
import {mainBookURL, searchBookURL, searchBookSuggestionURL, getBooksByTypeURL, getRecomendBookURL, getFavoriteBookURL, getMyBookURL,
  searchTitleBookURL, searchAuthorBookURL, searchPublisherBookURL, searchThemeBookURL, filterBookURL} from './../../constant/constantDataURL';

export default function MainContainer(props) {
  const {onError,onRespon,setOpenModify} = props;
  const user = useSelector(profile);
  const triggerType = useSelector(trigger);
  var buku = useSelector(books);
  var initBooksCountPerFetch = useSelector(countDataAppearsDefault);
  var allBukuPage = useSelector(allBookPage);

  const [page,setPage] = useState(1);
  const [value, setValue] = useState("");
  const [filter, setFilter] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState({id:null,name:""});
  const [publisher, setPublisher] = useState({id:null,name:""});
  const [type, setType] = useState({id:null,name:""});
  const [types, setTypes] = useState([]);
  const [preventClick, setPreventClick] = useState(false);

  const dataUrlPaginationBook = [filterBookURL,searchBookURL,getMyBookURL,getFavoriteBookURL,getRecomendBookURL,mainBookURL];
  const filterData = {title:title, idAuthor:author.id, idPublisher:publisher.id, idThemes: `${types.map(themes => themes.id)}`}
  const dispatch = useDispatch();
  const md = useMediaQuery('(min-width:900px)')
  useEffect(()=>{
    axios.get(mainBookURL,{
      withCredentials:true,
      params: {
        page: 0,
        size: initBooksCountPerFetch.book
      }
    }).then(res => {
      if(res.data && res.data.data.length > 0){
        dispatch(setBooks(res.data.data))
        dispatch(setAllBookPage(res.data.sizeAllPage))
      }
      else{
        onRespon("Book is empty")
      }
    }).catch(err => {
      if(err.response){
        onError(err.response.data.message)
      }else {
        onError(err.message)
      }
    });
  },[user])
  const handlePageChange = (event,newValue) => {
    setPage(newValue);
    if(triggerType < 0){
      axios.get(dataUrlPaginationBook[dataUrlPaginationBook.length+triggerType],{
        withCredentials:true,
        params: (triggerType !== -2)?
          ((triggerType === -5)? {size: initBooksCountPerFetch.book, page: newValue-1, words:value} :
          ((triggerType === -6)? {size: initBooksCountPerFetch.book, page: newValue-1, ...filterData} :
           {size: initBooksCountPerFetch.book, page: newValue-1})) : null
      }).then(res => {
          if(res.data && res.data.length > 0 && triggerType === -2){
            dispatch(setBooks(res.data))
            dispatch(setAllBookPage(1))
          }
          else if(res.data && res.data.data.length > 0){
            dispatch(setBooks(res.data.data))
            dispatch(setAllBookPage(res.data.sizeAllPage))
          }
          else {
            dispatch(setBooks([]))
            dispatch(setAllBookPage(0))
            onRespon("Book is empty")
          }
      }).catch(err => {
        if(err.response){
          onError(err.response.data.message)
        }else {
          onError(err.message)
        }
        dispatch(setBooks([]))
        dispatch(setAllBookPage(0))
      });
    }
    else{
      axios.get(getBooksByTypeURL,{
        withCredentials:true,
        params: {
          page: newValue-1,
          size: initBooksCountPerFetch.book,
          theme: triggerType
        }
      }).then(res => {
        if(res.data && res.data.data.length > 0){
          dispatch(setBooks(res.data.data))
          dispatch(setAllBookPage(res.data.sizeAllPage))
        }
        else{
          onRespon("Book is empty")
        }
      }).catch(err => {
        if(err.response){
          onError(err.response.data.message)
        }else {
          onError(err.message)
        }
      });
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
      params: {size: initBooksCountPerFetch.book,page: 0,...filterData},
      headers: {
        'Content-Type':'multipart/form-data',
      }
    }).then(res => {
      if(res.data && res.data.data.length > 0){
        dispatch(setBooks(res.data.data))
        dispatch(setAllBookPage(res.data.sizeAllPage))
      }else{
        onRespon("Book is empty")
      }
    })
    .catch(err => {
      if(err.response){
        onError(err.response.data.message)
      }else {
        onError(err.message)
      }
    })
    setFilter(false)
  }
  const deleteTypes = (id) => {
    setTypes(types.filter(f => f.id !== id))
  }
  return(
    <>
      <Box width='100%' sx={{background: '#009999',marginTop:'20px'}}>
        <Box>
          <Search url={searchBookURL} triggerPage={setPage} triggerDataIndex={-5} value={value} setValue={setValue}
            callback={result => dispatch(setBooks(result))} count={result => dispatch(setAllBookPage(result))} isPagination={true} onError={onError} onFilter={setFilter}
            sx={{color:"white"}} sxRoot={{paddingLeft:'10px',paddingBottom:'30px'}} urlSuggestion={searchBookSuggestionURL}
            btnDeleteProps={{color:'white'}}/>
        </Box>
        <Box>
          <TypeContainer style={{display:(md)?'none':'flex'}} onError={onError}/>
          <Box display='flex' justifyContent='center' sx={{marginTop:'20px', marginBottom:'20px', marginLeft:'10px',
            width:'95%', maxWidth:'100%'}}>
            <Container id='main-book-cont' data={buku} page={page} onPageChange={handlePageChange} countPage={allBukuPage} setOpenModify={setOpenModify}
              sx={{width:'100%', maxWidth:'100%',marginBottom:'20px'}} itemSpacing={(md)?2:1}
              sizeLoadingData={initBooksCountPerFetch.book}/>
          </Box>
        </Box>
      </Box>
      <Drawer anchor='right' open={filter} onClose={() => setFilter(false)}>
        <Stack spacing={1} sx={{padding:'10px', maxWidth:'70vw',fontSize:'1.1rem'}}>
          <Typography sx={{fontSize:'inherit'}}>Book Title</Typography>
          <Search value={title} setValue={setTitle} urlSuggestion={searchTitleBookURL} onError={onError} inputProps={{color:"black"}}
            btnSearchProps={{display:'none'}} btnFilterProps={{display:'none'}}/>
          <Typography sx={{fontSize:'inherit'}}>Book Author</Typography>
          <Search value={author} setValue={setAuthor} urlSuggestion={searchAuthorBookURL} onError={onError} isSuggestionDataList
            inputProps={{color:"black"}} btnSearchProps={{display:'none'}} btnFilterProps={{display:'none'}}/>
          <Typography sx={{fontSize:'inherit'}}>Book Publisher</Typography>
          <Search value={publisher} setValue={setPublisher} urlSuggestion={searchPublisherBookURL} onError={onError} isSuggestionDataList
            inputProps={{color:"black"}} btnSearchProps={{display:'none'}} btnFilterProps={{display:'none'}}/>
          <Typography sx={{fontSize:'inherit'}}>Book Types</Typography>
          <Search value={type} setValue={setType} urlSuggestion={searchThemeBookURL} onError={onError} isSuggestionDataList
            inputProps={{color:"black"}} btnSearchProps={{display:'none'}} btnFilterProps={{display:'none'}}
            onClickItemSuggestion={(item) => setTypesSetup(item)}/>
          <Box display='flex' flexWrap='wrap' sx={{width:'100%'}}>
          {(types.length > 0)?
            types.map((data,i) => (
              <Chip key={"chipFilter"+i} onDelete={() => deleteTypes(data.id)} label={data.name}
                sx={{marginBottom:'.5rem', marginRight:'.3rem',fontSize:'1rem','& .MuiChip-deleteIcon':{
                  fontSize:'1.4rem'}}}/>
            )):<></>
          }
          </Box>
          <Button disabled={preventClick} variant='contained' onClick={filtering} sx={{marginTop:'20px'}}>Filter</Button>
        </Stack>
      </Drawer>
    </>
  );
}
