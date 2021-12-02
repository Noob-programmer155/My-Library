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
import {getBase64, UploadImage} from './subcomponent/otherComponent';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {useHistory} from 'react-router-dom';

export default function SignUp() {
  const [data, setData]=useState({
    name:'',
    password:'',
    email:'',
    verPassword:''
  });
  const [img, setImg] = useState({data:null})
  const [imgFile, setImgFile] = useState()
  const [open, setOpen] = useState(false)
  const [error, setError]=useState()
  const history = useHistory();
  const [verPass, setVerPass] = useState();
  const [preventClick, setPreventClick] = useState(false);
  const handlesignUpURL = () => {
    setPreventClick(true)
    let user = new FormData()
    user.append('name',data.name)
    user.append('password',data.password)
    user.append('email',data.email)
    user.append('image',imgFile)
    axios.post(signUpURL, user,{
      withCredentials:true,
    }).then(res => {if(res.data !== null) {
      history.push("/?verify=1")
    }})
    .catch(err => {setError("Internal Server Error");setPreventClick(false);})
  }
  const handleVerPass= (a) => {
    if(data.password && a.target.value===data.password){
      setVerPass(false);
    }
    else{
      setVerPass(true);
    }
    setData({...data, verPassword: a.target.value})
  }
  const handleImage= (a) => {
    var files = a.target.files[0];
    if(files){
      getBase64(files).then(a => {setImg({...img,data:a});setOpen(true);})
    }
  }
  const handleKeyDown = (e) => {
    if(e.keyCode === 13){
      if(data.name && data.password && data.email && data.verPassword === data.password){
        handlesignUpURL();
      }
      else{
        setError('please add all field')
      }
    }
  }
  return(
    <Box justifyContent='center' alignItems='center' display='flex' sx={{height:'100vh'}} flexWrap='wrap'>
      <Box justifyContent='center' alignItems='center' display='flex' width='100%'>
      {(error)?
        (<Alert variant="filled" severity="error" onClose={() => setError(null)} sx={{alignItems:'center'}}>
            Error:<br/>{error}
          </Alert>):(<></>)
      }
      </Box>
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
                (img.data)? <Avatar src={img.data} sx={{width:(th) => th.spacing(10), height:(th) => th.spacing(10)}}/>:<AddPhotoAlternateIcon/>
              }</Button>
            </label>
          </Box>
          <Stack direction='column' spacing={2} sx={{marginTop:'20px'}}>
            <TextField label='Username' variant='outlined' onKeyDown={handleKeyDown} value={data.name} onChange={(a) => setData({...data, name: a.target.value})}
              InputProps={{
                startAdornment:
                  <InputAdornment position='start'>
                    <Box display='flex'><PersonIcon/></Box>
                  </InputAdornment>
            }}/>
            <TextField label='Email' variant='outlined' onKeyDown={handleKeyDown} value={data.email} onChange={(a) => setData({...data, email: a.target.value})}
              InputProps={{
                startAdornment:
                  <InputAdornment position='start'>
                    <Box display='flex'><AlternateEmailIcon/></Box>
                  </InputAdornment>
            }} type='email'/>
            <TextField label='Password' variant='outlined' onKeyDown={handleKeyDown} value={data.password} onChange={(a) => setData({...data, password: a.target.value})}
              InputProps={{
                startAdornment:
                  <InputAdornment position='start'>
                    <Box display='flex'><LockIcon/></Box>
                  </InputAdornment>
            }} type='password'/>
            <TextField label='Verify Password' onKeyDown={handleKeyDown} variant='outlined' value={data.verPassword} onChange={handleVerPass} error={verPass}
              InputProps={{
                startAdornment:
                  <InputAdornment position='start'>
                    <Box display='flex'><LockOpenIcon/></Box>
                  </InputAdornment>
            }} type='password' helperText={verPass? "Incorrect entry":""}/>
            <Box justifyContent='center' alignItems='center' display='flex'>
              <Button variant='contained' onClick={handlesignUpURL} disabled={preventClick || verPass || !data.verPassword || !data.name || !data.email || !data.password}>SignUp</Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
      <UploadImage open={open} setOpen={setOpen} img={img} setImg={setImg} imgStore={setImgFile}/>
    </Box>
  );
};
