import React, {useEffect, useState} from 'react';
import {makeStyles} from '@mui/styles';
import {createTheme} from '@mui/material/styles';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {profile} from './funcredux/profile_redux';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PeopleIcon from '@mui/icons-material/People';
import {useHistory} from 'react-router-dom';
import {Typography, Box, IconButton, Avatar, Skeleton, Chip, Divider, Button} from '@mui/material';

const theme = createTheme();

const useStyle = makeStyles({
  root:{
    background: '#009999',
    width: '100%',
    display:'flex',
    flexWrap:'wrap',
    alignItems:'flex-start',
    justifyContent:'center',
  },
  avatar: {
    width: '20vw',
    height: '20vw',
    background: '#006666',
    marginTop: '30px',
    marginBottom: '30px',
    [theme.breakpoints.up('sm')]:{
      width: '15vw',
      height: '15vw',
    },
    [theme.breakpoints.up('md')]:{
      width: '6vw',
      height: '6vw',
    },
  },
  chip:{
    marginTop: '10px',
    color: '#ffff',
    marginRight: '5px',
    fontSize:'3vw',
    [theme.breakpoints.up('sm')]:{
      fontSize:'1.6vw',
    },
    [theme.breakpoints.up('md')]:{
      fontSize:'0.8vw',
    },
  },
  chipIcon: {
    fontSize:'6vw',
    [theme.breakpoints.up('sm')]:{
      fontSize:'2.8vw',
    },
    [theme.breakpoints.up('md')]:{
      fontSize:'1.5vw',
    },
  },
  font: {
    fontFamily: 'Candara',
    color: '#e6e6e6',
    paddingBottom: '20px',
    fontSize:'5vw',
    [theme.breakpoints.up('sm')]:{
      fontSize:'3vw',
    },
    [theme.breakpoints.up('md')]:{
      fontSize:'1.2vw',
    },
  },
  font1: {
    color: '#ffff',
    marginTop: '20px',
    fontSize:'6vw',
    [theme.breakpoints.up('sm')]:{
      fontSize:'3.8vw',
    },
    [theme.breakpoints.up('md')]:{
      fontSize:'1.5vw',
    },
  },
  subfont:{
    color: '#cccccc',
    fontSize:'4.3vw',
    [theme.breakpoints.up('sm')]:{
      fontSize:'2.5vw',
    },
    [theme.breakpoints.up('md')]:{
      fontSize:'1vw',
    },
  },
  button: {
    background:'rgba(0,0,0,0.2)',
    borderRadius: 0,
    width:'100%',
    height:'70px',
    '&:hover':{
        background:'rgba(0,0,0,0.5)'
    },
  },
  skeleton1: {
    width: '15%',
    height: '20px',
    borderRadius: '20px',
    marginRight: '10px',
  },
  skeleton2: {
    width: '20px',
    height: '20px',
    marginRight: '10px',
  },
  skeleton3: {
    marginTop: '20px',
    width: '90%',
    height: '20px',
    borderRadius: '20px',
  },
  skeleton4: {
    marginTop: '30px',
    marginBottom: '30px',
    width: '20vw',
    height: '20vw',
    [theme.breakpoints.up('sm')]:{
      width: '15vw',
      height: '15vw',
    },
    [theme.breakpoints.up('md')]:{
      width: '6vw',
      height: '6vw',
    },
  },
  skeleton5: {
    width: '90%',
    height: '20px',
    borderRadius: '20px',
    marginBottom: '10px',
  },
});

export default function Profile() {
  const [error, setError] = useState();
  const [respon, setRespon] = useState();
  const style = useStyle();
  const history = useHistory();
  const userProfile = useSelector(profile);
  useEffect(() => {
    axios.get("http://localhost:8895/user/get",{
      withCredentials:true,
    }).then(a => a.data !== null && typeof a.data === 'string'? setRespon(a.data):null).catch(error => setError(error.message))
  },[]);
  const preload = (
    <>
      <Box display='flex' alignItems='center' justifyContent='flex-end' style={{paddingTop:'10px', width:'100%'}}>
        <Skeleton className={style.skeleton1} variant='rectangular'/>
        <Skeleton className={style.skeleton1} variant='rectangular'/>
        <Skeleton className={style.skeleton2} variant='circular'/>
      </Box>
      <Skeleton className={style.skeleton3} variant='rectangular'/>
      <Skeleton className={style.skeleton4} variant='circular'/>
      <Skeleton className={style.skeleton5} variant='rectangular'/>
      <Skeleton className={style.skeleton5} style={{paddingBottom:'20px'}} variant='rectangular'/>
    </>
  );
  const log = (
    <Button variant='contained' className={style.button} onClick={a => history.push('/login')}>Login</Button>
  )
  return(
      <>
        {
          (respon)? (
            <>
              <Box display='flex' alignItems='center' justifyContent='flex-end' width='100%'>
                {
                  (userProfile.role === 'MANAGER' || userProfile.role === 'ADMINISTRATIF')?
                  (<Chip className={style.chip} icon={<PeopleIcon style={{color:'#ffff'}} className={style.chipIcon}/>} label="Users" onClick={a => history.push("/hstdyw-admin")}/>):<></>
                }
                <Chip className={style.chip} icon={<LocalLibraryIcon style={{color:'#ffff'}} className={style.chipIcon}/>} label="My Library" onClick={a => history.push("/my-library")}/>
                <IconButton style={{color:'#ffff', marginRight: '5px', marginTop: '10px'}} fontSize='small'><SettingsIcon/></IconButton>
              </Box>
              <Typography className={style.font1} variant='h5' width='100%' textAlign='center'><b>{userProfile.name}</b></Typography>
              <Avatar className={style.avatar} src={(userProfile.imageUrl)? userProfile.imageUrl : ((userProfile.image)? userProfile.image : "sGd4TFc/")} alt={userProfile.name}/>
              <Typography className={style.font} variant='h6' width='100%' textAlign='center'>
                {userProfile.email}<br/>
                <Divider style={{background:'#ffff'}} light variant='middle'/>
                <span className={style.subfont}><i>{userProfile.role}</i></span>
              </Typography>
            </>
          ):(
          <>
            {
            (error)? (
              <>
                {preload}
                {log}
              </>
            ):(
              <>
                {preload}
              </>
              )
            }
          </>)
          }
      </>
  );
}
