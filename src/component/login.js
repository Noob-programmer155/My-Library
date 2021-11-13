import React,{useState, useEffect} from 'react';
import axios from 'axios';
import {Box,Typography,Button,Paper,Divider,TextField, Stack, FormControl, InputLabel,
   OutlinedInput, InputAdornment, IconButton, Link, Alert} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {useHistory} from 'react-router-dom';
import {logInURL, pathOauthURL} from './constant/constantDataURL';

export default function Login(props) {
  const [view, setView] = useState(false);
  const [value, setValue] = useState({email:'',pass:''});
  const [error, setError] = useState();
  const history = useHistory();
  useEffect(()=>{
    var param = new URLSearchParams(props.location.search);
    if(param){
      let au = param.get('auth');
      let er = param.get('err');
      if(au && er){
        setError("User not permitted or server error occurred");
      }
    }
  },[])
  const handleDefault = () => {
    var user = new FormData();
    user.append('email',value.email);
    user.append('password',value.pass);
    axios.post(logInURL ,user,{
      withCredentials:true,
      headers:{
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {if(res.data !== null){
      history.push('/')
    }})
    .catch(err => setError(err.message));
  }
  return(
    <Box justifyContent='center' alignItems='center' display='flex' flexWrap='wrap' sx={{width:'100vw',height:'100vh'}}>
      {(error)?
        (<Alert variant="filled" severity="error" onClose={() => setError(null)} sx={{alignItems:'center'}}>
            Error:<br/>{error}
          </Alert>):(<></>)
      }
      <Box sx={{maxWidth:'80%'}}>
        <Paper elevation={7} sx={{padding:'15px', minWidth:'250px', maxWidth:'100%', borderRadius:'20px', marginBottom:'15px'}}>
          <Typography sx={{fontFamily:'Century Gothic', textAlign:'center', fontWeight:800, color: '#1a8cff',
            fontSize:{xs: '10vw', sm:'5vw', md:'2.3vw'}}}>Login</Typography>
          <Divider/>
          <Stack direction='column' spacing={1} sx={{marginTop:'20px'}}>
            <TextField variant='outlined' label='Email' type='email'
              value={value.email} onChange={a => setValue({...value, email: a.target.value})}/>
            <FormControl variant="outlined">
              <InputLabel htmlFor='password'>Password</InputLabel>
              <OutlinedInput
                type={(view)? 'text':'password'}
                value={value.pass}
                onChange={a => setValue({...value, pass: a.target.value})}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton edge="end" onClick={a => setView(!view)}>{(view)? <Visibility/>:<VisibilityOff/>}</IconButton>
                  </InputAdornment>
                }
                label='Password'
              />
            </FormControl>
            <Button variant='contained' startIcon={<LoginIcon/>} onClick={handleDefault}>Login</Button>
          </Stack>
          <Divider sx={{marginTop:'20px',marginBottom:'20px'}}>OR</Divider>
          <Stack direction='column' spacing={1}>
            <Button variant='contained' sx={{background:'#00cc99' , textTransform:'capitalize', '&:hover':{background:'#00b359'}}}
              startIcon={<GoogleIcon/>} href={pathOauthURL+"/google"} rel='noreference noopener'>Login with Google</Button>
            <Button variant='contained' sx={{background:'#6666ff', textTransform:'capitalize'}}
              startIcon={<FacebookIcon/>} href={pathOauthURL+"/facebook"} rel='noreference noopener'>Login with Facebook</Button>
            <Button variant='contained' sx={{background:'#333333', textTransform:'capitalize', '&:hover':{background:'#0d0d0d'}}}
              startIcon={<GitHubIcon/>} href={pathOauthURL+"/github"} rel='noreference noopener'>Login with Github</Button>
          </Stack>
        </Paper>
        <Link href='/signup' underline='none'>
          <Typography textAlign='center'>You haven't registered yet, let's hurry up and register</Typography>
        </Link>
      </Box>
    </Box>
  );
}
