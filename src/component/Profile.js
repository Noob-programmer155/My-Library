import React, {useEffect, useState} from 'react';
import {makeStyles} from '@mui/styles';
import {createTheme} from '@mui/material/styles';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {profile, setProf, setOnline, userOnline} from './funcredux/profile_redux';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PeopleIcon from '@mui/icons-material/People';
import {useHistory} from 'react-router-dom';
import {verUserURL,imageUserURL,addUserOnlineURL,deleteUserOnlineURL} from './constant/constantDataURL';
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
    textTransform:'capitalize',
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

export default function Profile(props) {
  const {error, onerror, container} = props;
  const style = useStyle();
  const history = useHistory();
  const dispatch = useDispatch();
  const userProfile = useSelector(profile);
  const isOnline = useSelector(userOnline);
  const [respon, setRespon] = useState('sa');
  useEffect(async() => {
    axios.get(verUserURL,{
      withCredentials:true,
    }).then(a => {if (a.data !== null){
      dispatch(setProf({
        id: a.data.id,
        name: a.data.name,
        email:a.data.email,
        role:a.data.role,
        imageUrl:a.data.image_url}));
      setRespon(true);
      if(window.navigator.onLine){
        if(!isOnline){
          axios.post(addUserOnlineURL,a.data.id,{
            withCredentials:true,
          }).then(a => dispatch(setOnline(true)))
          .catch(err => onerror(err.message))
        }
      }
      else{
        axios.delete(deleteUserOnlineURL,{
          withCredentials:true,
          params:{
            id: a.data.id,
          },
        }).then(a => dispatch(setOnline(false)))
        .catch(err => onerror(err.message))
      }
    }
    else {
      onerror("there is an incorrect response from server, please try again");
    }}).catch(err => {onerror(err.message);})//history.push("/");})
    if(container === "library"){
      if(!userProfile || userProfile.role !== 'SELLER') {
        history.push("/login")
      }
    }
    else if (container === "user") {
      if(!['ADMINISTRATIF','MANAGER'].includes(userProfile.role)) {
        history.push("/login")
      }
    }
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
    <Button variant='contained' className={style.button} onClick={a => history.push('/login')}>Login / SignUp</Button>
  )
  return(
      <>
        {
          (respon)? (
            <>
              <Box display='flex' alignItems='center' justifyContent='flex-end' width='100%'>
                {
                  (userProfile.role === 'MANAGER' || userProfile.role === 'ADMINISTRATIF')?
                  (<Chip className={style.chip} icon={<PeopleIcon style={{color:'#ffff'}} className={style.chipIcon}/>} label="Users" onClick={() => history.push("/hstdyw-admin")}/>):<></>
                }
                {(userProfile.role === 'SELLER')?
                  <Chip className={style.chip} icon={<LocalLibraryIcon style={{color:'#ffff'}} className={style.chipIcon}/>} label="My Library" onClick={() => history.push("/my-library")}/>:<></>
                }
                <IconButton style={{color:'#ffff', marginRight: '5px', marginTop: '10px'}} fontSize='small' onClick={() => history.push("/setting")}><SettingsIcon/></IconButton>
              </Box>
              <Typography className={style.font1} variant='h5' width='100%' textAlign='center'><b>{userProfile.name}</b></Typography>
              <Avatar className={style.avatar} src={(userProfile.imageUrl)? `${imageUserURL}${userProfile.imageUrl}` :  "sGd4TFc/"} alt={userProfile.name}/>
              <Typography className={style.font} variant='h6' width='100%' textAlign='center'>
                {userProfile.email}<br/>
                <Divider style={{background:'#ffff'}} light variant='middle'/>
                <span className={style.subfont}><i>{userProfile.role}</i></span>
              </Typography>
            </>
          ):(
          <>
            {preload}
            {log}
          </>)
          }
      </>
  );
}
