import React, {useState} from 'react';
import {Box, Paper, Skeleton, CardMedia, Typography, Button, Divider, Stack, IconButton} from '@mui/material';
import {makeStyles} from '@mui/styles';
import axios from 'axios';
import {createTheme} from '@mui/material/styles';
import {useDispatch, useSelector} from 'react-redux';
import {profile} from '../funcredux/profile_redux';
import {modifyBookURL, modifyBookFavURL} from '../constant/constantDataURL';
import {addBookFav, removeBookFav} from '../funcredux/book_redux';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';

const theme = createTheme();
const useStyle = makeStyles({
    text: {
      fontWeight: 700,
      fontFamily: 'Verdana',
      color: '#000000',
      fontSize:'4vw',
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
      [theme.breakpoints.up('sm')]:{
        fontSize:'1.8vw',
      },
      [theme.breakpoints.up('md')]:{
        fontSize:'1vw',
      },
    }
});

export default function Book(props) {
  const{id, title, author, image, publisher, date, description, theme, data, isOpen, favorite, status} = props;
  const [fav, setFav] = useState(favorite);
  const {format} = require('date-fns');
  const[error, setError] = useState();
  const prof = useSelector(profile);
  const dispatch = useDispatch();
  const handleFav = (a) => {
    setFav(!fav);
    if(fav){
      dispatch(addBookFav({
        id:id,
        title:title,
        author:author,
        publisher:publisher,
        publishDate: date,
        description:description,
        theme:theme,
        data:data,
        image:image,
        favorite:favorite,
        status:status}))
      axios.put(modifyBookFavURL, null, {
        withCredentials:true,
        params:{
          idb: id,
          idu: (prof)? prof.id:0,
          del: false,
        },
      }).catch(err=>setError(err.message))
    }else{
      dispatch(removeBookFav({
        id:id,
        title:title,
        author:author,
        publisher:publisher,
        publishDate: date,
        description:description,
        theme:theme,
        data:data,
        image:image,
        favorite:favorite,
        status:status}))
      axios.put(modifyBookFavURL, null, {
        withCredentials:true,
        params:{
          idb: id,
          idu: (prof)? prof.id:0,
          del: true,
        },
      }).catch(err=>setError(err.message))
    }
  }
  const handleDownload = (a) => {
    var file = require('file-saver');
    let hg = new Uint8Array(data);
    var blob = new Blob([hg],{type: 'application/pdf'});
    file.saveAs(blob, `${title}.pdf`);
    
  }
  const style = useStyle();
  return(
    <Paper sx={{minWidth:'300px', maxWidth:'90vw', zIndex: (theme) => theme.zIndex.drawer + 2, paddingTop:'10px',paddingBottom:'10px'}}>
      <Stack divider={<Divider orientation="vertical" flexItem />} spacing={{xs:0, md:1}} direction={{xs: 'column', md:'row'}} sx={{width:'100%'}}>
        <Box justifyContent='center' alignItems='center' display='flex'>
          <CardMedia image={image} sx={{width:'200px', minHeight: '200px'}}/>
        </Box>
        <Box style={{padding:'6px'}}>
          <Box justifyContent={{md: 'flex-end', xs: 'center'}} width='100%' alignItems='center' display='flex'>
            <IconButton onClick={a => isOpen(null)} sx={{position: 'relative', top:{md:'-25px', xs:0}, left:{md:'20px', xs:0}, background:'#ffa366', color:'#ff1a1a', '&:hover':{background:'#ff1a1a', color:'#ffff'}}}><CloseIcon/></IconButton>
          </Box>
          <Stack direction='row' style={{overflow:'auto', marginTop:'10px',marginBottom:'10px'}} sx={{width:'100%', maxWidth:'100%'}}>
            <Box>
              <Typography noWrap className={style.text}>Id</Typography>
              <Typography noWrap className={style.text}>Title</Typography>
              <Typography noWrap className={style.text}>Author</Typography>
            </Box>
            <Box>
              <Typography noWrap className={style.textSec}>{': '+id}</Typography>
              <Typography noWrap className={style.textSec}>{': '+title}</Typography>
              <Typography noWrap className={style.textSec}>{': '+author}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{background:'#000000', marginLeft:'10px', marginRight:'10px'}}/>
            <Box>
              <Typography noWrap className={style.text}>Publisher</Typography>
              <Typography noWrap className={style.text}>Publish</Typography>
              <Typography noWrap className={style.text}>Theme</Typography>
            </Box>
            <Box>
              <Typography noWrap className={style.textSec}>{': '+publisher}</Typography>
              <Typography noWrap className={style.textSec}>{`: ${(date)? format(new Date(date), 'dd MMM yyyy'): date}`}</Typography>
              <Typography noWrap className={style.textSec}>{': '+theme}</Typography>
            </Box>
          </Stack>
          <Typography style={{overflow: 'auto',fontSize:'18px'}} sx={{fontFamily:'Arial', textAlign:'justify', textIndent: '15px', maxHeight: '150px'}}>{description}</Typography>
          <Box justifyContent='center' alignItems='center' display='flex' sx={{marginTop:'20px'}}>
            <Button variant='contained' sx={{marginRight:'15px'}} onClick={handleDownload} disabled={(data)? false:true}>Download</Button>
            <IconButton onClick={handleFav} disabled={(data)? false:true}>{(fav)? <FavoriteIcon sx={{color:'red'}}/> : <FavoriteBorderIcon/>}</IconButton>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}
