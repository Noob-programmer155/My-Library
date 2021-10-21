import React,{useState} from 'react';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {setProf} from './funcredux/profile_redux';
import {Paper, Box, Stack, Typography, Button, TextField, InputAdornment, Divider, IconButton, Avatar} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {signUp} from './constant/constantDataURL';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {useHistory} from 'react-router-dom';

function getBase64(file, callback) {
  const resize = (img) => {
    var canvas = document.createElement('canvas');
    var width = img.width;
    var height = img.height;
    if(width > height){
      if (width > 800){
        height = Math.round(height *= 800 / width);
        width = 800;
      }
    } else {
      if (height > 600) {
        width = Math.round(width *= 600 / height);
        height = 600;
      }
    }
    canvas.width = width;
    canvas.height = height;
    var data = canvas.getContext('2d');
    data.drawImage(img,0,0,width,height);
    return canvas.toDataURL('image/jpeg',0.8);
  }

  var read = new FileReader();
  read.readAsArrayBuffer(file);
  read.onload = function (e) {
    var data = new Blob([e.target.result]);
    window.URL = window.URL || window.webkitURL;
    var url = window.URL.createObjectURL(data);

    var image = new Image();
    image.src = url;

    image.onload = function () {
      callback(resize(image));
    }
  }
  read.onerror = function (s) {
    alert(s);
  }
}

export default function SignUp() {
  const [data, setData]=useState({
    name:'',
    pass:'',
    email:'',
  });
  const [img, setImg] =useState()
  const history = useHistory();
  const [verPass, setVerPass] = useState();
  const dispatch = useDispatch();
  const handlesignup = () => {
    let user = new FormData()
    user.append('name',data.name)
    user.append('password',data.pass)
    user.append('email',data.email)
    user.append('image',img)
    axios.post(signUp, user, {
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      },
    }).then(res => {if(res.data !== null) {
      dispatch(setProf({
        id:res.data.id,
        name:res.data.name,
        email:res.data.email,
        role:res.data.role,
        image:res.data.image,
        imageUrl:res.data.image_url,
      }))
      history.push("/?verify=1")
    }})
    .catch(err => alert(err.message))
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
    console.log(img)
  }
  return(
    <Box justifyContent='center' alignItems='center' display='flex' sx={{height:'100vh'}}>
      <Box>
        <Paper elevation={7} sx={{borderRadius:'20px', minWidth:'250px', maxWidth:'100%', padding:'15px'}}>
          <Typography sx={{fontFamily:'Century Gothic', textAlign:'center', fontWeight:800, color: '#1a8cff',
            fontSize:{xs: '10vw', sm:'5vw', md:'2.3vw'}}}>Sign Up</Typography>
          <Divider/>
          <Box justifyContent='center' alignItems='center' display='flex' sx={{marginTop:'20px'}}>
            <label htmlFor='fotouser'>
              <input id='fotouser' type='file' accept="image/*" onChange={handleImage} style={{display:'none'}}/>
              <Button sx={{background:'#b3b3b3', borderRadius:'50%', width:(th) => th.spacing(10), height:(th) => th.spacing(10)}} component='span'>{
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
              <Button variant='contained' onClick={handlesignup} disabled={verPass || !data.name || !data.email || !data.pass}>SignUp</Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};
