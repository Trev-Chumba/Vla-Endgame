import * as Yup from 'yup';
import { filter } from 'lodash';
import {
  CardHeader, Grid, CardContent, TextField, CardActions,
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  TablePagination,
  TextareaAutosize,
  MenuItem,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { useFormik, Form, FormikProvider } from 'formik';
import { useAlert } from 'react-alert'
import { GET_SECONDARY_INFORMATION, SET_SECONDARY_INFORMATION } from 'src/api/Endpoints';
import { FetchApi } from '../../api/FetchApi';
import { useContext } from 'react';
import { ProfileContext } from '../../context/ProfileContext';
import { UserContext } from 'src/context/UserContext';
import { useEffect } from 'react';
import { UserListHead, UserListToolbar } from 'src/sections/@dashboard/user';
import Scrollbar from 'src/components/Scrollbar';
import USERLIST from 'src/_mocks_/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { UPDATE_SECONDARY_INFORMATION, BASE_URL } from '../../api/Endpoints';
import SearchNotFound from 'src/components/SearchNotFound';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';




const TABLE_HEAD = [
  { id: 'type', label: 'Person Type', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'id_no', label: 'ID No.', alignRight: false },
  { id: 'employment', label: 'Employment', alignRight: false },
  { id: 'kra_pin', label: 'Kra Pin', alignRight: false },
  { id: 'dob', label: 'Date of Birth', alignRight: false },
  { id: 'attachmnents', label: 'Attachments', alignRight: false },
  { id: 'other', label: 'Remarks', alignRight: false },

  // { id: 'status', label: 'Status', alignRight: false },
  
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}

export default function ResidentialProfile({ id, updateProfileData }) {

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allData, setAllData] = useState([])

  const [filteredUsers, setFilteredUsers] = useState([]);
  const { profile, setSecondaryInformation, secondaryInformation } = useContext(ProfileContext)
  const [profileData, setProfileData] = useState(profile)

  const [otherResidents, setOtherResidents] = useState(secondaryInformation)

  const [secondaryData, setSecondaryData] = useState({})

  const [attachments, setAttachment] = useState(undefined)
  const [dob, setValue] = useState(null);
  const { userData } = useContext(UserContext);
  const [userID, setUserID] = useState(userData.userID);


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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

  const alert = useAlert();

  const [subjectID, setSubjectID] = useState(profile.subjectID)
  const showErrorAlert = (message) => {
    alert.error(message)
  }

  const showSuccessAlert = (message) => {
    alert.success(message)
  }

  const addResidents = () => {
    setOtherResidents([{}])
  }

  const removeResidentAt = () => {
    otherResidents.pop()
    setOtherResidents(otherResidents)
  }

  const showAlert = () => {
    alert.success("SAVED SUCCESSFULLY")
  }
  const personType = [
    {
      value: 'Select Person Type', label: 'Select Person Type'
    },
    {
      value: 'Spouse', label: 'Spouse'
    },
    {
      value: 'Children', label: 'Children'
    },
    {
      value: 'Father', label: 'Father'
    },
    {
      value: 'Mother', label: 'Mother'
    },
    {
      value: 'Siblings', label: 'Siblings'
    },
    {
      value: 'Beneficiaries', label: 'Beneficiaries'
    },
  ]
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const stringRegExp= /^[aA-zZ\s]+$/
  const numericRegExp= /^[0-9]+$/
  //get secondaryInformation info
  useEffect(() => {
    getSecondaryInfomation()
  }, [])



  const getSecondaryInfomation = () => {
    if (id) {
      const requestBody = {
        userID: userID,
        subjectID: subjectID
      }
      console.log("What I'm sending", requestBody)

      FetchApi.post(GET_SECONDARY_INFORMATION, requestBody, (status, data) => {
        if (status) {
          // setName(data.subject_Name)
          console.log("API DATA", data)

          const residence = applySortFilter(data, getComparator(order, orderBy), filterName);
          // const users = applySortFilter(data, getComparator(order, orderBy), filterName);
          setFilteredUsers(residence)

          setAllData(residence)
          setOtherResidents(residence)
          console.log("RESIDENCE", residence)

          //ALSO UPDATE THE PROFILE CONTEXT
          setSecondaryInformation(data)
        } else {
          console.log("some error occured")
        }
      })
    }
  }




  const RegisterSchema = Yup.object().shape({
    type: Yup.string(),
    name: Yup.string().max(50, 'Too Long!').required('name required'),
    dob: Yup.date(),
    idNo: Yup.string().matches(numericRegExp,"Only digits allowed"),
    kraPin: Yup.string().max(15,"Too long"),
    address: Yup.string().max(50, 'Too Long!'),
    employment: Yup.string().max(50, 'Too Long!'),
    other: Yup.string(),
  });


  const formik = useFormik({
    initialValues: {
      type: secondaryData.type || "Select Person Type",
      name: secondaryData.name || "",
      idNo: secondaryData.id_no || "",
      dob: secondaryData.dob || "",
      kraPin: secondaryData.kra_pin || "",
      employment: secondaryData.employment || "",
      address: secondaryData.address || "",
      other: secondaryData.other || "",
      attachments:secondaryData.attachments||""
    },
    enableReinitialize: true,
    validationSchema: RegisterSchema,
    onSubmit: (values, { resetForm }) => {
      console.log(values,"Values")

      values.subjectID = subjectID
      values.userID=userID
      values.dob=dob
      // values.userID = "4"
      // values.resInfoID = secondaryData.res_INFO_ID;
      values.secInfoId = secondaryData.sec_INFO_ID;


      //upload any files

      if (attachments) {

        const formData = new FormData();
        formData.append("file", attachments[0])


        FetchApi.upload(formData, (status, data) => {

          if (status) {
            const fileUrl = BASE_URL + "/" + data.url;
            values.attachments = fileUrl

            setSecondaryInfo(values)

            setAttachment(undefined)
          } else {
            showErrorAlert("SAVE FAILED")
          }

        })


      } else {

        setSecondaryInfo(values)
      }

      resetForm({values:''})

    }
  });


  const setSecondaryInfo = (values) => {
    FetchApi.post(secondaryData.sec_INFO_ID? UPDATE_SECONDARY_INFORMATION : SET_SECONDARY_INFORMATION, values, (status, data) => {
      if (status) {
        // setProfileData(data)
        
        if (!data.subjectID) {
          showErrorAlert("CREATE USER FIRST")

        } else {
          setSubjectID(data.subjectID)
   

          getSecondaryInfomation()

          setSecondaryData({})

          showSuccessAlert("SAVED SUCCESSFULLY")

          updateProfileData()
        }



      } else {
        showErrorAlert("SAVE FAILED")
      }
    })
  }

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Container>
      <Container>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ width: '100%' }}>

              <Grid item md={12}>
                <Card sx={{ width: '100%', paddingBottom: 3 }}>
                  <CardHeader
                    title="Secondary Details"
                    
                  />
                </Card>
              </Grid>


              <Grid item md={12} >
                <Card sx={{ width: '100%', paddingBottom: 1 }}>
                  <CardHeader
                    title="Add Secondary Details"
                  />
                  <CardContent>
                  <Stack spacing={3}>


                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                          <TextField
                            fullWidth
                            select
                            label="Person Type"
                            {...getFieldProps('type')}

                          >
                            {personType.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>



                          <TextField
                            fullWidth
                            label="Name"
                            {...getFieldProps('name')}
                            error={Boolean(touched.name && errors.name)}
                            helperText={touched.name && errors.name}
                          />






                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>


                          <TextField
                            fullWidth
                            label="ID No."
                            {...getFieldProps('idNo')}
                            error={Boolean(touched.idNo && errors.idNo)}
                            helperText={touched.idNo && errors.idNo}
                          />
                          <LocalizationProvider

                            dateAdapter={AdapterDateFns}>
                            <DatePicker
                            disableFuture
                              label="Date of Birth"
                              value={dob}
                              onChange={(newValue) => {
                                setValue(newValue);
                              }}
                              renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                          </LocalizationProvider>



                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>



                          <TextField
                            fullWidth
                            label="KRA PIN"
                            {...getFieldProps('kraPin')}
                            error={Boolean(touched.kraPin && errors.kraPin)}
                            helperText={touched.kraPin && errors.kraPin}
                          />
                          <TextField
                            fullWidth
                            label="Address"
                            {...getFieldProps('address')}
                            error={Boolean(touched.address && errors.address)}
                            helperText={touched.address && errors.address}
                          />


                        </Stack>



                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                          <TextField
                            fullWidth
                            label="Employment"
                            {...getFieldProps('employment')}
                            error={Boolean(touched.employment && errors.employment)}
                            helperText={touched.employment && errors.employment}
                          />

                       
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                          fullWidth
                          component="label"
                          variant='outlined'
                        >
                          Add Attachment
                          <input
                            type="file"
                            hidden
                            onChange={(event) => setAttachment(event.target.files)} />

                        </Button>

                        {
                          attachments ? <Typography>{attachments[0].name}</Typography> : <Typography>No attachment added</Typography>
                        }

                        
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>



                          {/* <TextField
                            fullWidth
                            label="Other"
                            {...getFieldProps('other')}

                          /> */}
                           <TextField
                                                fullWidth
                                                label="Remarks"
                                                multiline
                                                rows={3}
                                                {...getFieldProps('other')}

                                            />
                        </Stack>

                      </Stack>

                      <CardActions sx={{ marginTop: 2 }}>

                        <Button
                          onClick={handleSubmit} 
                          // sx={{ background: '#009900' }}
                          variant="contained" >Save</Button>
                      </CardActions>


                  </CardContent>
                </Card>
              </Grid>


            </Grid>
          </Form>
        </FormikProvider>
      </Container>
      <Container>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>

          </Stack>
          <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

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
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { subject_ID, attachments, type, name, employment,
                        kra_pin, dob, id_no, other } = row;
                      const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow
                          // hover
                          // key={res_INFO_ID}
                          // tabIndex={-1}
                          // role="checkbox"
                          // selected={isItemSelected}
                          // aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                // onChange={(event) => handleClick(event, res_INFO_ID)}
                              />
                            </TableCell>

                            <TableCell align="left">{type}</TableCell>
                            <TableCell align="left">{name}</TableCell>
                            <TableCell align="left">{id_no}</TableCell>
                            <TableCell align="left">{employment}</TableCell>
                            <TableCell align="left">{kra_pin}</TableCell>
                            <TableCell align="left">{dob}</TableCell>
                            <TableCell align="left">
                              <a href={attachments} target="_blank" rel="noopener noreferrer">{attachments}</a>
                            </TableCell>


                            <TableCell align="left">{other}</TableCell>

                            <TableCell align="right">
                              <Button
                                onClick={() => setSecondaryData(row)}
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </Button>


                            </TableCell>



                          {/* <TableCell align="right">
                          <RouterLink to={"/dashboard/profile/"+idNo}>
                            <FontAwesomeIcon icon={faEye}/>
                          </RouterLink>


                          </TableCell> */}
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
      </Container>
    </Container>
  )

}
