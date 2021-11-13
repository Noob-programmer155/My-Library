import React, {useState} from 'react';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {styled} from '@mui/material/styles';
import {profile} from '../funcredux/profile_redux';
import {Search} from './otherComponent';
import {bookThemes, setBookTheme} from '../funcredux/book_redux';
import {addBookURL,modifBookURL,addBookTypeURL} from '../constant/constantDataURL';
import {Typography, Stack, Paper,Button, TextField,Card, CardMedia, CardActionArea, Dialog, DialogContent, DialogTitle,
  IconButton, MenuItem, Chip, Box, Tabs, Tab, useMediaQuery, DialogContentText, DialogActions} from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';

export default function BookBuilder(props) {
  const {setError} = props;
  const [link, setLink] = useState(1);
  const handleChange = (a, n) => {
    setLink(n)
  }
  return(
    <>
      <Box>
        <Typography sx={{
          color:'#ffff',
          fontFamily:'Bodoni MT',
          marginLeft:'30px',
          fontWeight:700,
          marginBottom:'50px',
          fontSize:{xs: '10vw', sm: '8vw', md: '3vw'}
        }}>Modify <span style={{color:'aqua'}}>Your</span> <span style={{color:'#ff944d'}}>Book</span></Typography>
        <Box justifyContent='center' alignItems='center' display='flex' sx={{color:'#ffff', marginLeft:'20px',  marginRight:'20px'}}>
          <Tabs variant='scrollable' scrollButtons="auto" textColor='inherit' value={link} TabIndicatorProps={{
              style: {
                backgroundColor: 'transparent',
              }
            }} onChange={handleChange}>
            <Tab sx={{backgroundColor:'#9999ff',borderRadius:'20px 0px 0px 0px',
              transition: (theme) => theme.transitions.create('background-color')}} id='tab-modifybook-1' value={1} aria-controls='panel-modifybook-1' label='Add New Book'/>
            <Tab sx={{background:'#ff9933',borderRadius:'0px 20px 0px 0px',
              transition: (theme) => theme.transitions.create('background-color')}} id='tab-modifybook-2' value={2} aria-controls='panel-modifybook-2' label='Modify old Book'/>
          </Tabs>
        </Box>
        <AddBook value={link} onError={setError}/>
        <ModifBook value={link} onError={setError}/>
      </Box>
    </>
  )
}

const CustomTextField = styled(TextField)({
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

function AddBook(props) {
  const {value, onError} = props;
  const[imgFile, setImageFile] = useState()
  const[pdfFile, setPdfFile] = useState()
  const[typeSelect, setTypeSelect] = useState()
  const[typeData,setTypeData] = useState([])
  const[openAddTheme, setOpenAddTheme] = useState()
  const themes = useSelector(bookThemes)
  const prof = useSelector(profile)
  const handleChange = (e) => {
    setTypeSelect(e.target.value)
    setTypeData([...typeData, e.target.value])
  }
  const handleDelete = (value) => () => {
    setTypeData(typeData.filter(a => a !== value))
  }
  const onUpload = async (e) => {
    var form = document.getElementById('form-add-book')
    var data = new FormData(form)
    data.append('theme',typeData)
    data.append('user',prof.id)
    data.append('favorite',true)
    data.append('file',pdfFile)
    data.append('image',imgFile)
    axios.post(addBookURL,[data],{
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      }
    }).catch(err => onError(err.message))
  }
  return(
      <>
        <div id='panel-modifybook-1' aria-labelledby='tab-modifybook-1' hidden={value!==1}>
          <form validate id='form-add-book' onSubmit={onUpload}>
            <Stack spacing={2} sx={{background:"#9999ff", padding:'15px', borderRadius:'20px'}}>
              <Stack spacing={2} direction={{xs:'column',md:'row'}}>
                <Stack spacing={2} sx={{width:{xs:'inherit', md:'80%'}}}>
                  <CustomTextField type='text' name='title' label='Book Title'/>
                  <CustomTextField type='text' name='author' label='Author'/>
                </Stack>
                <UploadFunc sx={{width:{xs:'inherit', md:'20%'},
                    border:'4px solid rgba(89, 89, 89, .3)',
                    borderStyle: 'dashed', background: 'rgba(255, 255, 255, .2)'}} setImage={setImageFile} isImg={true}/>
              </Stack>
              <CustomTextField type='text' name='publisher' label='Publisher'/>
              <CustomTextField type='text' name='description' multiline rows={4} label='Description from your book'/>
              <CustomTextField select label='Book Theme'
                value={typeSelect} onChange={handleChange}
                helperText="Please select your Theme">
                {(themes.length)?
                  (themes.map((a,i) => (
                    <MenuItem key={i} value={a}>{a}</MenuItem>
                  ))):(<></>)
                }
                <MenuItem key={-1} onClick={() => setOpenAddTheme(true)} sx={{display:'block'}}><Typography sx={{fontSize:'40px',textAlign:'center', color:'#00cc99', textShadow: '0 0 10px lime'}}>+</Typography></MenuItem>
              </CustomTextField>
              <Stack direction='row' spacing={1} sx={{maxWidth:'100%',overflow:'auto'}}>
                {(typeData.length)?(
                  typeData.map((a,i) => (
                    <Chip key={i} color="secondary" size="small" onDelete={handleDelete(a)} label={a}/>
                  ))
                ):(<></>)
                }
              </Stack>
              <UploadFunc sx={{border:'4px solid rgba(89, 89, 89, .3)',
                borderStyle: 'dashed', background: 'rgba(255, 255, 255, .2)'}} setFile={setPdfFile} file={pdfFile} isImg={false}/>
              <Box justifyContent='center' alignItems='center' display='flex'>
                <Button variant='contained' sx={{background:'#0099cc'}} type='submit'>Add Books</Button>
              </Box>
            </Stack>
          </form>
        </div>
        <AddTheme open={openAddTheme} onOpen={setOpenAddTheme} onError={onError} dataTheme={themes}/>
      </>
  )
}

function ModifBook(props) {
  const {value,onError} = props;
  const[imgFile, setImageFile] = useState()
  const[pdfFile, setPdfFile] = useState()
  const[typeSelect, setTypeSelect] = useState()
  const[openAddTheme, setOpenAddTheme] = useState()
  const[typeData,setTypeData] = useState([])
  const themes = useSelector(bookThemes)
  const prof = useSelector(profile)
  const handleChange = (e) => {
    setTypeSelect(e.target.value)
    setTypeData([...typeData, e.target.value])
  }
  const handleDelete = (value) => () => {
    setTypeData(typeData.filter(a => a !== value))
  }
  const onUpload = async (e) => {
    var form = document.getElementById('form-modify-book')
    var data = new FormData(form)
    data.append('theme',typeData)
    data.append('user',null)
    data.append('favorite',null)
    data.append('file',pdfFile)
    data.append('image',imgFile)
    axios.post(modifBookURL,data,{
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      }
    }).catch(err => onError(err.message))
  }
  return(
      <>
        <div id='panel-modifybook-2' aria-labelledby='tab-modifybook-2' hidden={value!==2}>
          <form validate id='form-modify-book' onSubmit={onUpload}>
            <Stack spacing={2} sx={{background:"#ff9933", padding:'15px', borderRadius:'20px'}}>
              <Search/>
              <Stack spacing={2} direction={{xs:'column',md:'row'}}>
                <Stack spacing={2} sx={{width:{xs:'inherit', md:'80%'}}}>
                  <CustomTextField type='text' name='title' label='Book Title'/>
                  <CustomTextField type='text' name='author' label='Author'/>
                </Stack>
                <UploadFunc sx={{width:{xs:'inherit', md:'20%'},
                    border:'4px solid rgba(89, 89, 89, .3)',
                    borderStyle: 'dashed', background: 'rgba(255, 255, 255, .2)'}} setImage={setImageFile} isImg={true}/>
              </Stack>
              <CustomTextField type='text' name='publisher' label='Publisher'/>
              <CustomTextField type='text' name='description' multiline rows={4} label='Description from your book'/>
              <CustomTextField select label='Book Theme'
                value={typeSelect} onChange={handleChange}
                helperText="Please select your Theme">
                {(themes.length)?
                  (themes.map((a,i) => (
                    <MenuItem key={i} value={a}>{a}</MenuItem>
                  ))):(<></>)
                }
                <MenuItem key={-1} onClick={() => setOpenAddTheme(true)} sx={{display:'block'}}><Typography sx={{fontSize:'40px',textAlign:'center', color:'#00cc99', textShadow: '0 0 10px lime'}}>+</Typography></MenuItem>
              </CustomTextField>
              <Stack direction='row' spacing={1} sx={{maxWidth:'100%',overflow:'auto'}}>
                {(typeData.length)?(
                  typeData.map((a,i) => (
                    <Chip key={i} color="secondary" size="small" onDelete={handleDelete(a)} label={a}/>
                  ))
                ):(<></>)
                }
              </Stack>
              <UploadFunc sx={{border:'4px solid rgba(89, 89, 89, .3)',
                borderStyle: 'dashed', background: 'rgba(255, 255, 255, .2)'}} setFile={setPdfFile} file={pdfFile} isImg={false}/>
              <Box justifyContent='center' alignItems='center' display='flex'>
                <Button variant='contained' sx={{background:'#0099cc'}} type='submit'>Modify Books</Button>
              </Box>
            </Stack>
          </form>

        </div>
        <AddTheme open={openAddTheme} onOpen={setOpenAddTheme} onError={onError} dataTheme={themes}/>
      </>
  )
}

function UploadFunc(props) {
  const {setImage, file, setFile, isImg, ...attr} = props
  const [img, setImg] = useState()
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
  const onImg = async(ev) => {
    var files = ev.target.files[0];
    if(files) {
      var data = new FileReader();
      data.readAsArrayBuffer(files);
      data.onload = async(event) => {
        let blob = new Blob([event.target.result]);
        window.URL = window.URL || window.webkitURL;
        setImg(window.URL.createObjectURL(blob));
        setImage(files)
      }
    }
  }
  const onFile = (ev) => {
    var files = ev.target.files[0];
    if(files){
        setFile(files)
    }
  }
  const uploadPdf = (
    <>
      {(file)?(
        <Card sx={{padding:'10px'}}>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <PictureAsPdfIcon color='error'/>
            <Typography sx={{flexGrow:1, marginLeft:'5px'}}>{file.name}</Typography>
            <IconButton onClick={() => setFile(null)}><CloseIcon/></IconButton>
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
          <CardMedia image={img}>
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

function AddTheme(props) {
  const{open, onOpen, onError, dataTheme} = props
  const[value, setValue] = useState('')
  const dispatch = useDispatch()
  const handleClickTheme = () => {
    axios.post(addBookTypeURL,value,{
      withCredentials:true,
    }).then(a => {dispatch(setBookTheme([...dataTheme, value]));onOpen(false);})
    .catch(err => {onError(err.message);onOpen(false);})
  }
  return(
    <>
      <Dialog open={open} sx={{zIndex:(theme) => theme.zIndex.drawer + 4}}>
          <DialogTitle>
            Add New Type
          </DialogTitle>
          <DialogContent>
            <DialogContentText>Add new type to your book</DialogContentText>
            <TextField variant='filled' value={value} onChange={(a,n)=> setValue(n)}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClickTheme}>Add</Button>
            <Button onClick={() => onOpen(false)}>Close</Button>
          </DialogActions>
      </Dialog>
    </>
  )
}
