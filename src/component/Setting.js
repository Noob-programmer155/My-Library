import React,{useState,useEffect, useCallback} from 'react';
import {profile, setProf} from './funcredux/profile_redux';
import {useSelector, useDispatch} from 'react-redux';
import {styled} from '@mui/material/styles';
import axios from 'axios';
import {Typography, Stack, Box, Button, Alert, Drawer, Accordion, AccordionSummary, AccordionDetails, Snackbar
  ,ButtonGroup, IconButton, Paper, Divider, TextField, Avatar, Table, TableBody, TableRow, TableCell, Link} from '@mui/material';
import {useHistory} from 'react-router-dom';
import {logOutURL, verUserURL, imageUserURL,upgradeUserURL,verifyPasswordURL,modifyUserURL,changePasswordURL} from './constant/constantDataURL';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import {OnDeleteComponent, PasswordContainer, ContainerFeedback, getBase64, UploadImage} from './subcomponent/otherComponent';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AccordionButton = styled(Button)({
  borderRadius:0,
  color:'#000000',
  backgroundColor:'rgba(0,0,0,.125)',
  borderColor:'transparent',
  '&:hover':{
    backgroundColor:'rgba(0,0,0,.3)'
  }
})

const MobileButton = styled(Button)({
  borderRadius:0,
  color:'#000000',
  backgroundColor:'rgba(0,0,0,.125)',
  borderColor:'transparent',
  '&:focus':{
    color:'#ffff',
    backgroundColor:'#9999ff',
  },
  '&:active':{
    color:'#ffff',
    backgroundColor:'#9999ff',
  }
})

const CustomTextField = styled(TextField)({
  '& label':{
    color:'rgba(0, 0, 0, 0.2)',
    transition: (theme) => theme.transitions.create('color')
  },
  '& label.Mui-focused':{
    color:'#000000',
  },
  '& .MuiInput-underline:after':{
    borderBottomColor:'#000000',
  },
  '& .MuiInputBase-root': {
    color:'#000000',
    borderRadius:0,
    '& fieldset':{
      border:'none',
      borderBottom:'1px solid #000000',
    },
    '&:hover fieldset':{
      border:'none',
      borderBottom:'2px solid #000000',
    },
    '&.Mui-focused fieldset': {
      borderBottom:'2px solid skyblue',
    },
  },
})

function InfoPanel(props) {
  const {role, onUpgrade, id} = props;
  const color = [{role:'ANON',bg:'#33cccc',fg:'#0066ff'},{role:'USER',bg:'#ffb84d',fg:'#ff6600'}]
  var setColor = (role)?color.find((a)=>a.role===role):null
  const title = [{role:'ANON',title:"Verify Your Email"},{role:'USER',title:"Your Account Needs to be Upgraded"}]
  var setTitle = (role)?title.find((a)=>a.role===role):null
  const desc = [{role:'ANON',desc:"Please verify your email to become our members and \
    you can download all books in here whatever you want"},{role:'USER',desc:"Upgrade your account to open new feature 'My Library' in your profile box,\
    with this feature you can add or modify your own books"}]
  var setDesc = (role)?desc.find((a)=>a.role===role):null
  return(
    <>
      {(role)? (['ANON','USER'].includes(role))?
        <Paper id={id} sx={{backgroundColor:(setColor)?setColor.bg:'inherit',
          color:(setColor)?setColor.fg:'inherit', padding:'10px'}}>
          <Box display='block'>
            <Typography variant='h5' sx={{fontWeight:700}}>{(setTitle)?setTitle.title:''}</Typography>
            <Divider/>
            <Typography sx={{marginTop:'10px',marginBottom:'10px',textAlign:'justify', textIndent:'20px'}}>{(setDesc)?setDesc.desc:''}</Typography>
            {(role === 'USER')?
                <Button onClick={() => (onUpgrade)?onUpgrade(true):null}>Click here to upgrade your account</Button>:<></>
            }
          </Box>
        </Paper>:<></>:<></>
      }
    </>
  )
}
export default function Setting() {
  const history = useHistory();
  const dispatch = useDispatch();
  const prof = useSelector(profile);
  const [open, setOpen] = useState();
  const [imgOpen, setImgOpen] = useState(false);
  const [error, setError] = useState();
  const [preventClick, setPreventClick] = useState(false);
  const [upgrade,setUpgrade]=useState();
  const [img, setImg] = useState({data:null});
  const [imgFile, setImgFile] = useState();
  const [verify,setVerify]=useState();
  const [newPassword, setNewPassword] = useState({
    oldPassword:'',
    newPassword:''
  });
  const [password, setPassword] = useState();
  const [edit, setEdit] = useState();
  const [respon, setRespon] = useState();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const handleChange = (ref) => (e) => {
    setData({...data, [ref]:e.target.value})
  }
  const handleLogout = () => {
    axios.post(logOutURL,null,{
      withCredentials:true,
    }).then((a) => history.push("/")).catch(err => err.message)
    setOpen(false)
  }
  const getprof = useCallback((n)=>
    dispatch(setProf({
      id: n.id,
      name: n.name,
      email:n.email,
      role:n.role,
      imageUrl:n.image_url})),[dispatch])
  useEffect(()=>{
    axios.get(verUserURL,{
      withCredentials:true,
    }).then(a => {
      if (a.data){
        getprof(a.data);
        setData({name: a.data.name,
        email: a.data.email,
        password: null});
      }
    }).catch(err => {setError(err.message);history.push('/login');})
  },[])
  const defaultVer = (
    <Paper sx={{width:'30%',maxWidth:'30%', display:{xs:'none', md:'block'}, paddingTop:'20px', paddingBottom:'20px'}}>
      <Stack>
        <Box display='flex' alignItems='center'>
          <IconButton sx={{color:'#000000', borderRadius:0, padding:'10px'}} onClick={() => history.push('/')}>
            <ArrowBackIosNewIcon/>
            <SettingsIcon sx={{fontSize:'4vw'}}/>
          </IconButton>
          <Typography variant='h1' sx={{fontSize:'4vw',marginLeft:'10px'}}>Settings</Typography>
        </Box>
        <Accordion square>
          <AccordionSummary expandIcon={null} sx={{width:'100%','&:hover':{backgroundColor:'#e6e6e6'}}}>
            <Box display='flex' justifyContent='center' alignItems='center'>
              <ManageAccountsIcon sx={{fontSize:'6vw'}}/>
              <Typography sx={{fontSize:'2.4vw', marginLeft:'10px'}}>My Account</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{width:'100%',padding:0}}>
            <ButtonGroup
              orientation="vertical"
              variant="contained"
              color='inherit'
              sx={{width:'100%'}}
              >
                <AccordionButton href="#generalInfo">General Info</AccordionButton>
                <AccordionButton href="#upg_acc_container">Upgrade Account</AccordionButton>
            </ButtonGroup>
          </AccordionDetails>
        </Accordion>
        <Button variant='contained' color='error' sx={{textTransform:'capitalize',width:'100%',
          justifyContent:'flex-start',borderRadius:0, fontSize:'2.4vw','& .MuiButton-startIcon':{
            '& > *:first-child':{
              fontSize:'6vw',
            }
          }}} onClick={handleLogout} startIcon={<LogoutIcon/>}>
            LogOut
        </Button>
      </Stack>
    </Paper>
  )
  const mobileVer = (
    <>
      <Box sx={{display:{xs:'flex', md:'none'}}} alignItems='center'>
        <IconButton onClick={()=>setOpen(true)}><MenuIcon/></IconButton>
        <Typography variant='h1' sx={{fontSize:'6vw',marginLeft:'10px'}}>Settings</Typography>
      </Box>
      <Drawer anchor='left' open={open} onClose={() => setOpen(false)}>
        <Stack>
          <Box display='flex' alignItems='center' sx={{padding:'10px'}}>
            <IconButton sx={{borderRadius:'5px'}} onClick={()=>setOpen(false)}><ArrowBackIosNewIcon/></IconButton>
            <Typography variant='h1' sx={{fontSize:'4vw',marginLeft:'5px'}}>Settings</Typography>
          </Box>
          <MobileButton variant='contained' href="/" onClick={()=>setOpen(false)}>Return Home</MobileButton>
          <MobileButton variant='contained' href="#generalInfo" onClick={()=>setOpen(false)}>General Info</MobileButton>
          {(prof && prof.role === "USER")?
            <MobileButton variant='contained' href="#upg_acc_container" onClick={()=>setOpen(false)}>Upgrade Account</MobileButton>:
            <></>
          }
          <MobileButton variant='contained' onClick={handleLogout}>LogOut</MobileButton>
        </Stack>
      </Drawer>
    </>
  )
  const handleUpgrade = () => {
    setPreventClick(true);
    var form = new FormData();
    form.append('password',password)
    axios.post(verifyPasswordURL,form,{
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      }
    }).then(a => {
        axios.post(upgradeUserURL, null,{
          withCredentials:true,
          headers:{
            'Content-Type':'multipart/form-data',
          }}).then((a) => {setUpgrade(false);setVerify(false);setPreventClick(false);setRespon('Upgrade Account Success !!!, please refresh this page');setPassword('');}).catch(err => {setError(err.message);setUpgrade(false);setVerify(false);})
        }).catch(err => {setError(err.message);setUpgrade(false);setVerify(false);setPreventClick(false);setPassword('');})
  }
  const handleImage = (e) => {
    var files = e.target.files[0];
    if(files){
      getBase64(files).then(a => {setImg({...img, data:a});setImgOpen(true);})
    }
  }
  const handleModif = () => {
    setPreventClick(true);
    var modifyForm = new FormData();
    modifyForm.append('name',(data.name)?data.name:prof.name)
    modifyForm.append('email',(data.email)?data.email:prof.email)
    modifyForm.append('image',imgFile)
    axios.put(modifyUserURL,modifyForm,{
      withCredentials:true,
    }).then(a => {if(a.data != null){
        getprof(a.data);
        setRespon('Modify Account Success !!!, please refresh this page');
        setPreventClick(false);
    }}).catch(err => {setError(err.message);setPreventClick(false);})
  }

  const handleChangePassword = () => {
    setPreventClick(true)
    var changePass = new FormData();
    changePass.append('oldPassword',newPassword.oldPassword);
    changePass.append('newPassword',newPassword.newPassword);
    axios.post(changePasswordURL, changePass, {
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      }
    }).then(a => {setRespon('Your Password has been Changed');
      setPreventClick(false);
      setNewPassword({newPassword:'', oldPassword:''})
    }).catch(err => {setError('Wrong Password');setPreventClick(false);})
  }
  return (
    <>
      <Stack direction={{xs:'column', md:'row'}} sx={{padding:'10px', display:'flex', flexWrap:{xs:'wrap', md:'nowrap'}}}>
        {defaultVer}
        {mobileVer}
        <Paper sx={{width:{xs:'100%',md:'70%'}, marginLeft:'5px', paddingTop:'20px', paddingBottom:'20px'}}>
          <Stack spacing={3} sx={{padding:'5px'}}>
            <Box id='generalInfo'>
              <Typography variant='h1' sx={{fontSize:{xs:'9vw',md:'4vw'},marginLeft:'10px',marginBottom:'3px', textAlign:'center'}}>General Info</Typography>
              <Divider/>
            </Box>
            <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap'>
              <label htmlFor='fotouser-setting'>
                <Avatar component='span' sx={{width:(theme)=>theme.spacing(12),height:(theme)=>theme.spacing(12), marginTop:'20px'}}
                  src={(img.data)? img.data : (prof && prof.imageUrl)?
                    ((prof.imageUrl.substring(0,4)==='http')?prof.imageUrl:`${imageUserURL}${prof.imageUrl}`) : "sGd4TFc/"} alt={(prof)?prof.name:''}/>
              </label>
              <input id='fotouser-setting' type='file' accept="image/*"
                disabled={(prof && prof.imageUrl)? ((prof.imageUrl.substring(0,4)==='http')?true:false):false} onChange={handleImage} style={{display:'none'}}/>
              <Typography sx={{width:'100%',textAlign:'center',color:'#bfbfbf'}}>
                {(prof && prof.imageUrl)?((prof.imageUrl.substring(0,4)==='http')?
                  '':'(click avatar to change your image)'):'(click avatar to change your image)'
                }
              </Typography>
            </Box>
            <Table>
              <TableBody>
                {(prof)?
                    [{title:'Username', data:data.name, ref:'name',helpText:'(Click Edit Icon to change)'},
                    {title:'Email', data:data.email, ref:'email',helpText:'(Click Edit Icon to change)'},
                    {title:'Your Role', data: prof.role, ref:'role',helpText:''}].map(a => (
                      <TableRow key={a.title}>
                        <TableCell sx={{border:'none'}}><Typography>{a.title}</Typography></TableCell>
                        {(a.ref !== 'role')?
                          <TableCell sx={{border:'none'}}><CustomTextField variant='outlined' disabled={edit !== a.title}
                            size='small' value={a.data} onChange={handleChange(a.ref)} helperText={a.helpText}/>
                            <IconButton size='small' sx={{borderBottom:'1px dashed skyblue', color:'skyblue', borderRadius:0}} onClick={() => setEdit(a.title)}>
                              <EditIcon color='inherit'/>
                            </IconButton>
                          </TableCell>:
                          <TableCell sx={{border:'none'}}><Typography>{a.data}</Typography>
                          </TableCell>
                        }
                      </TableRow>
                    )):<></>
                }
              </TableBody>
            </Table>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Change Your Password ? </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <CustomTextField type='text' variant='outlined' size='small' value={newPassword.oldPassword}
                    onChange={(a)=> setNewPassword({...newPassword, oldPassword:a.target.value})} label='Old Password'/>
                  <CustomTextField type='password' variant='outlined' size='small' value={newPassword.newPassword}
                    onChange={(a)=> setNewPassword({...newPassword, newPassword:a.target.value})} label='New Password'/>
                  <Button variant="contained" disabled={preventClick} onClick={handleChangePassword}>Change Password</Button>
                </Stack>
              </AccordionDetails>
            </Accordion>
            {(prof)?
              <>
                <InfoPanel id='upg_acc_container' role={prof.role} onUpgrade={setUpgrade}/>
                {(img.data || data.name !== prof.name || data.email !== prof.email)?
                  <Box display='flex'>
                    <Button disabled={preventClick} onClick={handleModif}>Save Changes</Button>
                    <Button onClick={() => {setData({...data, name:(prof)?prof.name:''});setData({...data, email:(prof)?prof.email:''});setImg({...img, data:null})}}>Cancel</Button>
                  </Box>:<></>
                }
              </>:<></>
            }
          </Stack>
        </Paper>
      </Stack>
      <UploadImage open={imgOpen} setOpen={setImgOpen} img={img} setImg={setImg} imgStore={setImgFile}/>
      <OnDeleteComponent onDelete={() => setVerify(true)} title='Upgrade Your Account ?'
        content='Are you sure to upgrade your account to become Seller ?'
        onClose={() => setUpgrade(false)} open={upgrade} buttonTitle='Upgrade'/>
      <PasswordContainer isVerify={verify} setVerify={setVerify} isPassword={password} setPassword={setPassword}
        onDelete={handleUpgrade} buttonTitle='Verify' disabled={preventClick}/>
      <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={(respon)?respon:error}>
        <ContainerFeedback severity={(respon)? 'success':'error'} onClose={a => {setError(null);setRespon(null)}}>
          {(respon)? respon:error}
        </ContainerFeedback>
      </Snackbar>
    </>
  );
}
