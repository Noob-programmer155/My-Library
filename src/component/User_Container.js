import React,{useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {profile} from './funcredux/profile_redux';
import {Box, Tabs, Tab, useMediaQuery, Snackbar} from '@mui/material';
import {ContainerFeedback} from './subcomponent/otherComponent';
import Profile from './Profile';
import UserBuilder from './subcomponent/User_Builder';

export default function UserContainer() {
  const [error, setError] = useState();
  const [link, setLink] = useState(0);
  const prof = useSelector(profile);
  const med = useMediaQuery('(min-width:900px)')
  const handleChange = (a,n) => {
    setLink(n)
  }
  return (
    <>
      <Box justifyContent='center' display='flex' flexWrap='wrap' sx={{background: '#009999', minHeight:'100vh'}}>
        <Box sx={{width:{xs:'100vw', md:'30vw'}}} justifyContent='center' alignItems='center' display='flex' flexWrap='wrap'>
          <Profile error={error} onerror={setError} container="user"/>
          <Tabs variant="fullWidth" value={link} textColor='inherit' indicatorColor="secondary"
            onChange={handleChange} orientation={(med)?'vertical':'horizontal'} sx={{width:'100%',maxWidth:'100%', color:'#ffff', overflow:'auto'}}>
            {
              ["User","Admin"].map((a,i)=>(
                <Tab id={`tab-user-${i}`} aria-controls={`panel-user-${i}`} value={i} value={i}
                  label={a} sx={{display:(i === 1 && prof.role!=='MANAGER')?'none':'flex'}}/>
              ))
            }
          </Tabs>
        </Box>
        <Box sx={{width:{xs:'100vw', md:'69vw'}, maxWidth:'95%', marginTop:'30px'}}>
          <Panel index={0} value={link}>
            <UserBuilder type='user' setError={setError} role={prof.role}/>
          </Panel>
          <Panel index={1} value={link}>
            <UserBuilder type='admin' setError={setError} role={prof.role}/>
          </Panel>
        </Box>
      </Box>
      <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={error}>
        <ContainerFeedback severity='error' onClose={a => setError(null)}>
          {error}
        </ContainerFeedback>
      </Snackbar>
    </>
  )
}

function Panel(props) {
  const {index, value, children}=props;
  return(
    <div id={`panel-user-${index}`} aria-labelledby={`tab-user-${index}`} hidden={value!==index}>
      {children}
    </div>
  );
}
