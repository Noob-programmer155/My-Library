import React, {useState, forwardRef} from 'react';
import {Box, Paper, CardMedia, Typography, Divider, Stack, IconButton, Button, Chip, CircularProgress, Alert} from '@mui/material';
import {makeStyles} from '@mui/styles';
import axios from 'axios';
import {createTheme} from '@mui/material/styles';
import {useDispatch, useSelector} from 'react-redux';
import {profile} from '../funcredux/profile_redux';
import {OnDeleteComponent, CustomTextField, UploadFunc} from './otherComponent';
import {modifyBookFavURL, imageBookURL, deleteBookURL,fileBookURL, modifBookURL,addBookTypeURL} from '../constant/constantDataURL';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';

const theme = createTheme();
const useStyle = makeStyles({
    text: {
      fontWeight: 700,
      fontFamily: 'Verdana',
      color: '#000000',
      fontSize:'4vw',
      width:'100%',
      [theme.breakpoints.up('sm')]:{
        fontSize:'1.8vw',
      },
      [theme.breakpoints.up('md')]:{
        fontSize:'1vw',
      },
    },
    textSec: {
      fontFamily: 'Verdana',
      color: '#4d4d4d',
      fontSize:'4vw',
      marginLeft:'5px',
      width:'100%',
      [theme.breakpoints.up('sm')]:{
        fontSize:'1.8vw',
      },
      [theme.breakpoints.up('md')]:{
        fontSize:'1vw',
      },
    },
    chip:{
      fontFamily:'Segoe UI',
      fontWeight:700,
    }
});

export default function Book(props) {
  const{id, title, author, image, publisher, date, description, respon, setRespon, error, setError,
    theme, data, isOpenFunc, favorite, status, isModifyFunc} = props;
  const [fav, setFav] = useState(favorite);
  const[preventClick, setPreventClick] = useState(false)
  const[preventFav, setPreventFav] = useState(false);
  const[deletes, setDeletes] = useState();
  const colorData = [{back:'#b3ffb3',clr:'#009933'},{back:'#ccf5ff',clr:'#0066ff'},{back:'#ffe0b3',clr:'#ff6600'},
    {back:'#e6ccff',clr:'#c61aff'},{back:'#e6e6ff',clr:'#6600ff'}];
  const {format} = require('date-fns');
  const prof = useSelector(profile);
  const dispatch = useDispatch();
  const handleFav = async(a) => {
    setPreventFav(true)
    var form = new FormData();
    form.append('idb', id)
    form.append('idu', (prof)? prof.id:0)
    form.append('del', fav)
    axios.put(modifyBookFavURL, form, {
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      },
    }).then(a => {setPreventFav(false);})
    .catch(err=>{setError(err.message);setFav(!fav);setPreventFav(false)})
    setFav(!fav);
  }
  const handleDownload = (a) => {
    setPreventClick(true)
    var FileSaver = require('file-saver');
    var attr = new FormData();
    attr.append('idBook',id)
    axios.post(fileBookURL+data, attr,{
      withCredentials:true,
    }).then(a => {
        if(a.data){
          var eks = "data:application/pdf;base64,";
          setPreventClick(false);
          FileSaver.saveAs(`${eks}${a.data}`,`${title}.pdf`);
        }
      }).catch(err => {setError(err.message);setPreventClick(false);})
  }
  const style = useStyle();
  return(
    <>
      <Paper sx={{minWidth:'250px', maxWidth:'90vw', width:'1100px', zIndex: (theme) => theme.zIndex.drawer + 2, padding:'10px'}}>
        <Stack divider={<Divider orientation="vertical" flexItem />} spacing={{xs:0, md:1}} direction={{xs: 'column', md:'row'}} sx={{width:'100%'}}>
          <Box justifyContent='center' alignItems='center' display='flex'>
            <CardMedia image={`${imageBookURL}${image}`}
              sx={{width:'200px', minHeight: '200px'}}/>
          </Box>
          <Box style={{padding:'5px'}}>
            <Box justifyContent={{md: 'flex-end', xs: 'center'}} width='100%' alignItems='center' display='flex'>
              {(prof && status)?
                   (<>
                      <IconButton onClick={()=> setDeletes(prof.id)} sx={{position: 'relative', top:{md:'-35px', xs:0}, left:{md:'35px', xs:0},
                        background:'#ffa366', color:'#ff1a1a', marginRight:'10px', '&:hover':{background:'#ff1a1a', color:'#ffff'}}}><DeleteIcon/></IconButton>
                      <IconButton onClick={()=> isModifyFunc({
                          id:id,
                          title:title,
                          author:author,
                          publisher: publisher,
                          description: description,
                          theme: theme,
                          image: image,
                          file: title
                        })} sx={{position: 'relative', top:{md:'-35px', xs:0}, left:{md:'35px', xs:0},
                        background:'#ffa366', color:'#ff1a1a', marginRight:'10px', '&:hover':{background:'#ff1a1a', color:'#ffff'}}}><ModeEditIcon/></IconButton>
                    </>
                  ):(<></>)
              }
              <IconButton onClick={a => isOpenFunc(null)} sx={{position: 'relative', top:{md:'-35px', xs:0}, left:{md:'35px', xs:0},
                background:'#ffa366', color:'#ff1a1a', '&:hover':{background:'#ff1a1a', color:'#ffff'}}}><CloseIcon/></IconButton>
            </Box>
            <Box style={{overflow:'auto', marginTop:'10px',marginBottom:'10px'}} sx={{width:'100%', maxWidth:'100%'}}>
              <table style={{width:'99%'}}>
                <tr>
                  <td><Typography noWrap className={style.text}>Id</Typography></td>
                  <td><Typography noWrap className={style.textSec}>{id}</Typography></td>
                  <td><Typography noWrap className={style.text}>Publisher</Typography></td>
                  <td><Typography noWrap className={style.textSec}>{publisher}</Typography></td>
                </tr>
                <tr>
                  <td><Typography noWrap className={style.text}>Title</Typography></td>
                  <td><Typography noWrap className={style.textSec}>{title}</Typography></td>
                  <td><Typography noWrap className={style.text}>Publish</Typography></td>
                  <td><Typography noWrap className={style.textSec}>{(date)? format(new Date(date), 'dd MMM yyyy'): date}</Typography></td>
                </tr>
                <tr>
                  <td><Typography noWrap className={style.text}>Author</Typography></td>
                  <td><Typography noWrap className={style.textSec}>{author}</Typography></td>
                </tr>
              </table>
            </Box>
            <Box>
              <Typography noWrap className={style.text}>Theme</Typography>
              <Stack spacing={1} direction='row' sx={{marginTop:'10px', marginBottom:'10px', maxWidth:'100%', overflow:'auto'}}>
                {
                  (theme)? (
                    theme.map((a,i) => {
                      var color = (/[A-E]/.exec(a.name.charAt(0)) !== null)?colorData[0]:(/[F-J]/.exec(a.name.charAt(0)) !== null)?colorData[1]:
                        (/[K-O]/.exec(a.name.charAt(0)) !== null)?colorData[2]:(/[P-T]/.exec(a.name.charAt(0)) !== null)?colorData[3]:colorData[4]
                      return <Chip key={i} className={style.chip} style={{background:color.back,color:color.clr}} label={a.name} size="small"/>
                    })
                  ) : (<></>)
                }
              </Stack>
            </Box>
            <Typography sx={{fontFamily:'Arial',overflow: 'auto' ,fontSize:{xs:'4.5vw', sm:'2vw', md:'1.2vw'}, textAlign:'justify', textIndent: '15px', maxHeight: '150px'}}>{description}</Typography>
            <Box justifyContent='center' alignItems='center' display='flex' sx={{marginTop:'20px'}}>
              <Button variant='contained' sx={{marginRight:'15px'}} onClick={handleDownload}
              disabled={(prof&&!preventClick)? false:true}
              startIcon={(!preventClick)?<></>:<CircularProgress size={25} color="primary"/>}>Download</Button>
              <IconButton onClick={handleFav} disabled={(prof&&!preventFav)? false:true}>{(fav)? <FavoriteIcon sx={{color:'red'}}/> : <FavoriteBorderIcon/>}</IconButton>
            </Box>
          </Box>
        </Stack>
      </Paper>
      <OnDelete open={deletes} idBook={id} onClose={setDeletes} onCloseRoot={isOpenFunc} onError={setError} onRespon={setRespon}/>
    </>
  );
}
Book.defaultProps = {
  isModifyFunc : function () {},
}

function OnDelete(props) {
  const{open, idBook, onClose, onError, onRespon, onCloseRoot} = props;
  const[preventClick, setPreventClick] = useState(false);
  const handleClose = () => {
    onClose(false);
  };
  const handleDelete = () => {
    setPreventClick(true);
    axios.delete(deleteBookURL,{
      withCredentials:true,
      params:{
        id:idBook,
      }
    }).then(() => {onClose(false);onRespon('Delete Book Success, please refresh this page !!!');setPreventClick(false);onCloseRoot(null);})
    .catch(err => {onError(err.message);onClose(false);setPreventClick(false);onCloseRoot(null);})
  }
  return <OnDeleteComponent onDelete={handleDelete} title='Delete this Book ?'
    content='Are you sure to delete this book, it cannot be undone after you delete it'
    onClose={handleClose} disabled={preventClick} open={open}/>
}
