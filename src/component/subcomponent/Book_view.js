import React, {useState} from 'react';
import {CardMedia, Card, CardActionArea, Typography, Box, Divider, Skeleton, Backdrop} from '@mui/material';
import {createTheme} from '@mui/material/styles';
import {imageBookUrl} from '../constant/constantDataURL';
import {makeStyles} from '@mui/styles';
import Book from './Book';

const theme = createTheme()
const useStyle = makeStyles({
  root: {
    width: '60px',
    borderRadius: '10px',
    [theme.breakpoints.up('md')]:{
      width: '100px',
    },
  },
  load: {
    width: '60px',
    height: '70px',
    borderRadius: '10px',
    [theme.breakpoints.up('md')]:{
      width: '100px',
      height: '110px',
    },
  },
  id: {
    fontSize: '8px',
    [theme.breakpoints.up('md')]:{
      fontSize: '15px',
    },
  },
  text: {
    textAlign:'center',
    fontFamily: 'Century Gothic',
    fontSize: '7px',
    [theme.breakpoints.up('md')]:{
      fontSize: '12px',
    },
  },
  image:{
    width:'50px',
    height: '40px',
    [theme.breakpoints.up('md')]:{
      width:'100px',
      height: '80px',
    },
  }
});

export default function BookView(props) {
  const style = useStyle();
  const {id, key, title, author, image, publisher, date, description, status, theme, data, favorite, ...attr} = props;
  const[open, setOpen] = useState();
  return(
    <>
      {
        (id)? (
          <>
          <Card key={key} className={style.root} {...attr}>
            <CardActionArea onClick={a => setOpen(id)}>
              <Box justifyContent='center' alignItems='center' display='flex' width='100%'>
                <CardMedia image={image} //{`${imageBookUrl}${image}`}
                  className={style.image}>
                  <Box justifyContent='flex-start' alignItems='center' display='flex' width='100%'>
                    <Typography className={style.id}>{id.split(":")[0]}</Typography>
                  </Box>
                </CardMedia>
              </Box>
              <Divider/>
              <Typography className={style.text} sx={{color:'#007acc'}}>{title}</Typography>
              <Divider variant='middle'/>
              <Typography className={style.text} sx={{color:'#ff8000'}}>{author}</Typography>
            </CardActionArea>
          </Card>
          <Backdrop sx={{zIndex: (theme) => theme.zIndex.drawer + 1, width:'100vw', height:'100vh'}} open={open}>
            <Book id={id} title={title} author={author} image={image} publisher={publisher} isOpen={setOpen}
              date={date} description={description} theme={theme} data={data} favorite={favorite} status={status}/>
          </Backdrop>
          </>
        ):(
          <Skeleton key={key} className={style.load} variant='rectangular' {...attr}/>
        )
      }
    </>
  );
}
