import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useRoutes } from 'react-router-dom';
import Papa from 'papaparse';


// material

// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TextField,
  Box
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu, } from '../sections/@dashboard/user';
//
import {UserListHead2} from '../sections/@dashboard/user/UserListHead2'
import USERLIST from '../_mocks_/user';
import { FetchApi } from '../api/FetchApi';
import { FIND_SUBJECT_ID, EXPORT_PROFILE } from '../api/Endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

import { faInfo } from '@fortawesome/free-solid-svg-icons';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Subject Name', alignRight: false },
  { id: 'company', label: 'ID Number', alignRight: false },
  { id: 'role', label: 'Email', alignRight: false },
  { id: 'isVerified', label: 'Phone Number', alignRight: false },
  { id: 'status', label: 'Gender', alignRight: false },

   ];


// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.subject_Name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}

export default function BatchProfiles() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allData,setAllData]=useState([])

  // const [allData, setAllData] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [fileName, setFileName] = useState(undefined)
  const [caseList, setCaseList] = useState([]);
  const [showButton, setshowButton] = useState(false)
  const [batchNo, setBatchNo] = useState('')
  

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const showErrorAlert = (message) => {
    alert.error(message);
  };
  
  const showSuccessAlert = (message) => {
    alert.success(message);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    const users = applySortFilter(allData, getComparator(order, orderBy), filterName);
        setFilteredUsers(users)
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;


  const changeHandler = (event) => {
    setFileName(event.target.files[0])
    Papa.parse(event.target.files[0],{
      header:true,
      skipEmptyLines:true,
    //   step: (results, parser) => {
    //     console.log('List is ::', results.data)
    //     results.data = _.pick(results.data, ['Id'])
    //     setCaseList(results.data)
    //     console.log('List is2 ::', caseList)
    //  },
     complete: function (results)
     {
      //results.data = _.pick(results.data , [ 'Id'])
      
      console.log('List1 is ::', results.data);
      mappedList = results.data.map(element => ({Id: element.Id}));
      
      console.log('List is mapped ::', mappedList);
      setCaseList(mappedList)
      console.log('List is mapped2 ::', caseList);
     }

    })
   
  };
  const BatchInfo = {
    batchNo: batchNo,
    data: caseList
  };
  

  useEffect(()=>{

    const requestBody = {
        subjectID:"",
        idNo: ""
    }

    FetchApi.post(FIND_SUBJECT_ID, requestBody, (status, data) => {
      if(status){
        console.log(data)
        const users = applySortFilter(data, getComparator(order, orderBy), filterName);
        setFilteredUsers(users)
        setAllData(users)
        
      }else{
        //some error
      }
    })

  }, []) ;
  const hiddenfileInput = useRef(null);
  const handleFile  = event => {
    hiddenfileInput.current.click();
  };
  const checkSubmit = () =>
  {
    if(caseList && batchNo)
    {
      console.log('List is mapped2 ::', BatchInfo);
    }
    else{
      showErrorAlert('Please make an attachment and provide a ref no as batch number')
    }
  }
  let mappedList = []
  const isUserNotFound = filteredUsers.length === 0;
  
  
  
  
  return (
    <Page title="KRA VLA | Search Batch">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Search Batch
          </Typography>
          {/* <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Profile
          </Button> */}
        </Stack>

        <Card>
                 <Stack direction="row" alignItems="center" justifyContent="space-around" mt={3}>
                    <Box width={500}>
                     <TextField
                     fullWidth
                        label="Input Batch no"
                        type='text'
                        onChange={
                          (e) => {
                            setBatchNo(e.target.value);
                        }
                        }
                      />
                    </Box>
                    <div>
                      <input
                        type = 'file'
                        name = 'file'
                        hidden
                        ref={hiddenfileInput}
                        onChange = {changeHandler}
                        accept='.csv'
                       style={{display:'none'}} 
                      />

                    </div>
                    <Button
                          variant="outlined"
                         // sx={{ marginRight: 2, background: '#0090B2' }}
                         onClick={handleFile}
                        >
                          Attach a batch file
      
                        </Button>
                        {fileName ? (
                      <Typography>{fileName.name}</Typography>
                    ) : (
                      <Typography>No attachment added</Typography>
                    )}
                      <Button
                          variant="contained"
                          sx={{ marginRight: 2, background: '#00B23A' }}
                         onClick={checkSubmit}
                        >
                          Upload batch
                        </Button>
                    </Stack>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { subjectID, subject_Name, idNo, email, 
                        tel1, profile_pic, gender } = row;
                      const isItemSelected = selected.indexOf(subject_Name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={subjectID}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, subject_Name)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={subject_Name} src={profile_pic} />
                              <Typography variant="subtitle2" noWrap>
                                {subject_Name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{idNo}</TableCell>
                          <TableCell align="left">{email}</TableCell>
                          <TableCell align="left">{tel1}</TableCell>
                          <TableCell align="left">{gender}
                          
                            {/* <Label
                              variant="ghost"
                              color={(status === 'banned' && 'error') || 'success'}
                            >
                              {sentenceCase(status)}
                            </Label> */}
                          </TableCell>



                          <TableCell align="right">
                          <RouterLink to={"/dashboard/profile/SP/"+idNo}>
                            <FontAwesomeIcon icon={faEye}/>
                          </RouterLink>


                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

       
      </Container>
    </Page>
  );




                };

