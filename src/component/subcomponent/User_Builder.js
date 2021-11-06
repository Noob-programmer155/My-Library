import React,{useState,useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {getUsersURL, getAdminURL, getUserOnlineURL} from '../constant/constantDataURL';
import axios from 'axios';
import {styled} from '@mui/material/styles';
import {Paper, Table, TableContainer, TableHead, TableBody, TableCell, TableRow, TablePagination, Box, Typography} from '@mui/material';
import UserInfo from './User'
import Brightness1Icon from '@mui/icons-material/Brightness1';

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
  const{type, setError} = props;
  const[users, setUsers] = useState([
    {
      id: 1,
      name:'Arrijal Amar M',
      email:'Rijal.amar29@gmail.com',
      role:'MANAGER',
      image_url:null,
    },
    {
      id: 2,
      name:'Ridwan Nugroho',
      email:'ridwan.n30@gmail.com',
      role:'ADMINISTRATIF',
      image_url:null,
    }
  ]);
  const[onlineUsers, setOnlineUsers] = useState([1]);
  const[rowsPerPage, setRowsPerPage] = useState(5);
  const[page, setPage] = useState(0);
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
  return(
    <>
      <Paper>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {['ID','Username','Email','Role','Status'].map(a => (
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
      <UserInfo data={info} setData={setInfo}/>
    </>
  )
}
