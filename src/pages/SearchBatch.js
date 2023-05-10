import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect, useRef, useContext } from 'react';
import { Link as RouterLink, useRoutes } from 'react-router-dom';
import Papa from 'papaparse';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import { useAlert } from 'react-alert';
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
import {GET_ALL_USERS, SEARCH_BATCH, MY_BATCH, ASSIGN_BATCH} from '../api/Endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyedropper, faInfo } from '@fortawesome/free-solid-svg-icons';

import { UserContext } from 'src/context/UserContext';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import Dialog from '@mui/material/Dialog';
import { Document } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
var Loader = require('react-loader');
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'bID', label: 'Batch ID', alignRight: false },
  { id: 'Status', label: 'Status', alignRight: false },
  { id: 'date', label: 'Date Created', alignRight: false },


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
  const [allData,setAllData]=useState([]);
  const { userData } = useContext(UserContext);
  const [buttCount, setButtCount] = useState(0)
  // const [allData, setAllData] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [fileName, setFileName] = useState(undefined)
  const [caseList, setCaseList] = useState([]);
  const [showButton, setshowButton] = useState(false)
  const [batchNo, setBatchNo] = useState('')
  const [isTrue, setIstrue] = useState(false)
  const [isNotLoading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState("")
  const [dTrue, setdTrue] = useState(false)
  const radioGroupRef = useRef(null);
  const [users, setUsers] = useState([])

  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0)
  const [exportData, setExportData] = useState({})


   const alert = useAlert();
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

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }

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
      mappedList = results.data.map(element => ({
        id: element.Id,
        type: element.Subject_Type,
        reason: element.Reason
      }));
      
      console.log('List is mapped ::', mappedList);
      setCaseList(mappedList)
      console.log('List is mapped2 ::', caseList);
     }

    })
   
  };
  const assignSelectedUser = () => {

    setdTrue(false)

    const postBody = {
      batchNo:batchNo,
      userID: userData.userID,
      assignee: selectedUser
    }

    console.log("BODY", postBody)

    tranferCase(postBody)

  }

  const tranferCase = (postBody) =>
  {
    console.log(postBody)
    FetchApi.post(ASSIGN_BATCH, postBody, (status, data) => {
      console.log(data, postBody, status)
      if(status && data.massage == "transfered successfully")
      {
        showSuccessAlert("Case Assigned Successfully")
        postBody.inquryID = postBody.inquiryID
        setCaseData(postBody)
        changeLabel(postBody.status)
      } 
      else
      {
        showErrorAlert("Failed")
      }
    })
  }
  
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

  useEffect(()=>{

    const requestBody = {
        userID:userData.userID,
        batchNo: batchNo
    }

    FetchApi.post(BATCH_LIST, requestBody, (status, data) => {
      if(status){
        console.log("Request for list", requestBody)
        console.log("INQUIRIES::::",data)
       // const inquiry = applySortFilter(data, getComparator(order, orderBy), filterName);
        setExportData(data)
        //setAllData(data)
        
      }else{
        //some error
      }
    })

  }, [count]) 


  const searchBatch =()=>{
    setLoading(false)


    const requestBody = {
        subjectID:"",
        idNo: ""
    }

    const BatchInfo = {
      batchNo: batchNo,
      userID: userData.userID,
      data: caseList
    };
    
    FetchApi.post(SEARCH_BATCH, BatchInfo, (status, data) => {
      console.log("sending", BatchInfo)
      if(status){
        console.log('Nonsensical Info', status, data)

        showSuccessAlert('Uploaded succesfully');

        setButtCount(buttCount+1)
      }else{
        //some error
        setButtCount(buttCount+1)
        console.log("::::Response", data, status)
        showErrorAlert('Sorry could not upload')
        
      }
      setLoading(true)
    })
    
  };

  useEffect(()=>{
  
    const requestBody = {
        userID:userData.userID,
      
    }

    

    FetchApi.post(MY_BATCH, requestBody, (status, data) => {
      if(status){
        
        console.log(data)
       // const batches = applySortFilter(data, getComparator(order, orderBy), filterName);
        setFilteredUsers(data)
        console.log("Filtered", data)
        setAllData(data)
        
      }else{
        //some error
      }
    })
  }, [buttCount]) ;



  const hiddenfileInput = useRef(null);
  const handleFile  = event => {
    hiddenfileInput.current.click();
  };
  const checkSubmit = () =>
  {
    setButtCount(buttCount+1)
    if(caseList && batchNo)
    {  //console.log('List is mapped2 ::', BatchInfo);
      setIstrue(true) 
    }
    else{
      showErrorAlert('Please make an attachment and provide a ref no as batch number')
    }
  }
  let mappedList = []
  const isUserNotFound = filteredUsers.length === 0;
  
  
  const openDiag = (e) =>
  {
    
     setdTrue(true)
     setBatchNo(e.target.value)
  }
  
  const handleSelect = (event) =>
  {
     
      console.log(".......", batchNo)
      setCount(count + 1)
      setOpen(!open)
      setBatchNo(event.target.value)
  }

  return (
    <Page title="KRA VLA | Search Batch">
      <Container>
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

        <Dialog
          sx={{ '& .MuiDialog-paper': { width: '80%', height: '100%' } }}
          maxWidth="xl"
          open={open}>

          <DialogContent>

            <PDFViewer width='100%' height='100%'>
              <Document>

                <BcAndVtExPort data={exportData} caseData={exportData} />

              </Document>
            </PDFViewer>

          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogActions>

        </Dialog>


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
          {/* {batchNo && caseList.length>0 && 
          <Button variant="contained"
          sx={{ background: '#303F9F' }}
          // onClick={() => setOpen(true)}
        >Assign User</Button>} */}
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
                      {caseList.length>0 && batchNo && isNotLoading && <Button
                          variant="contained"
                          sx={{ marginRight: 2, background: '#00B23A' }}
                         onClick={()=>{searchBatch();}}
                        >
                          Upload batch
                        </Button>}
                    </Stack>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead2
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
                      const { batchNo, status, dateCreated,} = row;
                      const isItemSelected = selected.indexOf(batchNo) !== -1;

                      let caseStatus = 'Open';
                      let caseLabelType = 'success';

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
                        <TableRow
                          hover
                          key={batchNo}
                          tabIndex={-1}
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
                          <Button variant="text"
                          value = {row.batchNo}
                           onClick={openDiag}
                          >Assign User</Button>
                          </TableCell>
                          <TableCell>
                          <Button 
                          value = {row.batchNo}
                           onClick={handleSelect}
                          > 
                          <FontAwesomeIcon icon={faEyedropper} />
                          </Button>
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
      <Loader loaded={isNotLoading} />
    </Page>
  );




                };


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

