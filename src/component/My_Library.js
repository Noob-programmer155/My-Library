import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {profile} from './funcredux/profile_redux';
import {myBooks, setBookSeller, countDataAppearsDefault, myBookPage, setMyBookPage, trigger, setTrigger} from './funcredux/book_redux';
import {Box, Tabs, Tab, useMediaQuery, Snackbar, Backdrop} from '@mui/material';
import Profile from './Profile';
import {getMyBookURL,modifyBookURL,searchMyBookSuggestionURL,searchMyBookURL} from './constant/constantDataURL';
import {Container, Search, ContainerFeedback, ModifyBook, UploadImage} from './subcomponent/otherComponent';
import BookBuilder from './subcomponent/Book_Builder';
import DashboardIcon from '@mui/icons-material/Dashboard';

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
    setPage(n);
    var url = getMyBookURL;
    if(triggerBook === -7){
      url = searchMyBookURL;
    }
    axios.get(url,{
      withCredentials:true,
      params:{
        words: (triggerBook === -7)? search:null,
        page: page-1,
        size: initSizeData.book,
      }
    }).then(item => {
      if(item.data !== null){
        dispatch(setBookSeller(item.data.data));
        dispatch(setMyBookPage(item.data.sizeAllPage));
    }}).catch(err => setError(err.message))
  }
  const handleAll = (e) => {
    dispatch(setTrigger(-8));
    axios.get(getMyBookURL,{
      withCredentials:true,
      params:{
        page: page-1,
        size: initSizeData.book,
      }
    }).then(item => {
      if(item.data !== null){
        dispatch(setBookSeller(item.data.data));
        dispatch(setMyBookPage(item.data.sizeAllPage));
    }}).catch(err => setError(err.message))
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
      }).then(a => {
        if(a.data !== null){
          dispatch(setBookSeller(a.data.data));
          dispatch(setMyBookPage(a.data.sizeAllPage));
        }else{setError("there is an incorrect response from server, please try again")}})
      .catch(err => setError(err.message))
    }
  },[user])
  return(
    <>
      <Box display='flex' flexWrap={{xs:'wrap', md:'nowrap'}} sx={{background: '#009999', minHeight:'100vh'}}>
        <Box sx={{width:{xs:'100vw', md:'30vw'}, maxHeight:'100vh'}} justifyContent='center' alignItems='center' display='flex' flexWrap='wrap'>
          <Profile error={error} onerror={setError} container="library" path='/'/>
          <Tabs variant="fullWidth" value={link} textColor='inherit' indicatorColor="secondary"
            onChange={handleChange} orientation={(med)?'vertical':'horizontal'} sx={{width:'100%',maxWidth:'100%', color:'#ffff', overflow:'auto'}}>
            {
              ["Book Builder","Book Storage"].map((a,i)=>(
                <Tab id={`tab-mylibrary-${i}`} aria-controls={`panel-mylibrary-${i}`} value={i}
                  label={a}/>
              ))
            }
          </Tabs>
          // footer app
        </Box>
        <Box sx={{width:{xs:'100vw', md:'70vw'}, padding: '10px'}}>
          <Panel index={0} value={link}>
            <>
              <Box>
                <BookBuilder setError={setError} setRespon={setRespon} open={open} setOpen={setOpen} imgFile={imgFile}
                  setImageFile={setImageFile} img={img} setImg={setImg}/>
              </Box>
            </>
          </Panel>
          <Panel index={1} value={link}>
            <Box width='100%' sx={{marginTop:'35px'}}>
              <Search url={searchMyBookURL} triggerPage={setPage} triggerDataIndex={-7} value={search} setValue={setSearch}
                callback={a => dispatch(setBookSeller(a))} count={a => dispatch(setMyBookPage(a))} isPagination={true} sx={{color:"white"}}
                urlSuggestion={searchMyBookSuggestionURL} onError={setError} btnSubmitProps={{color:'white'}} filterIcon={<DashboardIcon/>}
                onFilter={handleAll}/>
              <Box paddingLeft='10px'>
              {
                  (myBuku)?
                    (<Container data={myBuku} page={page} onPageChange={handlePage}
                      sx={{width:'100%', maxWidth:'100%', maxHeight:'500px', overflow:'auto',marginBottom:'20px'}}
                      countPage={myBukuAllPage} setOpenModify={setOpenModify}/>):(<p>Loading data...</p>)
              }
              </Box>
            </Box>
          </Panel>
        </Box>
      </Box>
      <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={(respon)?respon:error}>
        <ContainerFeedback severity={(respon)?'success':'error'} onClose={a => {setError(null);setRespon(null);}}>
          {(respon)?respon:error}
        </ContainerFeedback>
      </Snackbar>
      <Backdrop sx={{zIndex: (theme) => theme.zIndex.drawer + 2, width:'100vw', overflow:'auto'}} onClick={(e) => {setOpenModify(null);}} open={Boolean(openModify)}>
        <Box sx={{marginTop:'90px'}}>
        {(openModify)?
          <ModifyBook onError={setError} onSuccess={setRespon} prof={user} imgFile={imgFile} labelButton='Modify Book'
            imgView={img} setImgView={setImg} imgCallback={setOpen} url={modifyBookURL} responText='Modify Book Successfully !!!, please refresh this page'
            spacing={2} sx={{padding:'20px',backgroundColor:'#ff6600',borderRadius:'20px'}}
            onClick={(e)=>e.stopPropagation()} bookData={openModify} onOpenModify={setOpenModify} modify={true}/>
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
