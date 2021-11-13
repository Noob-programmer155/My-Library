import React,{useState} from 'react';
import axios from 'axios';
import {Paper, Box, Stack, Typography, Button, TextField, InputAdornment, Divider, IconButton, Avatar, Alert} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {signUpURL} from './constant/constantDataURL';
import {getBase64} from './subcomponent/otherComponent';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {useHistory} from 'react-router-dom';

export default function SignUp() {
  const [data, setData]=useState({
    name:'',
    pass:'',
    email:'',
  });
  const [error, setError]=useState()
  const [img, setImg] =useState()
  const history = useHistory();
  const [verPass, setVerPass] = useState();
  const handlesignUpURL = () => {
    let user = new FormData()
    user.append('name',data.name)
    user.append('password',data.pass)
    user.append('email',data.email)
    user.append('image',img)
    axios.post(signUpURL, user, {
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      },
    }).then(res => {if(res.data !== null) {
      history.push("/?verify=1")
    }})
    .catch(err => setError(err.message))
  }
  const handleVerPass= (a) => {
    if(data.pass && a.target.value===data.pass){
      setVerPass(false);
    }
    else{
      setVerPass(true);
    }
  }
  const handleImage= (a) => {
    if(a.target.files[0]){
      getBase64(a.target.files[0],setImg)
    }
  }
  return(
    <Box justifyContent='center' alignItems='center' display='flex' sx={{height:'100vh'}}>
      {(error)?
        (<Alert variant="filled" severity="error" onClose={() => setError(null)} sx={{alignItems:'center'}}>
            Error:<br/>{error}
          </Alert>):(<></>)
      }
      <Box>
        <Paper elevation={7} sx={{borderRadius:'20px', minWidth:'250px', maxWidth:'100%', padding:'15px'}}>
          <Typography sx={{fontFamily:'Century Gothic', textAlign:'center', fontWeight:800, color: '#1a8cff',
            fontSize:{xs: '10vw', sm:'5vw', md:'2.3vw'}}}>Sign Up</Typography>
          <Divider/>
          <Box justifyContent='center' alignItems='center' display='flex' sx={{marginTop:'20px'}}>
            <label htmlFor='fotouser'>
              <input id='fotouser' type='file' accept="image/*" onChange={handleImage} style={{display:'none'}}/>
              <Button sx={{backgroundColor:'#f2f2f2', borderRadius:'50%', width:(th) => th.spacing(10),
                height:(th) => th.spacing(10), '&:hover':{backgroundColor:'#d9d9d9'}}} component='span'>{
                (img)? <Avatar src={img} sx={{width:(th) => th.spacing(10), height:(th) => th.spacing(10)}}/>:<AddPhotoAlternateIcon/>
              }</Button>
            </label>
          </Box>
          <Stack direction='column' spacing={2} sx={{marginTop:'20px'}}>
            <TextField label='Username' variant='outlined' value={data.name} onChange={a => setData({...data, name: a.target.value})}
              InputProps={{
                startAdornment:
                  <InputAdornment position='start'>
                    <Box display='flex'><PersonIcon/></Box>
                  </InputAdornment>
            }}/>
            <TextField label='Email' variant='outlined' value={data.email} onChange={a => setData({...data, email: a.target.value})}
              InputProps={{
                startAdornment:
                  <InputAdornment position='start'>
                    <Box display='flex'><AlternateEmailIcon/></Box>
                  </InputAdornment>
            }} type='email'/>
            <TextField label='Password' variant='outlined' value={data.pass} onChange={a => setData({...data, pass: a.target.value})}
              InputProps={{
                startAdornment:
                  <InputAdornment position='start'>
                    <Box display='flex'><LockIcon/></Box>
                  </InputAdornment>
            }} type='password'/>
            <TextField label='Verify Password' variant='outlined' onChange={handleVerPass} error={verPass}
              InputProps={{
                startAdornment:
                  <InputAdornment position='start'>
                    <Box display='flex'><LockOpenIcon/></Box>
                  </InputAdornment>
            }} type='password' helperText={verPass? "Incorrect entry":""}/>
            <Box justifyContent='center' alignItems='center' display='flex'>
              <Button variant='contained' onClick={handlesignUpURL} disabled={verPass || !data.name || !data.email || !data.pass}>SignUp</Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};
