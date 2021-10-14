import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {profile} from './funcredux/profile_redux';
import {setTypes, setChoices, linktypes, linkchoice} from './funcredux/linkedRes';
import axios from 'axios'
import {books, setBooks, bookThemes, favoriteBooks, recommendBooks, myBooks} from './funcredux/book_redux';
import {Box, TextField, Typography, Stack, IconButton, useMediaQuery} from '@mui/material';
import BookView from './subcomponent/Book_view';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function MainContainer() {
  const prof = useSelector(profile);
  const buku = useSelector(books);
  const favBuku = useSelector(favoriteBooks);
  const recBuku = useSelector(recommendBooks);
  const myBuku = useSelector(myBooks);
  const themes = useSelector(bookThemes);
  const type = useSelector(linktypes);
  const choice = useSelector(linkchoice);
  const {format} = require('date-fns');
  const dispatch = useDispatch();
  const [respon,setRespon]=useState();
  const [error,setError]=useState();
  const md = useMediaQuery('(min-width:900px)')
  useEffect(()=>{
    if(prof.id !== null || prof.id >= 0){
      axios.get("http://localhost:8895/book/getbooks",{
        withCredentials:true,
        params: {
          idUs: prof.id,
        },
      }).then(a => a.data !== null? dispatch(setBooks(a.data)):setError("there is a network error"))
        .catch(err => setError(err.message));
    }
    else{
      axios.get("http://localhost:8895/book/getbooks",{
        withCredentials:true,
      }).then(a => a.data !== null? dispatch(setBooks(a.data)):setError("there is a network error"))
        .catch(err => setError(err.message));
    }
  },[])
  const clone = []
  for(var s = 0; s < 20; s++){
    clone.push(<BookView key={s} id={null} sx={{marginBottom:(theme) => theme.spacing(1), marginRight: (theme) => theme.spacing(1)}}/>)
  }
  const Contain = (props) => {
      const {index, ids, reverseids, value, theme} = props;
      return(
        <div id={`${ids}${index}`} hidden={value !== index} aria-labelledby={`${reverseids}${index}`}>
          <Box display='flex' flexWrap='wrap' sx={{maxWidth:'100%', maxHeight:'500px', overflow:'auto'}}>
          {(buku)?
            (buku.filter(a => a.theme === theme).map((a,i) => (
                <BookView key={i} id={a.id} title={a.title} author={a.author} image={a.image}
                  publisher={a.publisher} date={format(new Date(a.publishDate), 'dd-MM-yyyy')}
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
  const ContainChoice = (props) => {
      const {index, ids, reverseids, value, type} = props;
      if(type === "recommended"){
        return(
          <div id={`${ids}${index}`} hidden={value !== index} aria-labelledby={`${reverseids}${index}`}>
            <Box display='flex' flexWrap='wrap' sx={{maxWidth:'100%', maxHeight:'500px', overflow:'auto'}}>
            {(recBuku)?
              (recBuku.map((a,i) => (
                  <BookView key={i} id={a.id} title={a.title} author={a.author} image={a.image}
                    publisher={a.publisher} date={format(new Date(a.publishDate), 'dd-MM-yyyy')}
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
      else if(type === "favorite"){
        return(
          <div id={`${ids}${index}`} hidden={value !== index} aria-labelledby={`${reverseids}${index}`}>
            <Box display='flex' flexWrap='wrap' sx={{maxWidth:'100%', maxHeight:'500px', overflow:'auto'}}>
            {(favBuku)?
              (favBuku.map((a,i) => (
                  <BookView key={i} id={a.id} title={a.title} author={a.author} image={a.image}
                    publisher={a.publisher} date={format(new Date(a.publishDate), 'dd-MM-yyyy')}
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
      else if(type === "mybook"){
        return(
          <div id={`${ids}${index}`} hidden={value !== index} aria-labelledby={`${reverseids}${index}`}>
            <Box display='flex' flexWrap='wrap' sx={{maxWidth:'100%', maxHeight:'500px', overflow:'auto'}}>
            {(myBuku)?
              (myBuku.map((a,i) => (
                  <BookView key={i} id={a.id} title={a.title} author={a.author} image={a.image}
                    publisher={a.publisher} date={format(new Date(a.publishDate), 'dd-MM-yyyy')}
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
      else if(type === "allBook"){
        return(
          <div id={`${ids}${index}`} hidden={value !== index} aria-labelledby={`${reverseids}${index}`}>
            <Box display='flex' flexWrap='wrap' sx={{maxWidth:'100%', maxHeight:'500px', overflow:'auto'}}>
            {(buku)?
              (buku.map((a,i) => (
                  <BookView key={i} id={a.id} title={a.title} author={a.author} image={a.image}
                    publisher={a.publisher} date={format(new Date(a.publishDate), 'dd-MM-yyyy')}
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
      else {
        return ;
      }
  }
  return(
    <Box sx={{marginTop:'20px'}}>
      <Box>
        <Box display='flex' justifyContent='flex-start' alignItems='center' sx={{paddingLeft:'10px', paddingBottom:'30px'}}>
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
          <IconButton sx={{color:'#ffff', background:'#004d4d', marginLeft:'7px', '&:hover':{background:'#004d4d'}}}><BarChartIcon sx={{fontSize: (md)? '25px':'10px'}}/></IconButton>
        </Box>
      </Box>
      <Box display={(md)? 'flex':'none'} flexWrap='wrap' sx={{paddingLeft:'10px', maxWidth:'100%', maxHeight:'500px', overflow:'auto'}}>
        {
          (themes)? (
            themes.map((a,i) => (
              <Contain index={i} ids='panel-main-' reverseids='btn-type-' value={type} theme={a}/>
            ))
          ):(<></>)
        }
      </Box>
      <Box display={(md)? 'none':'flex'} flexWrap='wrap' sx={{paddingLeft:'10px', maxWidth:'100%', maxHeight:'500px', overflow:'auto'}}>
        {
          (buku)? (
            ["recommended","favorite","mybook","allBook"].map((a,i) => (
              <ContainChoice index={i} ids='btn-Cho-' reverseids='mob-cho-' value={choice} type={a}/>
            ))
          ):(<></>)
        }
      </Box>
    </Box>
  );
}
