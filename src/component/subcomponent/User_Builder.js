import React,{useState,useEffect} from 'react';
import {getUsersURL, getAdminURL, upgradeAdminURL, searchUser} from '../constant/constantDataURL';
import axios from 'axios';
import {styled} from '@mui/material/styles';
import {Paper, Table, TableContainer, TableHead, TableBody, TableCell, TableRow, IconButton,
  TablePagination, Box, Typography, useMediaQuery} from '@mui/material';
import {OnDeleteComponent, Search} from './otherComponent';
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
  const{type, setError, setRespon, role} = props;
  const[users, setUsers] = useState([]);
  const[disabled, setDisabled] = useState(false);
  const[rowsPerPage, setRowsPerPage] = useState(10);
  const[searchValue, setSearchValue] = useState("");
  const[allDataCounts, setAllDataCounts] = useState(0);
  const[allDataCountsSearch, setAllDataCountsSearch] = useState(0);
  const[page, setPage] = useState(0);
  const[pageSearch, setPageSearch] = useState(0);
  const[admin, setAdmin] = useState();
  const[info, setInfo] = useState();
  const md = useMediaQuery('(min-width:900px)');
  useEffect(()=>{
    if(type==='user'){
      axios.get(getUsersURL,{
        withCredentials:true,
        params:{
          page: page,
          size: rowsPerPage
        }
      }).then(a => {
          if(a.data !== null){
            setUsers(a.data.data);
            setAllDataCounts(a.data.sizeAllData);
          }
          else{
            setError("there is an incorrect response from server, please try again");
          }
        })
      .catch(err => setError(err.message))
    }
    else if (type==='admin' && role==='MANAGER') {
      axios.get(getAdminURL,{
        withCredentials:true,
        params:{
          page: page,
          size: rowsPerPage
        }
      }).then(a => {
          if(a.data !== null){
            setUsers(a.data.data);
            setAllDataCounts(a.data.sizeAllData);
          }
          else{
            setError("there is an incorrect response from server, please try again");
          }
        })
      .catch(err => setError(err.message))
    }
  },[page])
  const handleClick = (a) => () => {
    setInfo(a)
  }
  const handleChangePage = (a,n) => {
    setPage(n)
  }
  const handleChangePageSearch = (a,n) => {
    setPageSearch(n)
    var dataSearch = new FormData();
    dataSearch.append("words",searchValue);
    dataSearch.append("page", pageSearch);
    dataSearch.append("size", rowsPerPage);
    axios.post(searchUser, dataSearch, {
      withCredentials:true,
      headers: {
        'Content-Type':'multipart/form-data',
      }
    }).then(item => setUsers(item.data))
    .catch(err => err.message)
  }
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value,10))
    setPage(0)
  }
  const handleAddAdmin = (email) => (e) => {
    setDisabled(true);
    var form = new FormData();
    form.append('email',email)
    form.append('delete',false)
    axios.post(upgradeAdminURL,form,{
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      }
    }).then(a=>{setDisabled(false);setRespon('Success to promoted new Admin !!!, please refresh this page');setAdmin(null);
      setInfo(null);}).catch(err => {setError(err.message);setDisabled(false);setAdmin(null);setInfo(null);})
  }
  const handleDeleteAdmin = (email) => (e) => {
    setDisabled(true);
    var form = new FormData();
    form.append('email',email)
    form.append('delete',true)
    axios.post(upgradeAdminURL,form,{
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      }
    }).then(a=>{setDisabled(false);setRespon('Success to demoted Admin !!!, please refresh this page');setAdmin(null);
      setInfo(null);}).catch(err => {setError(err.message);setDisabled(false);setAdmin(null);setInfo(null);})
  }
  return(
    <>
      <Paper sx={{padding:'5px', paddingTop:'20px'}}>
        <Search url={searchUser} value={searchValue} setValue={setSearchValue} callback={setUsers} triggerPage={setPageSearch}
          count={setAllDataCountsSearch} isPagination={true} isPage={false} onError={setError}/>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {['ID','Username','Email','Role','Status',''].map((a,i) => (
                  <Cell key={i} align='center'>
                    {a}
                  </Cell>
                ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {(users && users.length)?
                (users.map(a => (
                  <TableRow hover onClick={handleClick(a)}>
                    {
                      [a.id,a.name,a.email,a.role,a.status].map((item,i) =>(
                        <Cell key={i} align='center'>
                          {(i < 4)?item:((item)?
                            <Box justifyContent='center' alignItems='center' display='flex' sx={{color:''}}>
                              <Brightness1Icon sx={{color:'lime', marginRight:'10px'}}/> Online
                            </Box> : <Box justifyContent='center' alignItems='center' display='flex'>
                              <Brightness1Icon sx={{marginRight:'10px'}}/> Offline</Box>)
                          }
                        </Cell>
                      ))
                    }
                    {(type==='user'&&role==='MANAGER')?
                      <Cell>
                        <IconButton onClick={(e) => {e.stopPropagation();setAdmin({name:a.name,email:a.email,type:type});}}><AddBoxIcon color='success'/></IconButton>
                      </Cell>:<></>
                    }
                    {(type==='admin'&&role==='MANAGER')?
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
        {(allDataCountsSearch != 0)?
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={allDataCountsSearch}
            rowsPerPage={rowsPerPage}
            page={pageSearch}
            onPageChange={handleChangePageSearch}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />:<TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={allDataCounts}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        }
      </Paper>
      <UserInfo data={info} setData={setInfo} setError={setError} type={type} setRespon={setRespon}/>
      <OnDeleteComponent onDelete={admin?(admin.type==='user'?handleAddAdmin(admin.email):handleDeleteAdmin(admin.email)):null}
        title={admin?(admin.type==='user'?'Add to administration ?':'Remove from administration ?'):null}
        content={admin?(admin.type==='user'?`Are you sure to add ${admin.name} to become administration ?`
          :`Are you sure to remove ${admin.name} from administration ?`):null}
        onClose={() => setAdmin(null)} open={admin} buttonTitle={admin?(admin.type==='user'?'Add':'Remove'):null}
        disabled={disabled}/>
    </>
  )
}
