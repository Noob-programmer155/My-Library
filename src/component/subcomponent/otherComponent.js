import React, {forwardRef, useState, useEffect} from 'react';
import {Alert, useMediaQuery, Box, TextField, IconButton, Button, Stack,
 Dialog, DialogActions, DialogContent,DialogContentText, DialogTitle,Backdrop} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import BookView from './Book_view';
import WarningIcon from '@mui/icons-material/Warning';
import Croppie from 'croppie';

export const ContainerFeedback = forwardRef(function ContainerFeedback(props, ref) {
  return <Alert elevation={5} ref={ref} variant='filled' {...props}/>
})

export function Search(props) {
  // const{} = props
  const md = useMediaQuery('(min-width:900px)')
  return(<Box display='flex' justifyContent='flex-start' alignItems='center' sx={{paddingLeft:'10px', paddingBottom:'30px'}}>
    <TextField hiddenLabel placeholder='Search...' size='small'
      inputProps={{
        style: {
          color:'#ffff',
          borderRadius: '20px',
          height: (md)? '17px':'9px',
          fontSize: (md)?  '15px':'7px',
        }
      }}
      InputProps={{
        style: {borderRadius: '20px'}
      }}/>
    <IconButton sx={{color:'#ffff', background:'#004d4d', marginLeft:'7px', '&:hover':{background:'#004d4d'}}}><SearchIcon sx={{fontSize: (md)? '25px':'10px'}}/></IconButton>
    <IconButton sx={{color:'#ffff', background:'#004d4d', marginLeft:'7px', '&:hover':{background:'#004d4d'}}}><FilterAltIcon sx={{fontSize: (md)? '25px':'10px'}}/></IconButton>
  </Box>)
}

export function Container(props) {
  const {index, ids, reverseids, value, data, ...attr} = props;
  const clone = []
  for(var s = 0; s < 20; s++){
    clone.push(<BookView key={s} id={null} sx={{marginBottom:(theme) => theme.spacing(1), marginRight: (theme) => theme.spacing(1)}}/>)
  }
  return(
    <div id={`${ids}${index}`} hidden={value !== index} aria-labelledby={`${reverseids}${index}`}>
      <Box display='flex' flexWrap='wrap' sx={{maxWidth:'100%', maxHeight:'500px', overflow:'auto'}} {...attr}>
      {(data)?
        (data.map((a,i) => (
            <BookView key={i} id={a.id} title={a.title} author={a.author} image={a.image}
              publisher={a.publisher} date={a.publishDate} status={a.status}
              description={a.description} theme={a.theme} data={a.file} favorite={a.favorite}
              sx={{marginBottom: (theme) => theme.spacing(1), marginRight: (theme) => theme.spacing(1)}}/>
          ))
        ):(
          <>
            {clone}
          </>)
      }
      </Box>
    </div>
  );
}

export function OnDeleteComponent(props) {
  const {onDelete, title, content, onClose, open, buttonTitle, disabled} = props;
  return(
    <Dialog open={Boolean(open)} onClose={onClose} sx={{zIndex: (theme) => theme.zIndex.drawer + 5}}>
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent sx={{display:'flex', justifyContent:'center',alignItems:'center'}}>
        <WarningIcon sx={{fontSize:'80px', marginRight:'10px', color:'#ffcc00'}}/>
        <DialogContentText>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={disabled} onClick={onDelete}>{buttonTitle}</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
OnDeleteComponent.defaultProps = {
  disabled : false,
  buttonTitle : 'Delete'
}

export const PasswordContainer = (props) => {
  const{isVerify, setVerify, isPassword, setPassword, onDelete, buttonTitle, disabled} = props;
  return(
    <Dialog open={isVerify} onClose={() => {setVerify(false);setPassword('');}} sx={{zIndex:(theme) => theme.zIndex.drawer + 6}}>
      <DialogTitle>Confirm is that you</DialogTitle>
      <DialogContent>
        <TextField variant='filled' type='password' value={isPassword} onChange={(e) => setPassword(e.target.value)} label='Input Password'/>
      </DialogContent>
      <DialogActions>
        <Button disabled={disabled} onClick={onDelete}>{buttonTitle}</Button>
        <Button onClick={()=> {setPassword('');setVerify(false);}}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
PasswordContainer.defaultProps = {
  disabled : false,
  buttonTitle : 'Delete'
}

export function UploadImage(props) {
  const {open,setOpen,img, setImg, imgStore, type, viewport, boundary} = props
  const [image, setImage] = useState();
  const handleSetImage = () => {
    if(image){
      image.result({type:'blob',circle:(type === 'square')?false:true}).then(file => imgStore(file))
      image.result({type:'base64',circle:(type === 'square')?false:true}).then(data => setImg({...img,data:data}))
    }
    setOpen(false);
  }
  useEffect(()=>{
    if(image){
      if(img.data){
        image.bind({
          url: img.data
        })
      }
    }
    else{
      setImage(new Croppie(document.getElementById('imageChange1'),{
        boundary:{
          width: boundary.width,
          height: boundary.height
        },
        viewport:{
          width:viewport.width,
          height:viewport.height,
          type:type
        }
      }))
    }
  },[img])
  return(
    <Backdrop open={open}>
      <Stack>
        <Box>
          <Box id='imageChange1'></Box>
        </Box>
        <Stack sx={{marginTop:'20px'}}direction='row' spacing={2} justifyContent='center' alignItems='center'>
          <Button variant='contained' onClick={handleSetImage}>Set Image</Button>
          <Button variant='contained' onClick={() => {setOpen(false);setImg({...img,data:null});}}>Cancel</Button>
        </Stack>
      </Stack>
    </Backdrop>
  );
}
UploadImage.defaultProps = {
  type : 'circle',
  viewport : {width:200, height:200},
  boundary : {width:'100vw', height:'80vh'}
}


export function getBase64(file) {
  // const resize = (img) => {
  //   var canvas = document.createElement('canvas');
  //   var width = img.width;
  //   var height = img.height;
  //   if(width > height){
  //     if (width > 800){
  //       height = Math.round(height *= 800 / width);
  //       width = 800;
  //     }
  //   } else {
  //     if (height > 600) {
  //       width = Math.round(width *= 600 / height);
  //       height = 600;
  //     }
  //   }
  //   canvas.width = width;
  //   canvas.height = height;
  //   var data = canvas.getContext('2d');
  //   data.drawImage(img,0,0,width,height);
  //   return canvas.toDataURL('image/jpeg',1);
  // }
  return new Promise(function(success, error) {
    var read = new FileReader();
    read.readAsDataURL(file);
    read.onload = function (e) {
      success(e.target.result)
      // var image = new Image();
      // image.src = url;
      //
      // image.onload = function () {
      //   callback({...prevData, image:resize(image)});
      // }
    }
    read.onerror = function (s) {
      error(s);
    }
  })
}
