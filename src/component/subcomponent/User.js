import React,{useState,useEffect} from 'react';
import {Dialog, DialogContent, Stack, Avatar, Box, Table, TableBody, TableRow} from '@mui/material';
import TableCell,{tableCellClasses} from '@mui/material/TableCell';
import InfoIcon from '@mui/icons-material/Info';
import {styled} from '@mui/material/styles';

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
  const{data, setData} = props;
  return (
    <>
    {(data)?
      (<Dialog open={Boolean(data)} onClose={() => setData(null)}>
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
          </Stack>
        </DialogContent>
      </Dialog>):(<></>)
    }
    </>
  )
}
