import React,{useState,useEffect} from 'react';
import {Dialog, DialogContent, DialogTitle, DialogActions, Button, Stack, Avatar, Box, Table,
  TableBody, TableRow, IconButton, TextField} from '@mui/material';
import TableCell,{tableCellClasses} from '@mui/material/TableCell';
import {profile} from '../funcredux/profile_redux';
import {useSelector} from 'react-redux';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
import {styled} from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import {OnDeleteComponent, PasswordContainer} from './otherComponent';
import {deleteUserURL,deleteAdminURL,verifyPasswordURL} from '../constant/constantDataURL'

const Cell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.body}`]:{
    fontSize:'3vw',
    borderBottom: 'none',
    [theme.breakpoints.up('sm')]:{
      fontSize:'2vw',
    },
    [theme.breakpoints.up('md')]:{
      fontSize:'1vw',
    },
  },
}))

export default function UserInfo(props) {
  const{data, setData, type, setError} = props;
  const[state, setState] = useState();
  const[verify, setVerify] = useState();
  const prof = useSelector(profile);
  const[password, setPassword] = useState();
  const handleDelete = () => {
    var form = new FormData();
    form.append('email',data.email)
    form.append('pass',password)
    axios.post(verifyPasswordURL,form,{
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      }
    }).then(a => {
      if(type==="user"){
        axios.delete(deleteUserURL,{
          withCredentials:true,
          params:{
            name: data.name,
            email: data.email
          }
        }).catch(err => setError(err.message))
      }
      else if (type==="admin") {
        axios.delete(deleteAdminURL,{
          withCredentials:true,
          params:{
            name: data.name,
            email: data.email
          }
        }).catch(err => setError(err.message))
      }
    }).catch(err => setError(err.message))
  }
  const handlePass = () => {
    setVerify(true);
    setState(false);
  }
  return (
    <>
      {(data)?
        (<Dialog open={Boolean(data)} onClose={() => setData(null)} sx={{zIndex:(theme)=>theme.zIndex.drawer + 4}}>
          <DialogContent>
            <Stack>
              <Box justifyContent='center' alignItems='center' display='flex'>
                <Avatar sx={{width:(theme) => theme.spacing(11),height:(theme) => theme.spacing(11)}}
                  src={(data.image_url)?data.image_url:'data:image/jpg;base64,sadgyuasg'} alt={data.name}/>
              </Box>
              <Table sx={{maxWidth:'100%'}}>
                <TableBody>
                  {[{id:'USER ID',value:data.id},{id:'USERNAME',value:data.name},
                    {id:'EMAIL',value:data.email},{id:'ROLE',value:data.role}].map(a => (
                      <TableRow>
                        <Cell align='left'>
                          <b>{a.id}</b>
                        </Cell>
                        <Cell align='right'>
                          {a.value}
                        </Cell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
              <Box display='flex' justifyContent='flex-end'>
                <IconButton onClick={() => setState(true)} sx={{borderRadius:'10px', color:'#ffff',
                  backgroundColor:'#e60000', '&:hover':{backgroundColor:'#990000'}}}>
                  <DeleteIcon color='inherit'/></IconButton>
              </Box>
            </Stack>
          </DialogContent>
        </Dialog>):(<></>)
      }
      <OnDeleteComponent onDelete={handlePass} title='Delete this User ?'
        content='Are you sure to delete this user, it cannot be undone after you delete it'
        onClose={() => setState(false)} open={state}/>
      <PasswordContainer isVerify={verify} setVerify={setVerify} isPassword={password} setPassword={setPassword}
        onDelete={handleDelete}/>
    </>
  )
}
