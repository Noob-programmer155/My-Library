import React, {useEffect, useState, forwardRef} from 'react';
import {Box, Snackbar, Alert, Backdrop, Typography} from '@mui/material';
import {useSelector} from 'react-redux';
import axios from 'axios'
import {bookThemes} from './funcredux/book_redux';
import {profile} from './funcredux/profile_redux';
import Profile from './Profile';
import BookChoice from './Book_Choices';
import {ModifyBook,UploadImage,ContainerFeedback} from './subcomponent/otherComponent';
import {modifyBookURL} from './constant/constantDataURL';
import TypeContainer from './Type_book';
import MainContainer from './Main_Book_Container';

export default function Home(props) {
  const [verify, setVerify] = useState();
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
      if(ver==='1'){setVerify("Please check your email to verify account")}
    }
  },[])
  return(
    <>
      <Box sx={{background: '#009999'}}>
        <Box sx={{display:'flex', flexWrap:{xs:'wrap', md:'nowrap'}}}>
          <Box width={{xs: '100%', md: '30%'}} maxWidth={{xs: '100%', md: '30%'}} sx={{display:'flex', flexWrap:'wrap', alignItems:'Center', justifyContent:'center'}}>
            <Profile error={error} onerror={setError}/>
          </Box>
          <Box width={{xs: '100%', md: '70%'}} maxWidth={{xs: '100%', md: '70%'}}>
            <BookChoice setOpenModify={setOpenModify} onError={setError}/>
          </Box>
        </Box>
        <Box sx={{display:'flex', flexWrap:{xs:'wrap', md:'nowrap'}}}>
          <Box width={{xs: '100%', md: '30%'}} maxWidth={{xs: '100%', md: '30%'}} display={{xs:'none', md:'block'}}>
            <TypeContainer onError={setError}/>
          </Box>
          <Box width={{xs: '100%', md: '70%'}} maxWidth={{xs: '100%', md: '70%'}} sx={{paddingRight:'10px'}}>
            <MainContainer setOpenModify={setOpenModify} onerror={setError}/>
          </Box>
        </Box>
      </Box>
      <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={(error)? error:verify}>
        <ContainerFeedback severity={(error)? 'error':'info'} onClose={a => (error)? setError(null):setVerify(null)}>
          {(error)? error:verify}
        </ContainerFeedback>
      </Snackbar>
      <Backdrop sx={{zIndex: (theme) => theme.zIndex.drawer + 2, width:'100vw', overflow:'auto'}} onClick={(e) => {setOpenModify(null);}} open={Boolean(openModify)}>
        <Box sx={{marginTop:'90px'}}>
        {(openModify)?
          <ModifyBook onError={setError} onSuccess={setRespon} themes={themes} prof={prof} imgFile={imgFile} labelButton='Modify Book'
            imgView={img} setImgView={setImg} imgCallback={setImgOpen} url={modifyBookURL} responText='Modify Book Successfully !!!, please refresh this page'
            spacing={2} sx={{padding:'20px',backgroundColor:'#ff6600',borderRadius:'20px'}}
            onClick={(e)=>e.stopPropagation()} bookData={openModify} onOpenModify={setOpenModify} modify={true}/>
          :<></>
        }
        </Box>
      </Backdrop>
      <UploadImage open={imgOpen} setOpen={setImgOpen} img={img} setImg={setImg} imgStore={setImageFile} type='square'
        viewport={{width:150, height:200}}/>
    </>
  );
}
