import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Profile from './subcomponent/Auth/AuthUserComponent/Profile';
import BookBuilder from './subcomponent/Book/Book_Builder';
import DashboardIcon from '@mui/icons-material/Dashboard';
import {useSelector, useDispatch} from 'react-redux';
import {profile} from './funcredux/profile_redux';
import {myBooks, setBookSeller, countDataAppearsDefault, myBookPage, setMyBookPage, trigger, setTrigger} from './funcredux/book_redux';
import {getMyBookURL,modifyBookURL,searchMyBookSuggestionURL,searchMyBookURL} from './constant/constantDataURL';
import {Box, Tabs, Tab, useMediaQuery, Snackbar, Backdrop, Portal} from '@mui/material';
import {Container, Search, ContainerFeedback, ModifyBook, UploadImage} from './subcomponent/utils/otherComponent';

export default function MyLibrary() {
  const [error, setError]=useState();
  const [respon, setRespon]=useState();
  const [link, setLink] = useState(1);
  const [imgFile, setImageFile] = useState()
  const [img, setImg] = useState({data:null})
  const [open, setOpen] = useState(false)
  const [openModify, setOpenModify] = useState();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();

  const user = useSelector(profile);
  const myBuku = useSelector(myBooks);
  const triggerBook = useSelector(trigger);
  const myBukuAllPage = useSelector(myBookPage);
  const initSizeData = useSelector(countDataAppearsDefault);
  const dispatch = useDispatch();
  const med = useMediaQuery('(min-width:900px)');
  const handleChange = (e,n) => {
    setLink(n)
  }
  const handlePage = (e,n) => {
    var url = getMyBookURL;
    if(triggerBook === -7){
      url = searchMyBookURL;
    }
    axios.get(url,{
      withCredentials:true,
      params:{
        words: (triggerBook === -7)? search:null,
        page: n-1,
        size: initSizeData.book,
      }
    }).then(res => {
      if(res.data && res.data.data.length > 0){
        dispatch(setBookSeller(res.data.data));
        dispatch(setMyBookPage(res.data.sizeAllPage));
      }else{
        setRespon("Book is Empty")
      }
      }).catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
    })
    setPage(n);
  }
  const handleAll = (e) => {
    dispatch(setTrigger(-8));
    axios.get(getMyBookURL,{
      withCredentials:true,
      params:{
        page: page-1,
        size: initSizeData.book,
      }
    }).then(res => {
      if(res.data && res.data.data.length > 0){
        dispatch(setBookSeller(res.data.data));
        dispatch(setMyBookPage(res.data.sizeAllPage));
      }else{setError("Book is Empty")}
    }).catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
    })
  }
  useEffect(()=>{
    dispatch(setTrigger(-8));
    if(user) {
      axios.get(getMyBookURL,{
        withCredentials:true,
        params:{
          page:0,
          size:initSizeData.book
        }
      }).then(res => {
        if(res.data && res.data.data.length > 0){
          dispatch(setBookSeller(res.data.data));
          dispatch(setMyBookPage(res.data.sizeAllPage));
        }else{setError("Book is Empty")}})
      .catch(err => {
        if(err.response){
          setError(err.response.data.message)
        }else {
          setError(err.message)
        }
      })
    }
  },[user])
  return(
    <>
      <Box display='flex' flexWrap={{xs:'wrap', md:'nowrap'}} sx={{background: '#009999', minHeight:'100vh',paddingTop: '10px'}}>
        <Box sx={{width:{xs:'100%', md:'40%',lg:'30%'}, maxHeight:'100vh'}} justifyContent='center' alignItems='flex-start' display='flex' flexWrap='wrap'>
          <Profile onerror={setError} container="library" path='/'/>
          <Tabs variant="fullWidth" value={link} textColor='inherit' indicatorColor="secondary"
            onChange={handleChange} orientation={(med)?'vertical':'horizontal'} sx={{width:'100%',maxWidth:'100%', color:'#ffff', overflow:'auto'}}>
            {
              ["Book Builder","Book Storage"].map((title,i)=>(
                <Tab key={'MyLibrary'+i} sx={{paddingTop:'1.3rem',paddingBottom:'1.3rem'}} id={`tab-mylibrary-${i}`} aria-controls={`panel-mylibrary-${i}`} value={i}
                  label={title}/>
              ))
            }
          </Tabs>
          {/*footer app*/}
        </Box>
        <Box sx={{width:{xs:'100%', md:'60%',lg:'70%'}}}>
          <Panel index={0} value={link}>
            <>
              <Box>
                <BookBuilder setError={setError} setRespon={setRespon} setOpen={setOpen} imgFile={imgFile} img={img} setImg={setImg}/>
              </Box>
            </>
          </Panel>
          <Panel index={1} value={link}>
            <Box width='100%' sx={{marginTop:'20px'}}>
              <Search url={searchMyBookURL} triggerPage={setPage} triggerDataIndex={-7} value={search} setValue={setSearch}
                callback={result => dispatch(setBookSeller(result))} count={result => dispatch(setMyBookPage(result))} isPagination={true} sx={{color:"white"}}
                urlSuggestion={searchMyBookSuggestionURL} onError={setError} btnDeleteProps={{color:'white'}} filterIcon={<DashboardIcon  sx={{fontSize: 'inherit'}}/>}
                onFilter={handleAll} sxRoot={{paddingLeft:'10px',paddingBottom:'30px'}}/>
              <Box paddingLeft='10px'>
              <Container id='user-book-cont' data={myBuku} page={page} onPageChange={handlePage} itemSpacing={1}
                sx={{width:'100%', maxWidth:'100%', overflow:'auto',marginBottom:'20px'}} countPage={myBukuAllPage}
                setOpenModify={setOpenModify} sizeLoadingData={initSizeData.book}/>
              </Box>
            </Box>
          </Panel>
        </Box>
      </Box>
      <Portal>
        <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} autoHideDuration={6000} onClose={() => {setError(null);setRespon(null);}}
          open={Boolean((respon)?respon:error)} sx={{zIndex: (theme) => theme.zIndex.drawer + 5}}>
          <ContainerFeedback severity={(respon)?'success':'error'} onClose={() => {setError(null);setRespon(null);}}>
            {(respon)?respon:error}
          </ContainerFeedback>
        </Snackbar>
      </Portal>
      <Backdrop sx={{zIndex: (theme) => theme.zIndex.drawer + 2, width:'100vw', overflow:'auto'}} onClick={() => {setOpenModify(null);}} open={Boolean(openModify)}>
        <Box sx={{marginTop:'20px',padding:'10px'}}>
        {(openModify)?
          <ModifyBook onError={setError} onSuccess={setRespon} prof={user} imgFile={imgFile} labelButton='Modify Book'
            imgView={img} setImgView={setImg} imgCallback={setOpen} url={modifyBookURL} responText='Modify Book Successfully !!!, please refresh this page'
            spacing={2} sx={{padding:'20px',backgroundColor:'#ff6600',borderRadius:'20px'}} bookData={openModify} onOpenModify={setOpenModify}
            modify={true}/>
          :<></>
        }
        </Box>
      </Backdrop>
      <UploadImage open={open} setOpen={setOpen} img={img} setImg={setImg} imgStore={setImageFile} type='square'
        viewport={{width:150, height:200}}/>
    </>
  );
};

function Panel(props) {
  const {index, value, children}=props;
  return(
    <div id={`panel-mylibrary-${index}`} aria-labelledby={`tab-mylibrary-${index}`} hidden={value!==index}>
      {children}
    </div>
  );
}
