import React, {forwardRef, useState} from 'react';
import {Alert, useMediaQuery, Box, TextField, IconButton, Button,
 Dialog, DialogActions, DialogContent,DialogContentText, DialogTitle} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import BookView from './Book_view';
import WarningIcon from '@mui/icons-material/Warning';

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
              description={a.description} theme={a.theme} data={a.data} favorite={a.favorite}
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
  const {onDelete, title, content, onClose, open, buttonTitle} = props;
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
        <Button onClick={onDelete}>{(buttonTitle)?buttonTitle:'Delete'}</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export const PasswordContainer = (props) => {
  const{isVerify, setVerify, isPassword, setPassword, onDelete} = props;
  return(
    <Dialog open={isVerify} onClose={() => setVerify(false)} sx={{zIndex:(theme) => theme.zIndex.drawer + 6}}>
      <DialogTitle>Confirm is that you</DialogTitle>
      <DialogContent>
        <TextField variant='filled' type='password' value={isPassword} onChange={(e) => setPassword(e.target.value)} label='Input Password'/>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDelete}>Delete</Button>
        <Button onClick={()=> setVerify(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export function getBase64(file, callback) {
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
    return canvas.toDataURL('image/jpeg',1);
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
