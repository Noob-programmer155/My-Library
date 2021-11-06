import React,{useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import './css/loadVer.css';
import {valOauthURL} from './constant/constantDataURL';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {Box, Typography, Stack} from '@mui/material';

export default function VerOAuth(props) {
  const [error, setError] = useState();
  const [respon, setRespon] = useState('Please wait until verification complete...');
  const history = useHistory();
  useEffect(()=>{
    let param = new URLSearchParams(props.location.search);
    if(param){
      var acc = param.get('Access');
      var name = param.get('Usr');
      var email = param.get('lk');
      var data = new FormData();
      data.append('email',email);
      data.append('username',name);
      data.append('id',acc);
      axios.post(valOauthURL,data,{
        withCredentials:true,
        headers:{
          'Content-Type':'application/x-www-form-urlencoded',
        },
      }).then(a => {if (a.data !== null){
        setRespon('Verification Success, redirecting to home page...')
        history.push("/")
      }}).catch(err => setError(err.message));
    }
  },[])
  return(
    <Box justifyContent='center' alignItems='center' display='flex' flexWrap='wrap' sx={{height:'100vh'}}>
      {(!error)? (
          <Stack spacing={2} direction='row' justifyContent='center' alignItems='center' display='flex' flexWrap='wrap'>
            <Box class="ball"/>
            <Box class="ball2"/>
            <Box class="ball3"/>
            <Typography sx={{width:'100%', textAlign:'center', color:'#ff6600', textShadow: '1px 1px #ff9933'
              , fontSize:{xs:'5vw', sm: '2.5vw', md:'2vw'}, fontFamily: 'Candara', fontWeight:600}}>{respon}</Typography>
          </Stack>):(
            <Box sx={{background:'#ff9900', border:'5px solid #ff6600', borderRadius:'20px'}}>
              <Box justifyContent='center' alignItems='center' display='flex'><ErrorOutlineIcon
                sx={{width:{xs:'15vw', sm:'10vw', md:'5vw'}, height:{xs:'15vw', sm:'10vw', md:'5vw'},
                  color:'#ff3300', marginTop:'20px'}}/></Box>
              <Typography sx={{padding:'8px', color:'#ff3300', fontWeight:600,   marginTop:'10px', marginBottom:'20px',
                fontFamily:'Candara', fontSize:{xs:'5vw', sm: '2.5vw', md:'2vw'}}}>Verification Failed, Please try again</Typography>
            </Box>
          )
      }
    </Box>
  );
}
