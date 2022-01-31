import React, {forwardRef, useState, useEffect} from 'react';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import BookView from '../Book/Book_view';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import Croppie from 'croppie';
import {useDispatch, useSelector} from 'react-redux';
import {styled,createTheme} from '@mui/material/styles';
import {setTrigger, countDataAppearsDefault} from './../../funcredux/book_redux';
import {Alert, useMediaQuery, Box, TextField, IconButton, Button, Stack, Card, CardMedia, CardActionArea, Typography, Pagination, Menu, Snackbar,
  MenuItem, Dialog, DialogActions, DialogContent,DialogContentText, DialogTitle, Backdrop, Chip, CircularProgress, InputAdornment} from '@mui/material';
import {imageBookURL,searchPublisherBookURL,searchThemeBookURL} from './../../constant/constantDataURL';

export const ContainerFeedback = forwardRef(function ContainerFeedback(props, ref) {
  return <Alert elevation={5} ref={ref} variant='filled' sx={{fontSize:'.8rem', '& .MuiAlert-icon':{fontSize:'1rem'}}} {...props}/>
})
const theme = createTheme();
export const CustomTextField = styled(TextField)({
  '& label':{
    color:'rgba(0, 0, 0, 0.2)',
    transition: theme.transitions.create('color'),
  },
  '& label.Mui-focused':{
    color:'#ffff',
  },
  '& .MuiInput-underline:after':{
    borderBottomColor:'#ffff',
  },
  '& input':{
    padding:'.5rem',
  },
  '& .MuiOutlinedInput-root': {
    color:'inherit',
    '& fieldset':{
      border:'2px solid rgba(0, 0, 0, 0.2)',
      height:'inherit',
      borderBottom:'2px solid inherit',
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

export function Search (props) {
  const{url, isPageSizeResult, initSizeAllData, value, setValue, callback, onFilter, count, startCountPage, urlSuggestion, isPagination, triggerPage, triggerDataIndex, onError, sxRoot,
    isSuggestionSearch, isSuggestionDataList, onClickItemSuggestion, btnDeleteProps, btnSearchProps, btnFilterProps, filterIcon, ...attr} = props
  const[openMenu, setOpenMenu] = useState(false);
  const[menuFocus, setMenuFocus] = useState(false);
  const searchField = React.useRef(null);
  const[loading, setLoading] = useState(false);
  const[dataSuggestions, setDataSuggestions] = useState([""]);
  const dispatch = useDispatch();
  const initStateSize = useSelector(countDataAppearsDefault);
  const handleClick = (e) => {
    if(url){
      triggerPage(startCountPage);
      dispatch(setTrigger(triggerDataIndex))
      var param = {words: value};
      if(isPagination){
        param = {...param, page: 0, size: (initSizeAllData)?initSizeAllData:initStateSize.book};
      }
      axios(url, {
        method:'get',
        withCredentials:true,
        params: param,
      }).then(res => {
        if(res.data != null){
          if(isPagination){
            if(isPageSizeResult){
              count(res.data.sizeAllPage);
            }else{count(res.data.sizeAllData);}
            callback(res.data.data);
          }
          else{callback(res.data)}
        }}).catch(err => {
          if(err.response){
            onError(err.response.data.message)
          }else {
            onError(err.message)
          }
        })
    }
    else {
      callback(value)
    }
  }
  const handleInputValue = React.useCallback((e) => {
    if(isSuggestionDataList){
      setValue({id: null, name: e.target.value});
    }else{setValue(e.target.value);}
    if(e.target.value === "") {
      if(count){
        count(startCountPage);
      }
      setOpenMenu(false);
    }
    else{
      if(!openMenu){
        setOpenMenu(true);
      }
      if(urlSuggestion !== null){
        setLoading(true);
        axios.get(urlSuggestion, {
          withCredentials:true,
          params: {
            words: e.target.value,
          },
        }).then(res => {setDataSuggestions(res.data);setLoading(false);})
        .catch(err => {
          if(err.response){
            onError(err.response.data.message)
          }else {
            onError(err.message)
          }
          setLoading(false);});
      }
    }
  },[value])
  const handleKeyDown = (e) =>{
    if(e.keyCode === 13){handleClick();setOpenMenu(false);}
    else if(e.keyCode === 9 || e.keyCode === 40) {
      if(!menuFocus){
        setMenuFocus(true)
      }
    }
  }
  return(
    <>
      <Box display='flex' justifyContent='flex-start' alignItems='center' sx={{...sxRoot}}>
        <CustomTextField
          value={(isSuggestionDataList)?value.name:value}
          placeholder= 'Search...'
          ref={searchField}
          InputLabelProps={{style:{fontSize: '1rem',}}}
          InputProps={{
            style:{
              fontSize: '1rem',
            },
            endAdornment:(
              <InputAdornment position='end'>
                <IconButton sx={{...btnDeleteProps, padding:'0px', opacity: (isSuggestionDataList)?((value.name === "")? 0:1):((value === "")? 0:1),
                  fontSize:'1.3rem'}} disabled={(isSuggestionDataList)?((value.name === "")? true:false):((value === "")? true:false)}
                  onClick={() => (isSuggestionDataList)? setValue({id:null, name: ""}):setValue("")}>
                    <CloseIcon sx={{fontSize:'inherit'}}/></IconButton>
              </InputAdornment>
            ),
          }}
          onChange={handleInputValue}
          onKeyDown={handleKeyDown}
          {...attr}
          />
        {(isSuggestionSearch)?
          <Menu
            id='Menu-item-search'
            open={openMenu}
            autoFocus={menuFocus}
            disableAutoFocus={!menuFocus}
            anchorEl={searchField.current}
            PaperProps={{style:{width:(searchField && searchField.current)?searchField.current.offsetWidth:'inherit',
            maxHeight:'30vh',overflow:'auto'}}}
            onClose={() => {setOpenMenu(false);setMenuFocus(false);}}
            >
          {(!loading)?((dataSuggestions.length > 0)? dataSuggestions.map((item,i) => <MenuItem key={i}
          sx={{fontSize:'1rem'}} onClick={(e) => {
            if(onClickItemSuggestion){onClickItemSuggestion(item)}
            else {setValue(item);}
            setOpenMenu(false);setMenuFocus(false);}}>
            {(isSuggestionDataList)?item.name:item}</MenuItem>):<MenuItem sx={{fontSize:'1rem'}}>No Data</MenuItem>):
            <MenuItem sx={{fontSize:'1rem'}}><CircularProgress size='1rem' sx={{marginRight:'15px'}}/>Loading</MenuItem>}
          </Menu>:<></>
        }
        <IconButton onClick={handleClick} sx={{fontSize:'1.5rem',color:'#ffff', background:'#004d4d',
          marginLeft:'7px', '&:hover':{background:'#004d4d'}, padding:'.5rem', ...btnSearchProps }}><SearchIcon sx={{fontSize:'inherit'}}/></IconButton>
        <IconButton onClick={() => onFilter(true)} sx={{fontSize:'1.5rem', color:'#ffff',
          background:'#004d4d', marginLeft:'7px', '&:hover':{background:'#004d4d'}, padding:'.5rem', ...btnFilterProps}}>{filterIcon}</IconButton>
      </Box>
    </>
  )
}
Search.defaultProps = {
  url: null,
  onFilter: function () {},
  triggerPage: function () {},
  triggerDataIndex: -1,
  callback: function () {},
  isPagination:false,
  isPageSizeResult:true,
  count: function () {},
  startCountPage: 1,
  value: '',
  setValue: function () {},
  urlSuggestion:null,
  isSuggestionSearch: true,
  isSuggestionDataList: false,
  onClickItemSuggestion: null,
  filterIcon: <FilterAltIcon sx={{fontSize: 'inherit'}}/>,
}

export const Container = React.memo(function (props) {
  const {id, sizeLoadingData, setOpenModify, data, page, onPageChange, countPage, pattern, itemSpacing, sxRoot, ...attr} = props;
  const character = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var keys = '';
  for(var ind = 0;ind < 5;ind++){
    keys += character.charAt(Math.floor(Math.random()*character.length));
  }
  const initStateSize = useSelector(countDataAppearsDefault);
  const md = useMediaQuery('(min-width:900px)');
  const clone = []
  for(var s = 0; s < sizeLoadingData; s++){
    clone.push(<BookView key={"loading"+s} book={null} sx={{marginBottom:'.5rem', marginRight:'.5rem'}}/>)
  }
  return(
    <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap' sx={{width:'100%',...sxRoot}}>
      {(pattern === 'wider')?
        <>
          <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap' {...attr}>
            {(data.length > 0)?
              (data.map((data,i) =>
                  <BookView key={"wider"+keys+i} keys={keys} id={id+i} book={data} index={(page-1)*initStateSize.book+(i+1)}
                    onOpenModify={setOpenModify} sx={{margin: (theme) => theme.spacing(itemSpacing)}}/>)
              ):(<>{clone}</>)
            }
          </Box>
          <Pagination size={(md)? 'medium':'small'} sx={{'& .MuiPagination-ul':{'& .MuiPaginationItem-root':{color:'#bfbfbf',padding:'.4rem',fontSize:'1rem'}
            ,'& .Mui-selected':{color:'white'}}}} count={countPage} page={page} onChange={onPageChange} color="primary"/>
        </>:
        <>
          <Stack display='flex' justifyContent='flex-start' alignItems='center' direction={pattern} spacing={itemSpacing} {...attr}>
            {(data.length > 0)?
              (data.map((data,i) =>
                  <BookView key={"pattern"+keys+i} keys={keys} id={id+i} book={data} index={(page-1)*initStateSize.book+(i+1)}
                    onOpenModify={setOpenModify}/>)
              ):(<>{clone}</>)
            }
          </Stack>
          <Pagination size={(md)? 'medium':'small'} sx={{'& .MuiPagination-ul':{'& .MuiPaginationItem-root':{color:'#bfbfbf',padding:'.4rem',fontSize:'1rem'}
            ,'& .Mui-selected':{color:'white'}}}} count={countPage} page={page} onChange={onPageChange} color="primary"/>
        </>
      }
    </Box>
  );
})
Container.defaultProps = {
  pattern: 'wider',
  data:[],
  keys:'',
}

export function OnDeleteComponent(props) {
  const {onDelete, title, content, onClose, open, buttonTitle, disabled} = props;
  return(
    <Dialog open={Boolean(open)} onClose={onClose} sx={{zIndex: (theme) => theme.zIndex.drawer + 5}}>
      <DialogTitle sx={{fontSize:'1.2rem'}}>
        {title}
      </DialogTitle>
      <DialogContent sx={{display:'flex', justifyContent:'center',alignItems:'center'}}>
        <WarningIcon sx={{fontSize:'80px', marginRight:'10px', color:'#ffcc00'}}/>
        <DialogContentText sx={{fontSize:'1rem'}}>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button sx={{fontSize:'1rem'}} disabled={disabled} onClick={onDelete}>{buttonTitle}</Button>
        <Button sx={{fontSize:'1rem'}} onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
OnDeleteComponent.defaultProps = {
  disabled : false,
  buttonTitle : 'Delete'
}

export const PasswordContainer = (props) => {
  const{isVerify, setVerify, password, setPassword, onDelete, buttonTitle, disabled} = props;
  return(
    <Dialog open={isVerify} onClose={(e) => {e.stopPropagation();setVerify(false);setPassword('');}} sx={{zIndex:(theme) => theme.zIndex.drawer + 6}}>
      <DialogTitle sx={{fontSize:'1.2rem'}}>Confirm is that you</DialogTitle>
      <DialogContent sx={{display:'flex',justifyContent:'center'}}>
        <TextField InputProps={{style:{fontSize:'.8rem'}}} InputLabelProps={{style:{fontSize:'.8rem'}}} variant='filled' type='password' value={password}
          onClick={e => e.stopPropagation()} onChange={(e) => {e.stopPropagation();setPassword(e.target.value);}} onKeyDown={(e) => {e.stopPropagation();if(e.keyCode === 13){onDelete(e);}}} label='Input Password'/>
      </DialogContent>
      <DialogActions>
        <Button sx={{fontSize:'1rem'}} disabled={disabled} onClick={onDelete}>{buttonTitle}</Button>
        <Button sx={{fontSize:'1rem'}} onClick={(e)=> {e.stopPropagation();setPassword('');setVerify(false);}}>Cancel</Button>
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
          height: boundary.height,
        },
        viewport:{
          width:viewport.width,
          height:viewport.height,
          type:type,
        }
      }))
    }
  },[img])
  return(
    <Backdrop open={Boolean(open)} sx={{zIndex:(theme)=> theme.zIndex.drawer + 9}}>
      <Stack>
        <Box>
          <Box id='imageChange1'></Box>
        </Box>
        <Stack sx={{marginTop:'20px'}}direction='row' spacing={2} justifyContent='center' alignItems='center'>
          <Button variant='contained' sx={{fontSize:'1rem'}} onClick={handleSetImage}>Set Image</Button>
          <Button variant='contained' sx={{fontSize:'1rem'}} onClick={() => {setOpen(false);setImg({...img,data:null});}}>Cancel</Button>
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

export function UploadFunc(props) {
  const {setImage, image, imageInit, setError, fileInit, setFileInit, file, setFile, isImg, imgCallback, sx} = props
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
  const onImg = (e) => {
    var files = e.target.files[0];
    if(files) {
      getBase64(files).then(res => {setImage({...image, data: res});imgCallback(true);}).catch(err => setError(err.message));
    }
  }
  const onFile = (e) => {
    var files = e.target.files[0];
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
            <IconButton onClick={() => {setFile(null);setFileInit(null)}}><CloseIcon/></IconButton>
          </Box>
        </Card>
        ):(
          <Card sx={{background:'transparent'}}>
            <Box component='div' onDrop={onDrop} onDragOver={onDrag} onDragEnter={onDrag}>
              <label htmlFor='file-book-modify'>
                <CardActionArea component='span'>
                  <Box justifyContent='center' alignItems='center' display='flex' flexWrap='wrap' sx={{...sx}}>
                    <FileUploadIcon sx={{color:'#ffff'}}/>
                    <Typography sx={{width:'100%',textAlign:'center',fontWeight:600,
                      fontFamily:'Consolas',fontSize:'1.1rem',color:'#e6e6e6'}}>Click</Typography>
                    <Typography sx={{width:'100%',textAlign:'center',fontWeight:600,
                      fontFamily:'Consolas',fontSize:'1.1rem',color:'#e6e6e6'}}>Or</Typography>
                    <Typography sx={{width:'100%',textAlign:'center',fontWeight:600,
                      fontFamily:'Consolas',fontSize:'1.1rem',color:'#e6e6e6'}}>Drag Pdf file to this area</Typography>
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
    <Card sx={{background:'transparent'}}>
      <label htmlFor='gambar-book-modify'>
        <CardActionArea component='span'>
          <CardMedia image={(image && image.data)?image.data: ((imageInit)?`${imageBookURL}${imageInit}`:null)}>
            <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap' sx={{backgroundColor:((image && image.data) || imageInit)?'rgba(0,0,0,.5)':'rgba(0,0,0,0)',height:'6rem',...sx}}>
              <AddPhotoAlternateIcon sx={{color:'#ffff'}}/>
              <Typography sx={{width:'100%',textAlign:'center',fontWeight:600,
                fontFamily:'Consolas',fontSize:'1.1rem',color:'#e6e6e6'}}>Click to add image</Typography>
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
    publisher: (bookData)?bookData.publisher:{id:null,name:''},
    description: (bookData)?bookData.description:''
  }
  const[fileInit, setFileInit] = useState((bookData)?bookData.file:null);
  const[typeData,setTypeData] = useState((bookData)?bookData.theme:[]);
  const[newTypeData,setNewTypeData] = useState([]);
  const[type,setType] = useState({id:null,name:''});
  const[pdfFile, setPdfFile] = useState()
  const[preventClick, setPreventClick] = useState(false)
  const[data, setData] = useState(init)
  const onUpload = () => {
    if(data.title && data.publisher && data.description && (typeData.length > 0 || newTypeData.length > 0) && prof.id && ((pdfFile && imgFile) || modify)){
      setPreventClick(true)
      var user = new FormData();
      if(bookData){
          user.append('idBook',bookData.id);
      }
      user.append('title',data.title);
      if(data.publisher.id === null){
          user.append('newPublisher',data.publisher.name);
      }else {
          user.append('publisher',data.publisher.id);
      }
      user.append('description',data.description);
      if(typeData.length !== 0){
          user.append('theme',typeData.map(a => a.id));
      }
      if(newTypeData.length !== 0){
          user.append('newTheme',newTypeData.map(a => a.name));
      }
      user.append('favorite',true);
      user.append('file',pdfFile);
      user.append('image',imgFile);
      if(modify){
        axios.put(url,user,{
          withCredentials:true,
        }).then(a => {setPreventClick(false);onOpenModify(null);onSuccess(responText);})
        .catch(err => {
          if(err.response){
            onError(err.response.data.message)
          }else {
            onError(err.message)
          }
          setPreventClick(false);onOpenModify(null);})
      }
      else{
        axios.post(url,user,{
          withCredentials:true,
        }).then(a => {setPreventClick(false);onSuccess(responText);})
        .catch(err => {
          if(err.response){
            onError(err.response.data.message)
          }else {
            onError(err.message)
          }
          setPreventClick(false);})
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
  const onClickItemType = (item) => {
    if(item.id === null){
      setNewTypeData([...newTypeData, item])
    }
    else{
      setTypeData([...typeData, item])
    }
    setType({id: null, name:''})
  }
  const onDeleteTypeData = (name, data, setData) => {
    setData(data.filter(s => s.name !== name))
  }
  return(
      <Stack {...attr}>
        <Stack spacing={3} direction={{xs:'column',md:'row'}}>
          <Stack spacing={2} sx={{width:{xs:'100%', md:'80%'}}}>
            <CustomTextField size='small' type='text' onKeyDown={handleKeyDown} name='title' value={data.title}
            onChange={(a) => setData({...data, title: a.target.value})} label='Book Title' sx={{color:'white'}}
            InputLabelProps={{style:{fontSize: '1rem',}}} InputProps={{style:{fontSize: '1rem',}}}/>
            <Search size='small' value={data.publisher} setValue={(item) => setData({...data, publisher:item})} urlSuggestion={searchPublisherBookURL}
            onError={onError} isSuggestionSearch isSuggestionDataList label='Publisher' placeholder='' sx={{width:'100%',color:'white'}}
            inputProps={{width:'100%'}} btnDeleteProps={{color:'white'}} btnSearchProps={{display:'none'}} btnFilterProps={{display:'none'}}/>
          </Stack>
          <UploadFunc sx={{border:'4px solid rgba(89, 89, 89, .3)',
            borderStyle: 'dashed'}} setImage={setImgView} image={imgView} setError={onError}
            isImg={true} imgCallback={imgCallback} imageInit={(bookData)?bookData.image:null}/>
        </Stack>
        <CustomTextField value={data.description} sx={{color:'white'}} multiline rows={4} label='Description from your book'
          onChange={(a) => setData({...data, description: a.target.value})} helperText={"Use special character that start with: 'p>....<p' to make new paragraph,"+
          " '-=>.._,_.._,_..<=-' to make list and per list item separated by '_,_', '!--....--!' to make special sentence."}
          FormHelperTextProps={{style:{color:'white',fontSize:'.8rem'}}} InputLabelProps={{style:{fontSize: '1rem',}}} InputProps={{style:{fontSize: '1rem',}}}/>
        <Search size='small' value={type} setValue={setType} urlSuggestion={searchThemeBookURL} onClickItemSuggestion={onClickItemType}
          FormHelperTextProps={{style:{color:'white',fontSize:'.8rem'}}} onError={onError} isSuggestionSearch isSuggestionDataList
          label='Book Theme' callback={(item) => onClickItemType(item)} helperText="Please select your Theme" placeholder="Theme..."
          sx={{width:'100%',color:'white'}} inputProps={{width:'100%'}} btnSearchProps={{display:'none'}} btnFilterProps={{display:'none'}}/>
        <Stack direction='row' spacing={1} display='flex' flexWrap='wrap'>
        {
            (typeData.length > 0)?
            typeData.map((a,i) => (
              <Chip sx={{color:'white',fontSize:'1rem',marginBottom:'10px','& .MuiChip-deleteIcon':{fontSize:'1.4rem'}}}
                key={i} label={a.name} onDelete={() => onDeleteTypeData(a.name,typeData,setTypeData)}/>
            )):<></>}
        {
            (newTypeData.length > 0)?
            newTypeData.map((a,i) => (
              <Chip sx={{color:'white',fontSize:'1rem',marginBottom:'10px','& .MuiChip-deleteIcon':{fontSize:'1.4rem'}}}
                key={i} label={a.name} onDelete={() => onDeleteTypeData(a.name,newTypeData,setNewTypeData)}/>
            )):<></>}
        </Stack>
        <UploadFunc sx={{border:'4px solid rgba(89, 89, 89, .3)', paddingTop:'20px', paddingBottom:'20px',
          borderStyle: 'dashed', background: 'rgba(255, 255, 255, .2)'}} file={pdfFile} setFile={setPdfFile}
          isImg={false} fileInit={fileInit} setFileInit={setFileInit} setError={onError}/>
        <Box justifyContent='center' alignItems='center' display='flex'>
          <Button variant='contained' sx={{background:'#0099cc'}} onClick={onUpload}
            disabled={preventClick} startIcon={(preventClick)?<CircularProgress size='1rem' color="primary"/>:<></>}>{(labelButton)?labelButton:'Add Books'}</Button>
          {(bookData)?
            <Button variant='contained' color='error' sx={{marginLeft:'10px'}}
              onClick={e => {onOpenModify(null);setImgView({data:null});}}>Cancel</Button>
              :<></>
          }
        </Box>
      </Stack>
  )
}
