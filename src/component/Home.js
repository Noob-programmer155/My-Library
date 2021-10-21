import React, {useEffect, useState, forwardRef} from 'react';
import {Box, Snackbar, Alert} from '@mui/material';
import Profile from './Profile';
import BookChoice from './Book_Choices';
import TypeContainer from './Type_book';
import MainContainer from './Main_Book_Container'

const Container = forwardRef(function Container(props, ref) {
  return <Alert elevation={5} ref={ref} variant='filled' {...props}/>
})

export default function Home(props) {
  const [verify, setVerify] = useState();
  const [error, setError] = useState();
  useEffect(()=>{
    let param = new URLSearchParams(props.location.search);
    if(param){
      let ver = param.get('verify')
      if(ver===1){setVerify("Please check your email to verify account")}
    }
  },[])
  return(
    <Box sx={{background: '#009999'}}>
      <Box sx={{display: {xs: 'block', md: 'flex'}, flexWrap:'wrap', maxWidth:'100vw'}}>
        <Box width={{xs: '100%', md: '30%'}} sx={{display:'flex', flexWrap:'wrap', alignItems:'Center', justifyContent:'center'}}>
          <Profile error={error} onerror={setError}/>
        </Box>
        <Box width={{xs: '100%', md: '69%'}}>
          <BookChoice/>
        </Box>
        <Box width={{xs: '100%', md: '30%'}} display={{xs:'none', md:'block'}}>
          <TypeContainer/>
        </Box>
        <Box width={{xs: '100%', md: '69%'}}>
          <MainContainer onerror={setError}/>
        </Box>
      </Box>
      <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={verify}>
        <Container severity={(error)? 'error':'info'} onClose={a => (error)? setError(null):setVerify(null)}>
          {(error)? error:verify}
        </Container>
      </Snackbar>
    </Box>
  );
}
