import React, {forwardRef} from 'react';
import {Alert, useMediaQuery, Box, TextField, IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import BookView from './Book_view';

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
