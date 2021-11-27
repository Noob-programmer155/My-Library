import React, {useState, forwardRef} from 'react';
import {Box, Paper, CardMedia, Typography, Button, Divider, Stack, IconButton
    , Snackbar, Alert, Chip} from '@mui/material';
import {makeStyles} from '@mui/styles';
import axios from 'axios';
import {createTheme} from '@mui/material/styles';
import {useDispatch, useSelector} from 'react-redux';
import {profile} from '../funcredux/profile_redux';
import {ContainerFeedback, OnDeleteComponent} from './otherComponent';
import {modifyBookFavURL,modifyBookRekURL, imageBookURL, deleteBookURL,fileBookURL} from '../constant/constantDataURL';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
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
  const{id, title, author, image, publisher, date, description, theme, data, isOpen, favorite, status} = props;
  const colorData = [{back:'#b3ffb3',clr:'#009933'},{back:'#ccf5ff',clr:'#0066ff'},{back:'#ffe0b3',clr:'#ff6600'},
    {back:'#e6ccff',clr:'#c61aff'},{back:'#e6e6ff',clr:'#6600ff'}];
  const [fav, setFav] = useState(favorite);
  const {format} = require('date-fns');
  const[error, setError] = useState();
  const[deletes, setDeletes] = useState();
  const prof = useSelector(profile);
  const dispatch = useDispatch();
  const handleFav = (a) => {
    setFav(!fav);
    if(fav){
      var form = new FormData();
      form.append('idb', id)
      form.append('idu', (prof)? prof.id:0)
      form.append('del', false)
      axios.put(modifyBookFavURL, form, {
        withCredentials:true,
        headers:{
          'Content-Type':'multipart/form-data',
        },
      }).catch(err=>{setError(err.message);setFav(!fav);})
    }else{
      var form = new FormData();
      form.append('idb', id)
      form.append('idu', (prof)? prof.id:0)
      form.append('del', true)
      axios.put(modifyBookFavURL, form, {
        withCredentials:true,
        headers:{
          'Content-Type':'multipart/form-data',
        },
      }).catch(err=>{setError(err.message);setFav(!fav);})
    }
  }
  const handleDownload = (a) => {
    var file = require('file-saver');
    file.saveAs(`${fileBookURL}${data}`, `${title}.pdf`);
    axios.post(modifyBookRekURL,null,{
      withCredentials:true,
      params:{
        idBook: id,
      }
    }).catch(err=>setError(err.message))
  }
  const style = useStyle();
  return(
    <>
      <Paper sx={{minWidth:'250px', maxWidth:'90vw', zIndex: (theme) => theme.zIndex.drawer + 2, padding:'10px'}}>
        <Stack divider={<Divider orientation="vertical" flexItem />} spacing={{xs:0, md:1}} direction={{xs: 'column', md:'row'}} sx={{width:'100%'}}>
          <Box justifyContent='center' alignItems='center' display='flex'>
            <CardMedia image={`${imageBookURL}${image}`}
              sx={{width:'200px', minHeight: '200px'}}/>
          </Box>
          <Box style={{padding:'5px'}}>
            <Box justifyContent={{md: 'flex-end', xs: 'center'}} width='100%' alignItems='center' display='flex'>
              {(prof && status)?
                  (
                    <IconButton onClick={()=> setDeletes(prof.id)} sx={{position: 'relative', top:{md:'-35px', xs:0}, left:{md:'35px', xs:0},
                      background:'#ffa366', color:'#ff1a1a', marginRight:'10px', '&:hover':{background:'#ff1a1a', color:'#ffff'}}}><DeleteIcon/></IconButton>
                  ):(<></>)
              }
              <IconButton onClick={a => isOpen(null)} sx={{position: 'relative', top:{md:'-35px', xs:0}, left:{md:'35px', xs:0},
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
                      var color = (/[A-E]/.exec(a.charAt(0)) !== null)?colorData[0]:(/[F-J]/.exec(a.charAt(0)) !== null)?colorData[1]:
                        (/[K-O]/.exec(a.charAt(0)) !== null)?colorData[2]:(/[P-T]/.exec(a.charAt(0)) !== null)?colorData[3]:colorData[4]
                      return <Chip key={i} className={style.chip} style={{background:color.back,color:color.clr}} label={a} size="small"/>
                    })
                  ) : (<></>)
                }
              </Stack>
            </Box>
            <Typography sx={{fontFamily:'Arial',overflow: 'auto' ,fontSize:{xs:'4.5vw', sm:'2vw', md:'1.2vw'}, textAlign:'justify', textIndent: '15px', maxHeight: '150px'}}>{description}</Typography>
            <Box justifyContent='center' alignItems='center' display='flex' sx={{marginTop:'20px'}}>
              <Button variant='contained' sx={{marginRight:'15px'}} onClick={handleDownload} disabled={(data)? false:true}>Download</Button>
              <IconButton onClick={handleFav} disabled={(data)? false:true}>{(fav)? <FavoriteIcon sx={{color:'red'}}/> : <FavoriteBorderIcon/>}</IconButton>
            </Box>
          </Box>
        </Stack>
      </Paper>
      <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={error}>
        <ContainerFeedback severity='error' onClose={a => setError(null)}>
          {error}
        </ContainerFeedback>
      </Snackbar>
      <OnDelete open={deletes} idBook={id} onClose={setDeletes} onError={setError}/>
    </>
  );
}

function OnDelete(props) {
  const{open, idBook, onClose, onError} = props;
  const handleClose = () => {
    onClose(false);
  };
  const handleDelete = () => {
    axios.delete(deleteBookURL,{
      withCredentials:true,
      params:{
        id:idBook,
      }
    }).then(() => onClose(false)).catch(err => onError(err.message))
  }
  return <OnDeleteComponent onDelete={handleDelete} title='Delete this Book ?'
    content='Are you sure to delete this book, it cannot be undone after you delete it'
    onClose={handleClose} open={open}/>
}
