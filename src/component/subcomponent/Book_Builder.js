import React, {useState, useCallback} from 'react';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {styled} from '@mui/material/styles';
import {profile} from '../funcredux/profile_redux';
import {Search, getBase64, UploadImage} from './otherComponent';
import {bookThemes, setBookTheme} from '../funcredux/book_redux';
import {addBookURL,modifBookURL,addBookTypeURL} from '../constant/constantDataURL';
import {Typography, Stack, Paper,Button, Autocomplete, TextField,Card, CardMedia, CardActionArea, Dialog, DialogContent, DialogTitle,
  IconButton, Chip, Box, MenuItem,useMediaQuery, DialogContentText, DialogActions} from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';

export default function BookBuilder(props) {
  const {setError, setRespon} = props;
  const themes = useSelector(bookThemes);
  const[imgFile, setImageFile] = useState()
  const[pdfFile, setPdfFile] = useState()
  const [img, setImg] = useState({data:null})
  const [open, setOpen] = useState(false)
  const prof = useSelector(profile)
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
        <Box justifyContent='center' alignItems='center' display='flex' sx={{color:'#ffff', marginLeft:'20px', marginRight:'20px'}}>
          <Typography sx={{backgroundColor:'#9999ff',borderRadius:'20px 20px 0px 0px', padding:'10px',
            fontSize:{xs: '6vw', sm: '4vw', md: '1.5vw'}}}>
            Add Your Book</Typography>
        </Box>
        <AddBook onError={setError} onSuccess={setRespon} themes={themes} prof={prof} imgFile={imgFile}
          pdfFile={pdfFile} setPdfFile={setPdfFile} imgView={img} setImgView={setImg} setOpen={setOpen}/>
      </Box>
      <UploadImage open={open} setOpen={setOpen} img={img} setImg={setImg} imgStore={setImageFile} type='square'
        viewport={{width:150, height:200}}/>
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
  const {onError, onSuccess, themes, prof, imgFile, pdfFile, setPdfFile, imgView, setImgView, setOpen} = props;
  const[typeData,setTypeData] = useState([])
  const[openAddTheme, setOpenAddTheme] = useState()
  const[preventClick, setPreventClick] = useState(false)
  const[data, setData] = useState({
    title:'',
    author:'',
    publisher:'',
    description:''
  })
  const handleDataChange = (e, n) => {
    setTypeData([...typeData, ...n.filter((a) => typeData.indexOf(a) === -1)])
  }
  const onUpload = (e) => {
    setPreventClick(true)
    var user = new FormData();
    user.append('title',data.title);
    user.append('author',data.author);
    user.append('publisher',data.publisher);
    user.append('description',data.description);
    user.append('theme',typeData);
    user.append('user',prof.id);
    user.append('favorite',true);
    user.append('file',pdfFile);
    user.append('image',imgFile);
    axios.post(addBookURL,user,{
      withCredentials:true,
    }).then(a => {setPreventClick(false);onSuccess('Saving Books Success, please refresh this page !!!');
      }).catch(err => {onError(err.message);setPreventClick(false);})
  }
  return(
      <>
        <div id='panel-modifybook-1' aria-labelledby='tab-modifybook-1'>
          <form validate>
            <Stack spacing={2} sx={{background:"#9999ff", padding:'15px', borderRadius:'20px'}}>
              <Stack spacing={2} direction={{xs:'column',md:'row'}}>
                <Stack spacing={2} sx={{width:{xs:'inherit', md:'80%'}}}>
                  <CustomTextField type='text' name='title' value={data.title}
                  onChange={(a) => setData({...data, title: a.target.value})} label='Book Title'/>
                  <CustomTextField type='text' name='author' value={data.author}
                  onChange={(a) => setData({...data, author: a.target.value})} label='Author'/>
                </Stack>
                <UploadFunc sx={{width:{xs:'inherit', md:'20%'},
                    border:'4px solid rgba(89, 89, 89, .3)',
                    borderStyle: 'dashed', background: 'rgba(255, 255, 255, .2)'}} setImage={setImgView} image={imgView}
                    isImg={true} setOpen={setOpen}/>
              </Stack>
              <CustomTextField type='text' name='publisher' value={data.publisher}
              onChange={(a) => setData({...data, publisher: a.target.value})} label='Publisher'/>
              <CustomTextField type='text' name='description' value={data.description}
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
                  <Chip variant="contained" color='primary' key={i} label={a} {...params(i)}
                    onDelete={() => setTypeData(typeData.filter(item => item !== a))}/>
                ))
                }
                renderInput = {(params) =>
                  (<CustomTextField {...params} label='Book Theme' helperText="Please select your Theme"
                    placeholder="Theme..."/>)}/>
              <UploadFunc sx={{border:'4px solid rgba(89, 89, 89, .3)',
                borderStyle: 'dashed', background: 'rgba(255, 255, 255, .2)'}} file={pdfFile} setFile={setPdfFile} isImg={false}/>
              <Box justifyContent='center' alignItems='center' display='flex'>
                <Button variant='contained' sx={{background:'#0099cc'}} onClick={onUpload}
                  disabled={preventClick}>Add Books</Button>
              </Box>
            </Stack>
          </form>
        </div>
        <AddTheme open={openAddTheme} onOpen={setOpenAddTheme} onError={onError} dataTheme={themes}/>
      </>
  )
}

function ModifBook(props) {
  const {value,onError, themes, prof, imgFile, pdfFile, setPdfFile, imgView, setImgView, setOpen} = props;
  const[typeSelect, setTypeSelect] = useState()
  const[openAddTheme, setOpenAddTheme] = useState()
  const[typeData,setTypeData] = useState([])
  const[data, setData] = useState({
    id:0,
    title:'',
    author:'',
    publisher:'',
    description:''
  })
  const handleChange = (e) => {
    setTypeSelect(e.target.value)
    setTypeData([...typeData, e.target.value])
  }
  const handleDelete = (value) => () => {
    setTypeData(typeData.filter(a => a !== value))
  }
  const onUpload = async (e) => {
    var user = new FormData();
    user.append('title',data.title);
    user.append('author',data.author);
    user.append('publisher',data.publisher);
    user.append('description',data.description);
    user.append('theme',typeData);
    user.append('user',prof.id);
    user.append('favorite',true);
    user.append('file',pdfFile);
    user.append('image',imgFile);
    user.append('idb',data.id);
    axios.post(modifBookURL,user,{
      withCredentials:true,
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
                  <CustomTextField type='text' name='title' value={data.title}
                  onChange={(a) => setData({...data, title: a.target.value})} label='Book Title'/>
                  <CustomTextField type='text' name='author' value={data.author}
                  onChange={(a) => setData({...data, author: a.target.value})} label='Author'/>
                </Stack>
                <UploadFunc sx={{width:{xs:'inherit', md:'20%'},
                    border:'4px solid rgba(89, 89, 89, .3)',
                    borderStyle: 'dashed', background: 'rgba(255, 255, 255, .2)'}} setImage={setImgView} image={imgView}
                    isImg={true} setOpen={setOpen}/>
              </Stack>
              <CustomTextField type='text' name='publisher' value={data.publisher}
              onChange={(a) => setData({...data, publisher: a.target.value})} label='Publisher'/>
              <CustomTextField type='text' name='description' multiline rows={4} value={data.description}
              onChange={(a) => setData({...data, description: a.target.value})} label='Description from your book'/>
              <CustomTextField select label='Book Theme'
                value={typeSelect} onChange={handleChange}
                helperText="Please select your Theme">
                {(themes)?
                  (themes.map((a,i) => (
                    <MenuItem key={i} value={a}>{a}</MenuItem>
                  ))):(<></>)
                }
                <MenuItem key={-1} onClick={() => setOpenAddTheme(true)} sx={{display:'block'}}><Typography sx={{fontSize:'40px',textAlign:'center', color:'#00cc99', textShadow: '0 0 10px lime'}}>+</Typography></MenuItem>
              </CustomTextField>
              <Stack direction='row' spacing={1} sx={{maxWidth:'100%',overflow:'auto'}}>
                {(typeData)?(
                  typeData.map((a,i) => (
                    <Chip key={i} color="secondary" size="small" onDelete={handleDelete(a)} label={a}/>
                  ))
                ):(<></>)
                }
              </Stack>
              <UploadFunc sx={{border:'4px solid rgba(89, 89, 89, .3)',
                borderStyle: 'dashed', background: 'rgba(255, 255, 255, .2)'}} file={pdfFile} setFile={setPdfFile} isImg={false}/>
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
  const {setImage, image, file, setFile, isImg, setOpen, ...attr} = props
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
      getBase64(files).then(a => {setImage({...image, data: a});setOpen(true);});
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
      {(file)?(
        <Card sx={{padding:'10px'}}>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <PictureAsPdfIcon color='error'/>
            <Typography sx={{flexGrow:1, marginLeft:'5px'}}>{file.name}</Typography>
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
          <CardMedia image={(image)?image.data:null}>
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
  const[preventClick, setPreventClick] = useState(false)
  const dispatch = useDispatch()
  const addTheme = useCallback((a,n) => {dispatch(setBookTheme([...a, n]))},[dispatch])
  const handleClickTheme = () => {
    setPreventClick(true)
    var data = new FormData()
    data.append('type',value)
    axios.post(addBookTypeURL,data,{
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      }
    }).then(a => {addTheme(dataTheme, value);onOpen(false);})
    .catch(err => {onError(err.message);onOpen(false);})
  }
  return(
    <>
      <Dialog open={open} sx={{zIndex:(theme) => theme.zIndex.drawer + 4}}>
          <DialogTitle>
            Add New Theme
          </DialogTitle>
          <DialogContent>
            <DialogContentText>Add new theme to your book</DialogContentText>
            <Autocomplete variant='filled' value={value} onChange={(a)=> setValue(a.target.value)}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClickTheme} disabled={preventClick}>Add</Button>
            <Button onClick={() => onOpen(false)}>Close</Button>
          </DialogActions>
      </Dialog>
    </>
  )
}
