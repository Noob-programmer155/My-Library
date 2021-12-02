import React, {useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {profile} from '../funcredux/profile_redux';
import {Search, getBase64, UploadImage, CustomTextField, UploadFunc, ModifyBook} from './otherComponent';
import {bookThemes, setBookTheme} from '../funcredux/book_redux';
import {addBookURL} from '../constant/constantDataURL';
import {Typography, Stack, Paper,Button, TextField,IconButton, Box,useMediaQuery} from '@mui/material'

export default function BookBuilder(props) {
  const {setError, setRespon} = props;
  const themes = useSelector(bookThemes);
  const[imgFile, setImageFile] = useState()
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
        <ModifyBook onError={setError} onSuccess={setRespon} themes={themes} prof={prof} imgFile={imgFile}
          imgView={img} setImgView={setImg} imgCallback={setOpen} url={addBookURL} responText='Adding Book Successfully !!!, please refresh this page'
          spacing={2} sx={{padding:'20px',backgroundColor:'#9999ff',borderRadius:'20px'}}/>
      </Box>
      <UploadImage open={open} setOpen={setOpen} img={img} setImg={setImg} imgStore={setImageFile} type='square'
        viewport={{width:150, height:200}}/>
    </>
  )
}

// function AddTheme(props) {
//   const{open, onOpen, onError, dataTheme} = props
//   const[value, setValue] = useState('')
//   const[preventClick, setPreventClick] = useState(false)
//   const dispatch = useDispatch()
//   const addTheme = useCallback((a,n) => {dispatch(setBookTheme([...a, n]))},[dispatch])
//   const handleClickTheme = () => {
//     setPreventClick(true)
//     var data = new FormData()
//     data.append('type',value)
//     axios.post(addBookTypeURL,data,{
//       withCredentials:true,
//       headers:{
//         'Content-Type':'multipart/form-data',
//       }
//     }).then(a => {addTheme(dataTheme, value);onOpen(false);})
//     .catch(err => {onError(err.message);onOpen(false);})
//   }
//   return(
//     <>
//       <Dialog open={open} sx={{zIndex:(theme) => theme.zIndex.drawer + 4}}>
//           <DialogTitle>
//             Add New Theme
//           </DialogTitle>
//           <DialogContent>
//             <DialogContentText>Add new theme to your book</DialogContentText>
//             <Autocomplete variant='filled' value={value} onChange={(a)=> setValue(a.target.value)}/>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClickTheme} disabled={preventClick}>Add</Button>
//             <Button onClick={() => onOpen(false)}>Close</Button>
//           </DialogActions>
//       </Dialog>
//     </>
//   )
// }
