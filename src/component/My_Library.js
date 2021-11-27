import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {profile} from './funcredux/profile_redux';
import {myBooks, setBookSeller, setBookTheme, bookThemes} from './funcredux/book_redux';
import {Box, Tabs, Tab, useMediaQuery, Snackbar} from '@mui/material';
import Profile from './Profile';
import {getMyBookURL, getBookTypeURL} from './constant/constantDataURL';
import {Container, Search, ContainerFeedback} from './subcomponent/otherComponent';
import BookBuilder from './subcomponent/Book_Builder';

export default function MyLibrary() {
  const[error, setError]=useState();
  const[respon, setRespon]=useState();
  const user = useSelector(profile);
  const myBuku = useSelector(myBooks);
  const dispatch = useDispatch();
  const[link, setLink] = useState(1);
  const handleChange = (a,n) => {
    setLink(n)
  }
  const med = useMediaQuery('(min-width:900px)');
  useEffect(async()=>{
    if(user) {
      axios.get(getMyBookURL,{
        withCredentials:true,
        params:{
          id: user.id,
        }
      }).then(a => a.data !== null? dispatch(setBookSeller(a.data)):setError("there is an incorrect response from server, please try again"))
      .catch(err => setError(err.message))
      axios.get(getBookTypeURL,{
        withCredentials:true
      }).then(a => a.data !== null? dispatch(setBookTheme(a.data)):setError("there is an incorrect response from server, please try again"))
      .catch(err => setError(err.message))
    }
  },[user])
  return(
    <>
      <Box display='flex' flexWrap={{xs:'wrap', md:'nowrap'}} sx={{background: '#009999', minHeight:'100vh'}}>
        <Box sx={{width:{xs:'100vw', md:'30vw'}, maxHeight:'100vh'}} justifyContent='center' alignItems='center' display='flex' flexWrap='wrap'>
          <Profile error={error} onerror={setError} container="library"/>
          <Tabs variant="fullWidth" value={link} textColor='inherit' indicatorColor="secondary"
            onChange={handleChange} orientation={(med)?'vertical':'horizontal'} sx={{width:'100%',maxWidth:'100%', color:'#ffff', overflow:'auto'}}>
            {
              ["Book Builder","Book Storage"].map((a,i)=>(
                <Tab id={`tab-mylibrary-${i}`} aria-controls={`panel-mylibrary-${i}`} value={i}
                  label={a}/>
              ))
            }
          </Tabs>
          // footer app
        </Box>
        <Box sx={{width:{xs:'100vw', md:'70vw'}, padding: '10px'}}>
          <Panel index={0} value={link}>
            <>
              <Box>
                <BookBuilder setError={setError} setRespon={setRespon}/>
              </Box>
            </>
          </Panel>
          <Panel index={1} value={link}>
            <Box width='100%' sx={{maxHeight:'500px', overflow:'auto'}}>
              <Search/>
              <Box paddingLeft='10px'>
              {
                  (myBuku)?
                    (<Container index={1} ids='panel-mylibrary-' reverseids='tab-mylibrary-' value={1} data={myBuku}/>):(<p>Loading data...</p>)
              }
              </Box>
            </Box>
          </Panel>
        </Box>
      </Box>
      <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={(respon)?respon:error}>
        <ContainerFeedback severity={(respon)?'success':'error'} onClose={a => {setError(null);setRespon(null);}}>
          {(respon)?respon:error}
        </ContainerFeedback>
      </Snackbar>
    </>
  );
};

function Panel(props) {
  const {index, value, children}=props;
  return(
    <div id={`panel-mylibrary-${index}`} aria-labelledby={`tab-mylibrary-${index}`} hidden={value!==index}>
      {children}
    </div>
  );
}
