import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {setProf} from './funcredux/profile_redux';
import {useHistory} from 'react-router-dom';
import './css/loadVer.css';
import axios from 'axios';
import {valDefault} from './constant/constantDataURL';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {Box, Typography, Stack} from '@mui/material';

export default function Verify(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [error, setError] = useState();
  const [respon, setRespon] = useState('Please wait until verification complete...');
  useEffect(()=>{
    let param = new URLSearchParams(props.location.search);
    if (param) {
      let data = param.get('tk');
      let us = new FormData();
      us.append('tkid',data);
      axios.post(valDefault,us,{
        withCredentials:true,
        headers:{
          'Content-Type':'application/x-www-form-urlencoded',
        },
      }).then(a => {if(a.data !== null){
          setRespon('Verification Success, redirecting to home page...')
          dispatch(setProf({
            name:a.data.name,
            email:a.data.email,
            role:a.data.role,
            image:a.data.image,
            imageUrl:a.data.image_url,
          }))
          history.push("/")
        }
      }).catch(err => setError(err.message));
    }
  },[])
  return(
    <Box justifyContent='center' alignItems='center' display='flex' sx={{height:'100vh'}}>
      {(!error)?(
        <Stack spacing={2} direction='row' justifyContent='center' alignItems='center' display='flex' flexWrap='wrap'>
          <Box class='ball'/>
          <Box class='ball2'/>
          <Box class='ball3'/>
          <Typography sx={{width:'100%', textAlign:'center', color:'#ff6600', textShadow: '1px 1px #ff9933'
            , fontSize:{xs:'5vw', sm: '2.5vw', md:'2vw'}, fontFamily: 'Candara', fontWeight:600}}>{respon}</Typography>
        </Stack>
      ):(
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
