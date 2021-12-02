import React, {forwardRef, useState, useEffect} from 'react';
import axios from 'axios';
import {Alert, useMediaQuery, Box, TextField, IconButton, Button, Stack, Card, CardMedia, CardActionArea, Typography,
 Dialog, DialogActions, DialogContent,DialogContentText, DialogTitle,Backdrop, Chip, Autocomplete, CircularProgress} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {addBookTypeURL,imageBookURL} from '../constant/constantDataURL';
import BookView from './Book_view';
import WarningIcon from '@mui/icons-material/Warning';
import {styled} from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
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
  const {index, ids, reverseids, value, setOpenModify, data, ...attr} = props;
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
              setOpenModify={setOpenModify}
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
    <Backdrop open={open} sx={{zIndex:(theme)=> theme.zIndex.drawer + 9}}>
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

export const CustomTextField = styled(TextField)({
  '& label':{
    color:'rgba(0, 0, 0, 0.2)',
    transition: (theme) => theme.transitions.create('color')
  },
  '& label.Mui-focused':{
    color:'#ffff',
  },
  '& .MuiInput-underline:after':{
    borderBottomColor:'#ffff',
  },
  '& .MuiOutlinedInput-root': {
    color:'#ffff',
    '& fieldset':{
      border:'2px solid rgba(0, 0, 0, 0.2)',
      borderBottom:'2px solid #ffff',
    },
    '&:hover fieldset':{
      border:'2px solid rgba(0, 0, 0, 0.2)',
      borderBottom:'4px solid #0066cc',
    },
    '&.Mui-focused fieldset': {
      border:'2px solid rgba(0, 0, 0, 0.2)',
      borderBottom:'4px solid lime',
    },
  },
})


export function UploadFunc(props) {
  const {setImage, image, imageInit, fileInit, file, setFile, isImg, imgCallback, ...attr} = props
  const onDrop = (e) => {
      e.stopPropagation();
      e.preventDefault();
      let files = e.dataTransfer.files;
      if(files && files[0]){
        setFile(files[0]);
      }
  }
  const onDrag = (e) => {
    e.stopPropagation();
    e.preventDefault();
  }
  const onImg = (ev) => {
    var files = ev.target.files[0];
    if(files) {
      getBase64(files).then(a => {setImage({...image, data: a});imgCallback(true);});
    }
  }
  const onFile = (ev) => {
    var files = ev.target.files[0];
    if(files){
      setFile(files);
    }
  }
  const uploadPdf = (
    <>
      {(file || fileInit)?(
        <Card sx={{padding:'10px'}}>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <PictureAsPdfIcon color='error'/>
            <Typography sx={{flexGrow:1, marginLeft:'5px'}}>{(file)?file.name:((fileInit)?fileInit:null)}</Typography>
            <IconButton onClick={(a) => setFile(null)}><CloseIcon/></IconButton>
          </Box>
        </Card>
        ):(
          <Card {...attr}>
            <Box component='div' onDrop={onDrop} onDragOver={onDrag} onDragEnter={onDrag}>
              <label htmlFor='file-book-modify'>
                <CardActionArea component='span' sx={{paddingTop:'20px', paddingBottom:'20px'}}>
                  <Box width='100%' justifyContent='center' alignItems='center' display='flex' flexWrap='wrap'>
                    <FileUploadIcon sx={{color:'#ffff',marginTop:'10px'}}/>
                    <Typography sx={{width:'100%',textAlign:'center',fontWeight:600,
                      fontFamily:'Consolas',fontSize:'20px',color:'#e6e6e6'}}>Click</Typography>
                    <Typography sx={{width:'100%',textAlign:'center',fontWeight:600,
                      fontFamily:'Consolas',fontSize:'20px',color:'#e6e6e6'}}>Or</Typography>
                    <Typography sx={{width:'100%',textAlign:'center',fontWeight:600,
                      fontFamily:'Consolas',fontSize:'20px',color:'#e6e6e6'}}>Drag Pdf file to this area</Typography>
                  </Box>
                </CardActionArea>
              </label>
            </Box>
            <input id='file-book-modify'
                type='file'
                onChange={onFile}
                accept='.pdf'
                style={{display:'none'}}/>
          </Card>
        )
      }
    </>
  )
  const uploadImage = (
    <Card {...attr}>
      <label htmlFor='gambar-book-modify'>
        <CardActionArea component='span'>
          <CardMedia image={(image && image.data)?image.data: ((imageInit)?`${imageBookURL}${imageInit}`:null)}>
            <Box sx={{height: (theme) => theme.spacing(15)}}  justifyContent='center' alignItems='center' display='flex' flexWrap='wrap'>
              <AddPhotoAlternateIcon sx={{color:'#ffff'}}/>
              <Typography sx={{width:'100%',textAlign:'center',fontWeight:600,
                fontFamily:'Consolas',fontSize:'20px',color:'#e6e6e6'}}>Click to add image</Typography>
            </Box>
          </CardMedia>
        </CardActionArea>
      </label>
      <input id='gambar-book-modify'
          type='file'
          onChange={onImg}
          accept='image/*'
          style={{display:'none'}}/>
    </Card>
  )
  return(
    <>
      {(isImg)?
        (
          <>{uploadImage}</>
        ):(
          <>{uploadPdf}</>
        )
      }
    </>
  )
}

export function ModifyBook(props) {
  const {bookData, onError, onSuccess, onOpenModify, themes, prof, imgFile, imgView, setImgView,
    imgCallback, url, responText, labelButton, modify, ...attr} = props;
  var init = {
    title: (bookData)?bookData.title:'',
    author: (bookData)?bookData.author:'',
    publisher: (bookData)?bookData.publisher:'',
    description: (bookData)?bookData.description:''
  }
  const[typeData,setTypeData] = useState((bookData)?bookData.theme:[]);
  const[openAddTheme, setOpenAddTheme] = useState()
  const[pdfFile, setPdfFile] = useState()
  const[preventClick, setPreventClick] = useState(false)
  const[data, setData] = useState(init)
  const handleDataChange = (e, n) => {
    setTypeData([...typeData, ...n.filter((a) => {
      if(themes.indexOf(a) === -1 && typeData.indexOf(a) === -1){
        var available = true
        var form = new FormData();
        form.append('type',a)
        axios.post(addBookTypeURL,form,{
          withCredentials:true,
        }).catch(err => {onError(err.message); available = false;})
        return available;
      }
      return typeData.indexOf(a) === -1;
    })])
  }
  const onUpload = () => {
    if(data.title && data.author && data.publisher && data.description && typeData.length > 0 && prof.id && (pdfFile && imgFile || modify)){
      setPreventClick(true)
      var user = new FormData();
      if(bookData){
          user.append('idb',bookData.id);
      }
      user.append('title',data.title);
      user.append('author',data.author);
      user.append('publisher',data.publisher);
      user.append('description',data.description);
      user.append('theme',typeData);
      user.append('user',prof.id);
      user.append('favorite',true);
      user.append('file',pdfFile);
      user.append('image',imgFile);
      if(modify){
        axios.put(url,user,{
          withCredentials:true,
        }).then(a => {setPreventClick(false);onSuccess(responText);
          }).catch(err => {onError(err.message);setPreventClick(false);})
      }
      else{
        axios.post(url,user,{
          withCredentials:true,
        }).then(a => {setPreventClick(false);onSuccess(responText);
        }).catch(err => {onError(err.message);setPreventClick(false);})
      }
    }
    else {
      onError('all field must be filled (including image and file)');
    }
  }
  const handleKeyDown = (e) => {
    if(e.keyCode === 13){
      onUpload();
    }
  }
  return(
      <>
        <Stack {...attr}>
          <Stack spacing={2} direction={{xs:'column',md:'row'}}>
            <Stack spacing={2} sx={{width:{xs:'inherit', md:'80%'}}}>
              <CustomTextField type='text' onKeyDown={handleKeyDown} name='title' value={data.title}
              onChange={(a) => setData({...data, title: a.target.value})} label='Book Title'/>
              <CustomTextField type='text' onKeyDown={handleKeyDown} name='author' value={data.author}
              onChange={(a) => setData({...data, author: a.target.value})} label='Author'/>
            </Stack>
            <UploadFunc sx={{width:{xs:'inherit', md:'20%'},
                border:'4px solid rgba(89, 89, 89, .3)',
                borderStyle: 'dashed', background: 'rgba(255, 255, 255, .2)'}} setImage={setImgView} image={imgView}
                isImg={true} imgCallback={imgCallback} imageInit={(bookData)?bookData.image:null}/>
          </Stack>
          <CustomTextField type='text' onKeyDown={handleKeyDown} name='publisher' value={data.publisher}
          onChange={(a) => setData({...data, publisher: a.target.value})} label='Publisher'/>
          <CustomTextField type='text' onKeyDown={handleKeyDown} name='description' value={data.description}
          onChange={(a) => setData({...data, description: a.target.value})}
            multiline rows={4} label='Description from your book'/>
          <Autocomplete
            multiple
            freeSolo
            filterSelectedOptions
            autoComplete
            value={typeData}
            onChange={handleDataChange}
            options={(themes.length !== 0)?themes:['value','newValue']}
            renderTags={(value, params) => value.map((a,i)=>(
              <Chip variant="contained" sx={{backgroundColor:'rgba(0,0,0,0.125)',color:'white'}} key={i} label={a} {...params(i)}
                onDelete={() => setTypeData(typeData.filter(item => item !== a))}/>
            ))
            }
            renderInput = {(params) =>
              (<CustomTextField {...params} label='Book Theme' helperText="Please select your Theme"
                placeholder="Theme..."/>)}/>
          <UploadFunc sx={{border:'4px solid rgba(89, 89, 89, .3)',
            borderStyle: 'dashed', background: 'rgba(255, 255, 255, .2)'}} file={pdfFile} setFile={setPdfFile}
            isImg={false} fileInit={(bookData)?bookData.file:null}/>
          <Box justifyContent='center' alignItems='center' display='flex'>
            <Button variant='contained' sx={{background:'#0099cc'}} onClick={onUpload}
              disabled={preventClick} startIcon={(preventClick)?<CircularProgress size={25} color="primary"/>:<></>}>{(labelButton)?labelButton:'Add Books'}</Button>
            {(bookData)?
              <Button variant='contained' color='error' sx={{marginLeft:'10px'}}
                onClick={() => onOpenModify(null)}>Cancel</Button>
                :<></>
            }
          </Box>
        </Stack>
      </>
  )
}
