import React, {useEffect, useState} from 'react';
import Profile from './subcomponent/Auth/AuthUserComponent/Profile';
import BookChoice from './subcomponent/HomePage/Book_Choices';
import TypeContainer from './subcomponent/HomePage/Type_book';
import MainContainer from './subcomponent/HomePage/Main_Book_Container';
import {Box, Snackbar, Backdrop, Portal} from '@mui/material';
import {useSelector} from 'react-redux';
import {bookThemes} from './funcredux/book_redux';
import {profile} from './funcredux/profile_redux';
import {ModifyBook,UploadImage,ContainerFeedback} from './subcomponent/utils/otherComponent';
import {modifyBookURL} from './constant/constantDataURL';

export default function Home(props) {
  const [error, setError] = useState();
  const [respon, setRespon] = useState();
  const [imgOpen, setImgOpen] = useState()
  const [imgFile, setImageFile] = useState()
  const [img, setImg] = useState({data:null})
  const [openModify, setOpenModify] = useState();
  const prof = useSelector(profile);
  const themes = useSelector(bookThemes);
  useEffect(()=>{
    let param = new URLSearchParams(props.location.search);
    if(param){
      let ver = param.get('verify')
      let logout = param.get('logout')
      if(ver==='1'){setRespon("Please check your email to verify account")}
      if(logout==='1'){setRespon("Logout Successfully !!!")}
    }
  },[])
  return(
    <>
      <Box sx={{background: '#009999',minHeight: '100vh'}}>
        <Box sx={{display:'flex', flexWrap:{xs:'wrap', md:'nowrap'}}}>
          <Box width={{xs: '100%', md: '30%'}} maxWidth={{xs: '100vw', md: '30%'}} sx={{display:'flex', flexWrap:'wrap', alignItems:'flex-start', justifyContent:'center',marginTop:'10px'}}>
            <Profile onerror={setError}/>
          </Box>
          <Box width={{xs: '100%', md: '70%'}} maxWidth={{xs: '100vw', md: '70%'}}>
            <BookChoice setOpenModify={setOpenModify} onError={setError} onRespon={setRespon}/>
          </Box>
        </Box>
        <Box sx={{display:'flex', flexWrap:{xs:'wrap', md:'nowrap'}}}>
          <Box width={{xs: '100%', md: '30%'}} maxWidth={{xs: '100vw', md: '30%'}} display={{xs:'none', md:'block'}}>
            <TypeContainer onError={setError}/>
          </Box>
          <Box width={{xs: '100%', md: '70%'}} maxWidth={{xs: '100vw', md: '70%'}}>
            <MainContainer setOpenModify={setOpenModify} onError={setError} onRespon={setRespon}/>
          </Box>
        </Box>
      </Box>
      <Portal>
        <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={Boolean((respon)?respon:error)} onClose={() => (respon)? setRespon(null):setError(null)} autoHideDuration={4000}
          sx={{zIndex: (theme) => theme.zIndex.drawer + 5}}>
          <ContainerFeedback severity={(respon)? 'success':'error'} onClose={() => (respon)? setRespon(null):setError(null)}>
            {(respon)? respon:error}
          </ContainerFeedback>
        </Snackbar>
      </Portal>
      <Backdrop sx={{zIndex: (theme) => theme.zIndex.drawer + 2, width:'100%', maxHeight:'100vh', overflow:'auto'}} onClick={() => {setOpenModify(null);}} open={Boolean(openModify)}>
        <Box display='flex' justifyContent='center' alignItems='center'>
        {(openModify)?
          <ModifyBook onError={setError} onSuccess={setRespon} themes={themes} prof={prof} imgFile={imgFile} labelButton='Modify Book'
            imgView={img} setImgView={setImg} imgCallback={setImgOpen} url={modifyBookURL} responText='Modify Book Successfully !!!, please refresh this page'
            spacing={3} sx={{padding:'10px',backgroundColor:'#ff6600',borderRadius:'20px', width:'90%',maxWidth:'1000px'}}
            onClick={e => e.stopPropagation()} bookData={openModify} onOpenModify={setOpenModify} modify={true}/>
          :<></>
        }
        </Box>
      </Backdrop>
      <UploadImage open={imgOpen} setOpen={setImgOpen} img={img} setImg={setImg} imgStore={setImageFile} type='square'
        viewport={{width:150, height:200}}/>
    </>
  );
}
