import React, {forwardRef, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {Alert, useMediaQuery, Box, TextField, IconButton, Button, Stack, Card, CardMedia, CardActionArea, Typography, Pagination, Menu,
 MenuItem, Dialog, DialogActions, DialogContent,DialogContentText, DialogTitle,Backdrop, Chip, CircularProgress, InputAdornment} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {addBookTypeURL,imageBookURL,searchPublisherBookURL} from '../constant/constantDataURL';
import {setTrigger, countDataAppearsDefault} from '../funcredux/book_redux';
import BookView from './Book_view';
import WarningIcon from '@mui/icons-material/Warning';
import {styled} from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import Croppie from 'croppie';

export const ContainerFeedback = forwardRef(function ContainerFeedback(props, ref) {
  return <Alert elevation={5} ref={ref} variant='filled' {...props}/>
})

const SearchField = styled(TextField)((props) => ({
  '& label':{
    color:'rgba(0, 0, 0, 0.2)',
    transition: (theme) => theme.transitions.create('color')
  },
  '& label.Mui-focused':{
    color:'#ffff',
  },
  '& .MuiInput-underline:after':{
    borderBottomColor:'tranparent',
  },
  '& .MuiOutlinedInput-root': {
    color: 'inherit',
    '& fieldset':{
      border:'2px solid rgba(0, 0, 0, 0.2)',
      borderRadius: '5px',
    },
    '&:hover fieldset':{
      border:'2px solid #0066cc',
    },
    '&.Mui-focused fieldset': {
      border:'2px solid #0066cc',
    },
  },
}))

export function Search(props) {
  const{url, value, setValue, callback, onFilter, count, urlSuggestion, isPagination, triggerPage, triggerDataIndex, onError,
    isSuggestionSearch, isSuggestionDataList, onClickItemSuggestion, btnDeleteProps, btnSearchProps, btnFilterProps, filterIcon, ...attr} = props
  const[openMenuRef, setOpenMenuRef] = useState(null);
  const[openMenu, setOpenMenu] = useState(false);
  const[menuFocus, setMenuFocus] = useState(false);
  const[loading, setLoading] = useState(false);
  const[dataSuggestions, setDataSuggestions] = useState([""]);
  const dispatch = useDispatch();
  const initStateSize = useSelector(countDataAppearsDefault);
  const md = useMediaQuery('(min-width:900px)');
  const handleClick = (e) => {
    triggerPage(1);
    dispatch(setTrigger(triggerDataIndex))
    var data = {words: value};
    if(isPagination){
      data = {...data, page: 0, size: initStateSize.book};
    }
    axios.get(url, {
      withCredentials:true,
      params: data,
      headers: {
        'Content-Type':'multipart/form-data',
      }
    }).then(res => {
      if(res.data != null){
        if(isPagination){
          count(res.data.sizeAllPage)
          callback(res.data.data)
        }
        else{callback(res.data)}
    }}).catch(err => onError(err.message))
  }
  const handleInputValue = (ev) => {
    setOpenMenuRef(ev.target)
    if(isSuggestionDataList){
      setValue({...value, name: ev.target.value});
    }else{setValue(ev.target.value);}
    if(ev.target.value === "") {
      if(count){
        count(1);
      }
      setOpenMenu(false);
    }
    else{
      if(!openMenu){
        setOpenMenu(true);
      }
      if(urlSuggestion != null){
        setLoading(true);
        axios.get(urlSuggestion, {
          withCredentials:true,
          params: {
            words: ev.target.value,
          },
          headers: {
            'Content-Type':'multipart/form-data',
          }
        }).then(item => {setDataSuggestions(item.data);setLoading(false);})
        .catch(err => {onError(err.message);setLoading(false);});
      }
    }
  }
  const handleKeyDown = (e) =>{
    if(e.keyCode === 13){handleClick()}
    if(e.keyCode === 9) {
      if(!menuFocus){
        setMenuFocus(true)
      }
    }
  }
  return(
    <>
      <Box display='flex' justifyContent='flex-start' alignItems='center' sx={{paddingLeft:'10px', paddingBottom:'30px'}}>
        <SearchField
          value={(isSuggestionDataList)?value.name:value}
          size='small'
          inputProps={{style:{width:'150px'}}}
          placeholder= 'Search...'
          {...attr}
          InputProps={{
            endAdornment:(
              <InputAdornment position='end'>
                {(isSuggestionDataList)? ((value.name === "")?<></>:
                    <IconButton sx={{...btnDeleteProps, padding:'0px', maxWidth:'15px'}} onClick={() => setValue({id:null, name: ""})}>{(loading)?<CircularProgress/>:<CloseIcon/>}</IconButton>):((value === "")?<></>:
                    <IconButton sx={{...btnDeleteProps, padding:'0px', maxWidth:'15px'}} onClick={() => setValue("")}>{(loading)?<CircularProgress/>:<CloseIcon/>}</IconButton>)
                }
              </InputAdornment>
            ),
          }}
          onChange={handleInputValue}
          onKeyDown={handleKeyDown}
          />
        <Menu
          id='Menu-item-search'
          open={openMenu}
          autoFocus={menuFocus}
          disableAutoFocus={!menuFocus}
          anchorEl={openMenuRef}
          onClose={() => {setOpenMenu(false);setMenuFocus(false);setOpenMenuRef(null)}}
        >
          {(dataSuggestions.length > 0)? dataSuggestions.map((a,i) => <MenuItem key={i}
              onClick={(e) => {
                if(onClickItemSuggestion){onClickItemSuggestion(a)}
                else {setValue(a);}
                setOpenMenu(false);setMenuFocus(false);setOpenMenuRef(null)}}>
            {(isSuggestionDataList)?a.name:a}</MenuItem>):<MenuItem>No Data</MenuItem>}
        </Menu>
        {(isSuggestionSearch)?
          <></>:
          <>
          <IconButton onClick={handleClick}
            sx={{...btnSearchProps ,color:'#ffff', background:'#004d4d', marginLeft:'7px', '&:hover':{background:'#004d4d'}}}><SearchIcon sx={{fontSize: (md)? '20px':'14px'}}/></IconButton>
          <IconButton onClick={() => onFilter(true)}
            sx={{...btnFilterProps,fontSize: (md)? '20px':'14px', color:'#ffff', background:'#004d4d', marginLeft:'7px',
              '&:hover':{background:'#004d4d'}}}>{filterIcon}</IconButton>
          </>
        }
      </Box>
    </>
  )
}
Search.defaultProps = {
  onFilter: function () {},
  triggerPage: function () {},
  triggerDataIndex: -1,
  isPagination:false,
  count: function () {},
  value: '',
  setValue: function () {},
  isSuggestionSearch: false,
  isSuggestionDataList: false,
  onClickItemSuggestion: null,
  filterIcon: <FilterAltIcon sx={{fontSize: 'inherit'}}/>,
}

export function Container(props) {
  const {setOpenModify, data, page, onPageChange, countPage, pattern, ...attr} = props;
  const md = useMediaQuery('(min-width:900px)');
  const clone = []
  for(var s = 0; s < 20; s++){
    clone.push(<BookView key={s} id={null} sx={{marginBottom:(theme) => theme.spacing(1), marginRight: (theme) => theme.spacing(1)}}/>)
  }
  return(
    <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap' sx={{width:'100%'}}>
      {(pattern === 'wider')?
        <>
          <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap' {...attr}>
            {(data.length > 0)?
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
          <Pagination size={(md)? 'medium':'small'} count={countPage} page={page} onChange={onPageChange} color="primary"/>
        </>:
        <>
          <Stack display='flex' justifyContent='center' alignItems='center' direction={pattern} spacing={1} {...attr}>
            {(data.length > 0)?
              (data.map((a,i) => (
                  <BookView key={i} id={a.id} title={a.title} author={a.author} image={a.image}
                    publisher={a.publisher} date={a.publishDate} status={a.status}
                    description={a.description} theme={a.theme} data={a.file} favorite={a.favorite}
                    setOpenModify={setOpenModify}/>
                ))
              ):(
                <>
                  {clone}
                </>)
            }
          </Stack>
          <Pagination size={(md)? 'medium':'small'} count={countPage} page={page} onChange={onPageChange} color="primary"/>
        </>
      }
    </Box>
  );
}
Container.defaultProps = {
  pattern: 'wider',
  data:[],
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

export const CustomTextField = styled(TextField)((props) => ({
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
}))


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
  const {bookData, onError, onSuccess, onOpenModify, prof, imgFile, imgView, setImgView,
    imgCallback, url, responText, labelButton, modify, ...attr} = props;
  var init = {
    title: (bookData)?bookData.title:'',
    publisher: {id:null,name:(bookData)?bookData.publisher:''},
    description: (bookData)?bookData.description:''
  }
  const[typeData,setTypeData] = useState((bookData)?bookData.theme:[]);
  const[newTypeData,setNewTypeData] = useState([]);
  const[openAddTheme, setOpenAddTheme] = useState()
  const[pdfFile, setPdfFile] = useState()
  const[preventClick, setPreventClick] = useState(false)
  const[data, setData] = useState(init)
  const handleDataChange = (e, n) => {

  }
  const onUpload = () => {
    if(data.title && data.publisher && data.description && typeData.length > 0 && prof.id && (pdfFile && imgFile || modify)){
      setPreventClick(true)
      var user = new FormData();
      if(bookData){
          user.append('idBook',bookData.id);
      }
      user.append('title',data.title);
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
      <Stack {...attr}>
        <Stack spacing={2} direction={{xs:'column',md:'row'}}>
          <Stack spacing={2} sx={{width:{xs:'100%', md:'80%'}}}>
            <CustomTextField size='small' type='text' onKeyDown={handleKeyDown} name='title' value={data.title}
            onChange={(a) => setData({...data, title: a.target.value})} label='Book Title'/>
            <Search value={data.publisher} setValue={(item) => setData({...data, publisher:item})}
            urlSuggestion={searchPublisherBookURL} onError={onError} isSuggestionSearch isSuggestionDataList label='Publisher'/>
          </Stack>
          <UploadFunc sx={{width:{xs:'inherit', md:'20%'},
              border:'4px solid rgba(89, 89, 89, .3)',
              borderStyle: 'dashed', background: 'rgba(255, 255, 255, .2)'}} setImage={setImgView} image={imgView}
              isImg={true} imgCallback={imgCallback} imageInit={(bookData)?bookData.image:null}/>
        </Stack>
        <CustomTextField type='text' onKeyDown={handleKeyDown} name='description' value={data.description}
        onChange={(a) => setData({...data, description: a.target.value})}
          multiline rows={4} label='Description from your book'/>
        <Search value={data.publisher} setValue={(item) => setData({...data, publisher:item})} urlSuggestion={searchPublisherBookURL}
        onError={onError} isSuggestionSearch isSuggestionDataList label='Book Theme' helperText="Please select your Theme"
        placeholder="Theme..."/>
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
  )
}
