import React,{useState,useEffect} from 'react';
import {getUsersURL, getAdminURL, getUserOnlineURL, upgradeAdminURL} from '../constant/constantDataURL';
import axios from 'axios';
import {styled} from '@mui/material/styles';
import {Paper, Table, TableContainer, TableHead, TableBody, TableCell, TableRow, IconButton,
  TablePagination, Box, Typography} from '@mui/material';
import {OnDeleteComponent} from './otherComponent';
import UserInfo from './User'
import Brightness1Icon from '@mui/icons-material/Brightness1';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const Cell = styled(TableCell)(({theme}) => ({
  fontSize: '3vw',
  [theme.breakpoints.up('sm')]:{
    fontSize: '2vw',
  },
  [theme.breakpoints.up('md')]:{
    fontSize: '1vw',
  },
}))

export default function UserBuilder(props) {
  const{type, setError, role} = props;
  const[users, setUsers] = useState([]);
  const[onlineUsers, setOnlineUsers] = useState([1]);
  const[rowsPerPage, setRowsPerPage] = useState(5);
  const[page, setPage] = useState(0);
  const[admin, setAdmin] = useState();
  const[info, setInfo] = useState();
  useEffect(()=>{
    axios.get(getUserOnlineURL,{
      withCredentials:true,
    }).then(a => a.data !== null? setOnlineUsers(a.data):setError("there is an incorrect response from server, please try again"))
    .catch(err => setError(err.message))
    if(type==='user'){
      axios.get(getUsersURL,{
        withCredentials:true,
      }).then(a => a.data !== null? setUsers(a.data):setError("there is an incorrect response from server, please try again"))
      .catch(err => setError(err.message))
    }
    else if (type==='admin') {
      axios.get(getAdminURL,{
        withCredentials:true,
      }).then(a => a.data !== null? setUsers(a.data):setError("there is an incorrect response from server, please try again"))
      .catch(err => setError(err.message))
    }
  },[])
  const handleClick = (a) => () => {
    setInfo(a)
  }
  const handleChangePage = (a,n) => {
    setPage(n)
  }
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value,10))
    setPage(0)
  }
  const handleAddAdmin = (name,email) => (e) => {
    var form = new FormData();
    form.append('name',name)
    form.append('email',email)
    form.append('delete',false)
    axios.post(upgradeAdminURL,form,{
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      }
    }).then().catch(err => setError(err.message))
  }
  const handleDeleteAdmin = (name,email) => (e) => {
    var form = new FormData();
    form.append('name',name)
    form.append('email',email)
    form.append('delete',true)
    axios.post(upgradeAdminURL,form,{
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      }
    }).then().catch(err => setError(err.message))
  }
  return(
    <>
      <Paper>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {['ID','Username','Email','Role','Status',''].map(a => (
                  <Cell align='center'>
                    {a}
                  </Cell>
                ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {(users && users.length)?
                (users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(a => (
                  <TableRow hover onClick={handleClick(a)}>
                    {
                      [a.id,a.name,a.email,a.role].map(item =>(
                        <Cell align='center'>
                          {item}
                        </Cell>
                      ))
                    }
                    <Cell align='center'>
                      {onlineUsers.includes(a.id)?(
                        <Box justifyContent='center' alignItems='center' display='flex' sx={{color:''}}>
                          <Brightness1Icon sx={{color:'lime', marginRight:'10px'}}/> Online</Box>
                      ):(<Box justifyContent='center' alignItems='center' display='flex'>
                        <Brightness1Icon sx={{marginRight:'10px'}}/> Offline</Box>)}
                    </Cell>
                    {(type==='user'&&role==='MANAGER')?
                      <Cell>
                        <IconButton onClick={(e) => {e.stopPropagation();setAdmin({name:a.name,email:a.email,type:type});}}><AddBoxIcon color='success'/></IconButton>
                      </Cell>:<></>
                    }
                    {(type==='admin')?
                      <Cell>
                        <IconButton onClick={(e) => {e.stopPropagation();setAdmin({name:a.name,email:a.email,type:type});}}><RemoveCircleIcon color='error'/></IconButton>
                      </Cell>:<></>
                    }
                  </TableRow>
                ))):(
                  <></>
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <UserInfo data={info} setData={setInfo} setError={setError} type={type}/>
      <OnDeleteComponent onDelete={admin?(admin.type==='user'?handleAddAdmin(admin.name,admin.email):handleDeleteAdmin(admin.name,admin.email)):null}
        title={admin?(admin.type==='user'?'Add to administration ?':'Remove from administration ?'):null}
        content={admin?(admin.type==='user'?`Are you sure to add ${admin.name} to become administration ?`
          :`Are you sure to remove ${admin.name} from administration ?`):null}
        onClose={() => setAdmin(null)} open={admin} buttonTitle={admin?(admin.type==='user'?'Add':'Remove'):null}/>
    </>
  )
}
