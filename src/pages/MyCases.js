import { filter } from 'lodash';
import { useState, useEffect,useContext, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';

import { useAlert } from 'react-alert';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
// material

// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Toolbar,
  Tooltip,
  Box,
  Container,
  Typography,
  TableHead,
  TableContainer,
  TablePagination,
  Collapse
} from '@mui/material';
// components
import { visuallyHidden } from '@mui/utils';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
//
import Paper from '@mui/material/Paper';
import USERLIST from '../_mocks_/user';
import { FetchApi } from '../api/FetchApi';
import { MY_BATCH, BATCH_LIST, GET_ALL_USERS, OPEN_INDIVIDUAL_CASES, ASSIGN_BATCH} from '../api/Endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faEye } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from 'src/context/UserContext';
import Label from '../components/Label';
//import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
//import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'bID', label: 'Batch ID', alignRight: false },
  { id: 'Status', label: 'Status', alignRight: false },
  { id: 'date', label: 'Date Created', alignRight: false },
   ];
const Table_head2 = [
  { id: 'sis', label: 'profile ID', alignRight: false },
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'name', label: 'subject name', alignRight: false },
  { id: 'dob', label: 'Date of birth', alignRight: false },
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

export default function MyCases() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allData,setAllData]=useState([])
  const { userData } = useContext(UserContext)
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0)
  const radioGroupRef = useRef(null);
  const [dTrue, setdTrue] = useState(false);
  const [dTrue2, setdTrue2] = useState(false);
  const [selectedUser, setSelectedUser] = useState("")
  const [users, setUsers] = useState([])
  const [value2, setValue] = useState("")
  // const [allData, setAllData] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [batchList, setBatchList] = useState([])  
  const [batchNum, setBatchNum] = useState('')
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const alert = useAlert();

  const showAlert = () => {
    alert.success('SAVED SUCCESSFULLY');
  };
  const showErrorAlert = () => {
    alert.success('Did not save');
  };

  useEffect(() => {

    getUsers()

  }, [])

  const getUsers = () => 
  {
    const requestBody = {
      
      userID: userData.userID,
     
    }
    
     FetchApi.post(GET_ALL_USERS, requestBody, (status, data) => {

      console.log("User Data", data)
      console.log(requestBody,"Request Body")

      if (status) {

        setUsers(data)
        console.log("Lets see",  users)
      } else {
        //some error
      }
    })

  }


  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  
  };

  const assignSelectedUser = () => {

    setdTrue(false)

    const postBody = {
      batchNo:batchNum,
      userID: userData.userID,
      assignee: selectedUser,
      caseType: value2,
     // status: "2",
      profiles: selected
    }

    console.log("BODY", postBody)

    tranferCase(postBody)

  }

  
  const tranferCase = (postBody) =>
  {
    console.log(postBody)
    FetchApi.post(OPEN_INDIVIDUAL_CASES, postBody, (status, data) => {
      console.log("what I've sent", postBody, status, data)
      if (status){
        showAlert()
        postBody.inquryID = postBody.inquiryID
        setCaseData(postBody)
        changeLabel(postBody.status)
      } else
      {
       showErrorAlert()
      }
    })
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = batchList.map((n) => n.name);
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


  useEffect(()=>{

    const requestBody = {
        userID:userData.userID
    }

    FetchApi.post(MY_BATCH, requestBody, (status, data) => {
      if(status){

        console.log("INQUIRIES::::",data)
       // const inquiry = applySortFilter(data, getComparator(order, orderBy), filterName);
        setFilteredUsers(data)
        setAllData(data)
        
      }else{
        //some error
      }
    })

  }, []) 

  const handleSelect = (event) =>
{
    setBatchNum(event.target.value)
    console.log(".......", batchNum)
    setCount(count + 1)
    setOpen((prev) => ({ ...prev, [batchNum]: !prev[batchNum] }))
}

  useEffect(()=>{

    const requestBody = {
        userID:userData.userID,
        batchNo: batchNum
    }

    FetchApi.post(BATCH_LIST, requestBody, (status, data) => {
      if(status){

        console.log("INQUIRIES::::",data)
       const inquiry = applySortFilter(data, getComparator(order, orderBy), filterName);
        setBatchList(inquiry)
        setAllData(inquiry)
        
      }else{
        //some error
      }
    })

  }, [count]) 


  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const openSomeDiag = (event) =>
  {
    setdTrue2(false)
    setdTrue(true)
  }

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="VLA - Cases">
      <Container>
      <Dialog
          sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 535 } }}
          maxWidth="sm"
          TransitionProps={{ onEntering: handleEntering }}
          open={dTrue2}
        >
          <DialogTitle>Choose case type</DialogTitle>
          <DialogContent dividers>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value2}
            onChange={(event) => setValue(event.target.value)}
      >
        <FormControlLabel value="Background Check" control={<Radio />} label="Background Check" />
        <FormControlLabel value="Vetting" control={<Radio />} label="Vetting" />
        <FormControlLabel value="Preliminary Investigation" control={<Radio />} label="Preliminary Investigation" />
        <FormControlLabel value="Lifestyle Audit" control={<Radio />} label="Lifestyle Audit" />
      </RadioGroup>

          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setdTrue2(false)}>
              Cancel
            </Button>
            <Button onClick={() => openSomeDiag()}>Confirm</Button>
          </DialogActions>
        </Dialog>


      <Dialog
          sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 535 } }}
          maxWidth="sm"
          TransitionProps={{ onEntering: handleEntering }}
          open={dTrue}
        >
          <DialogTitle>Select User to Assign</DialogTitle>
          <DialogContent dividers>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={selectedUser}
              onChange={(event) => setSelectedUser(event.target.value)}
              name="radio-buttons-group"
            >
              {users.map((option) => (
                // <FormControlLabel value={option.userid} control={<Radio />}
                //   label={option.firstName + " " + option.lastName + " - " + option.department} />

                <UserItem user={option} checked={selectedUser == option.userid} setSelection={setSelectedUser} />

              ))}
            </RadioGroup>

          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setdTrue(false)}>
              Cancel
            </Button>
            <Button onClick={() => assignSelectedUser()}>Confirm</Button>
          </DialogActions>
        </Dialog>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            My Cases
          </Typography>   
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }} component={Paper}>
              <Table aria-label="collapsible table">
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={""}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { batchNo, status, dateCreated,idNo, email, 
                        tel1, profile_pic, gender} = row;
                      const isItemSelected = selected.indexOf(batchNo) !== -1;

                    //  let caseStatus = 'Open';
                     let caseLabelType = 'success'
                      switch (status) {
                        case 'Open':
                          caseLabelType = 'success';
                          break;
                        case 'In Progress':
                         
                          caseLabelType = 'info';
                          break;
                        case 'In Review':
                        
                          caseLabelType = 'primary';
                          break;
                        case 'Complete':
                        
                          caseLabelType = 'error';
                          break;
                        
                        case 'Re-Opened':
                    
                          caseLabelType = 'info';
                          break;
                      }


                      return (
                      <TableRow>
                          <Toolbar
                              sx={{
                                pl: { sm: 2 },
                                pr: { xs: 1, sm: 1 },
                                ...(selected.length > 0 && {
                                  color: 'primary.main',
                                  bgcolor: 'primary.lighter'
                                })
                              }}
                            >
                              {selected.length > 0 ? (
                                <Typography
                                  sx={{ flex: '0 1 10%' }}
                                  color="inherit"
                                  variant="subtitle1"
                                  component="div"
                                >
                                  {selected.length } selected
                                </Typography>
                              ) : (
                                ""
                              )}

                              {selected.length  > 0 ? (
                                <Tooltip title="assign">
                                  <Button variant="text"
                                  onClick={()=> setdTrue2(true)} >
                                       Assign User
                                       </Button>
                                </Tooltip>
                              ) : ""
                               
                              }
                            </Toolbar>
                        <TableRow
                        hover
                        key={batchNo}
                        //tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                       />
                        </TableCell>
                    
                        <TableCell align="left">{batchNo}</TableCell>
                        <TableCell align="left">
                          <Label variant="ghost" color={caseLabelType}>
                            {status}
                          </Label>
                        </TableCell>
                        <TableCell align="left">{dateCreated}</TableCell>
                      
                        <TableCell align="right">
                          <Button 
                          value = {row.batchNo}
                           onClick={handleSelect}
                          > {open[batchNo] ? <FontAwesomeIcon icon={faArrowUp} />: <FontAwesomeIcon icon={faArrowDown} />}</Button>
                          </TableCell>
                      </TableRow>


                    <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={open} timeout="auto" hidden={!open} unmountOnExit>
                        
                          {/* <Typography variant="h6" gutterBottom component="div">
                            Batch List
                          </Typography> */}
                          <Table size="small" aria-label="purchases">
                          
                            <UserListHead
                              order={order}
                              orderBy={orderBy}
                              headLabel={Table_head2}
                              rowCount={20}
                              numSelected={selected.length}
                              onRequestSort={handleRequestSort}
                              onSelectAllClick={handleSelectAllClick}
                            />
                              {/* <TableRow>
                              <TableCell align="left">Subject ID</TableCell>
                                <TableCell align='left'>ID</TableCell>
                                <TableCell align='left'>Name</TableCell>
                                <TableCell align='left'>DOB</TableCell>
                                {/* <TableCell align="right">ID Number</TableCell>
                                <TableCell>Inquiry Type</TableCell>
                                <TableCell align="right">Status </TableCell> */}
                               
                              {/* </TableRow> */} 
                           
                            <TableBody>
                              {batchList.map((historyRow) => {
                                const isItemSelected2 = selected.indexOf(historyRow.subjectID) !==-1
                               return(
                                <TableRow key={historyRow.subjectID} sx={{ visibility: open ? 'visible' : 'collapse' }}>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={isItemSelected2}
                                    onChange={(event) => handleClick(event, historyRow.subjectID)}
                                  />
                                 </TableCell>
                                  <TableCell component="th" scope="row">
                                    {historyRow.subjectID}
                                    </TableCell>
                                 <TableCell>{historyRow.idNo}</TableCell>
                                  <TableCell>{historyRow.subject_Name}</TableCell>
                                  <TableCell>{historyRow.dob}</TableCell>
                                  {/* <TableCell align="right">{historyRow.amount}</TableCell>
                                  <TableCell align="right">
                                    {Math.round(historyRow.amount * row.price * 100) / 100}
                                  </TableCell> */}
                                </TableRow>
                                
                               ) })}
                            </TableBody>
                          </Table>
                   
                      </Collapse>
                    </TableCell>
                  </TableRow>
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
}

const UserItem = (props) => {

  const { firstName, lastName, staffNo, userGroup, department, userid } = props.user
  const setSelection = props.setSelection
  const checked = props.checked


  const handleClick = () => {

    setSelection(userid);

  }

  return (
    <Stack id={userid} direction="row"
      onClick={() => handleClick()}
      justifyContent="space-between"
      alignItems="center"

      sx={{
        height: 50, borderBottom: [0.5, 'solid', '#f0f8ff']
      }}
    >
      <Typography

      >{firstName + " " + lastName + " - " + department}</Typography>
      <Checkbox checked={checked} />
    </Stack>

  )
}






