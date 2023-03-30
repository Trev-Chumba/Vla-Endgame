import * as Yup from 'yup';
import { filter } from 'lodash';
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
  TablePagination, Grid,
  CardHeader,
  CardContent,
  TextField,
  CardActions,
} from '@mui/material';
// components
import Page from 'src/components/Page';
import Label from 'src/components/Label';
import Scrollbar from 'src/components/Scrollbar';
import Iconify from 'src/components/Iconify';
import SearchNotFound from 'src/components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from 'src/sections/@dashboard/user';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import React from "react";
import { useState, useContext } from 'react';

//
import USERLIST from 'src/_mocks_/user';
import { FetchApi } from 'src/api/FetchApi';
import { SET_COMPANY, BASE_URL, GET_COMPANY,UPDATE_COMPANY } from 'src/api/Endpoints';

import { ProfileContext } from '../../context/ProfileContext';
import { UserContext } from 'src/context/UserContext';
// import {businessInterests,setBusinessInterests} from 'src/context/ProfileContext';
import { useEffect } from 'react';

// import { FetchApi } from '../api/FetchApi';
// import { GET_ALL_PROFILE } from '../api/Endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { useAlert } from 'react-alert'
import { useFormik, Form, FormikProvider } from 'formik';
import { Link as RouterLink, useNavigate, useRoutes } from 'react-router-dom';




// ----------------------------------------------------------------------
// const { profile } = useContext(ProfileContext)
// const [subjectID, setSubjectID] = useState(profile.subjectID)
const TABLE_HEAD = [

  { id: 'name', label: 'Company Name', alignRight: false },
  { id: 'regNo', label: 'Registration Number', alignRight: false },
  { id: 'registrationDate', label: 'Date of Registration', alignRight: false },
  { id: 'remarks', label: 'Remarks', alignRight: false },
  { id: 'relationship', label: 'Relationship with Subject', alignRight: false },
  { id: 'attachments', label: 'Attachments', alignRight: false },

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
    return filter(array, (_user) => _user.companyName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}

export default function BusinessInterests({ id, updateProfileData }) {

  const alert = useAlert();

  const showAlert = () => {
    alert.success("SAVED SUCCESSFULLY")
  }

  const [attachments, setAttachment] = useState(undefined)
  const { profile, businessInterests, setBusinessInterests } = useContext(ProfileContext)
  const [subjectID, setSubjectID] = useState(profile.subjectID)
  const [companyData, setCompanyData] = useState(businessInterests)

  const { userData } = useContext(UserContext)
  const [userID, setUserID] = useState(userData.userID)

  const showErrorAlert = (message) => {
    alert.error(message)
  }

  const showSuccessAlert = (message) => {
    alert.success(message)
  }
  const phoneRegExp = /^((\\+[1-9]{1,4})|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const stringRegExp= /^[aA-zZ\s]+$/
  const numericRegExp= /^[0-9]+$/





  const RegisterSchema = Yup.object().shape({
    compName: Yup.string().required('Company name required'),
    regNo: Yup.string().max(15,"Too Long!"),
    relationship: Yup.string().max(50, "Too Long!").matches(stringRegExp,"Only Characters allowd"),
    remarks: Yup.string(),
    regDate: Yup.date(),
   
  });

  const formik = useFormik({
    initialValues: {
      compName: companyData.companyName||"",
      regNo: companyData.regNo||"",
      relationship: companyData.relationship||"",
      remarks: companyData.remarks||"",
      regDate: companyData.dateofReg|| "",
      businesspin: companyData.businesspin || "",
      directors: companyData.directors || "",
      attachments:companyData.attachments|| ""
    },
    validationSchema: RegisterSchema,
    enableReinitialize: true,
    onSubmit: (values,{resetForm}) => {
      values.subjectID = subjectID;
      values.userID = userID;
      values.regDate = regDate;
      values.companyID=companyData.companyID;
      console.log(values)

      if(!values.regDate){
        values.regDate=companyData.dateofReg
      }

      if (attachments) {

        const formData = new FormData();
        formData.append("file", attachments[0])

        FetchApi.upload(formData, (status, data) => {

          if (status) {
            const fileUrl = BASE_URL + "/" + data.url;
            values.attachments = fileUrl

            setProfileCompanies(values)

            setAttachment(undefined)
          } else {
            showErrorAlert("SAVE FAILED")
          }

        })


      } else {

        setProfileCompanies(values)
      }

      resetForm({values:''})
      // Handle submission

    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('compName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allData, setAllData] = useState([])
  const navigate = useNavigate()

  const [regDate, setValue] = useState(null);

  // const [allData, setAllData] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.compName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, compName) => {
    const selectedIndex = selected.indexOf(compName);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, compName);
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
    const employment = applySortFilter(allData, getComparator(order, orderBy), filterName);
    setFilteredUsers(employment)
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const isUserNotFound = filteredUsers.length === 0;


  //API

  // const setProfileCompanies = (values) => {

  //   FetchApi.post(SET_COMPANY, values, (status, data) => {

  //     console.log("SET COMPANY RES:::", data)

  //     if (status) {

  //       getCompanyData()
  //       setBusinessInterests({})

  //       // setAssets({})

  //       showSuccessAlert("SAVE SUCCESFUL")
  //     }
  //     else {
  //       showErrorAlert("SAVE FAILED")
  //     }

  //   })

  // }
  // 
  const setProfileCompanies = (values) => {

    FetchApi.post(companyData.companyID?UPDATE_COMPANY:SET_COMPANY, values, (status, data) => {

      console.log("SET Assets RES:::", data)

      if (status) {
        getCompanyData()

        setBusinessInterests({})

        updateProfileData()
        // setAssets({})

        showSuccessAlert("SAVED SUCCESSFULLY")
      }
      else {
        showErrorAlert("SAVE FAILED")
      }

    })

  }
  useEffect(() => {

    getCompanyData()

  }, [])



  const getCompanyData = () => {
    if (id) {
      console.log(id)
      const requestBody = {

        subjectID: subjectID,
        userID: userID,
      }
      console.log("What I'm sending", requestBody)

      FetchApi.post(GET_COMPANY, requestBody, (status, data) => {

        if (status) {

          console.log("API DATA", data)
          const assets = applySortFilter(data, getComparator(order, orderBy), filterName);
          console.log("INFO:::", assets)
          // const users = applySortFilter(data, getComparator(order, orderBy), filterName);
          setFilteredUsers(assets)


          setAllData(assets)
          // setOtherResidents(residence)
          // console.log("RESIDENCE", residence)

          //ALSO UPDATE THE PROFILE CONTEXT
          updateProfileData()

        } else {
          console.log("some error occured")
        }
      })
    }
  }


  return (
    <Page>


      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ width: '100%' }}>

            <Grid item md={12}>
              <Card sx={{ width: '100%', paddingBottom: 3 }}>
                <CardHeader
                  title="Business Interests"

                />
              </Card>
            </Grid>
            <Grid item md={12} >
              <Card sx={{ width: '100%', paddingBottom: 1 }}>
                {/* <CardHeader
                                title="Spouse"
                            /> */}
                <CardContent>
                  <Stack spacing={3}>


                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>


                      <TextField
                        fullWidth
                        label="Name"
                        {...getFieldProps('compName')}
                        error={Boolean(touched.compName && errors.compName)}
                        helperText={touched.compName && errors.compName}
                      />

                      <TextField
                        fullWidth
                        label="Registration Number"
                        {...getFieldProps('regNo')}
                        error={Boolean(touched.regNo && errors.regNo)}
                        helperText={touched.regNo && errors.regNo}
                      />




                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>




                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}>
                        <DatePicker
                        disableFuture
                          label="Date of Registration"
                          value={regDate}

                          onChange={(newValue) => {
                            setValue(newValue);
                          }

                          }
                          renderInput={(params) => <TextField fullWidth {...params} />}
                        />
                      </LocalizationProvider>
                      <TextField
                        fullWidth
                        label="Relationship with subject"
                        {...getFieldProps('relationship')}
                        error={Boolean(touched.relationship && errors.relationship)}
                        helperText={touched.relationship && errors.relationship}
                      />
                      {/* <Button
                        fullWidth
                        component="label"
                        variant='outlined'
                      >
                        Add Attachment
                        <input
                          type="file"
                          hidden
                          onChange={(event) => setAttachment(event.target.files)} />

                      </Button> */}



                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                        fullWidth
                        label="Directors Names"
                        {...getFieldProps('directors')}
                        error={Boolean(touched.directors && errors.directors)}
                        helperText={touched.directors && errors.directors}
                      />

                      <TextField
                        fullWidth
                        label="KRA Pin"
                        {...getFieldProps('businesspin')}
                        error={Boolean(touched.businesspin && errors.businesspin)}
                        helperText={touched.businesspin && errors.businesspin}
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
                          attachments ? <Typography>{attachments[0].name}</Typography> : <Typography>{companyData.attachments}</Typography>
                        }

                        
                        </Stack>





                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>




                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>


                      <TextField
                        fullWidth
                        label="Remarks"
                        multiline
                        rows={3}
                        {...getFieldProps('remarks')}

                      />

                    </Stack>

                  </Stack>

                  <CardActions sx={{ marginTop: 2 }}>
                    {/* <Button 
                                    variant="contained" sx={{ background: '#009900' }}
                                    
                                     >Save</Button> */}
                    <Button
                      variant='contained'
                      sx={{ marginTop: 2 }}
                      onClick={() => handleSubmit()}
                    >Save</Button>

                  </CardActions>

                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Form>
      </FormikProvider>
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
                    const { companyName, regNo, dateofReg, relationship,
                      remarks, attachments,companyID } = row;
                    const isItemSelected = selected.indexOf(companyName) !== -1;

                    return (
                      <TableRow
                        // hover
                        // key={companyID}
                        // tabIndex={-1}
                        // role="checkbox"
                        // selected={isItemSelected}
                        // aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            // onChange={(event) => handleClick(event, companyName)}
                          />
                        </TableCell>
                        {/* <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={subject_Name} src={profile_pic} />
                              <Typography variant="subtitle2" noWrap>
                                {subject_Name}
                              </Typography>
                            </Stack>
                          </TableCell> */}
                        <TableCell align="left">{companyName}</TableCell>
                        <TableCell align="left">{regNo}</TableCell>

                        <TableCell align="left">{dateofReg}</TableCell>

                        <TableCell align="left">{remarks}</TableCell>
                        <TableCell align="left">{relationship}</TableCell>

                        <TableCell align="left">
                          <a href={attachments} target="_blank" rel="noopener noreferrer">{attachments}</a>
                        </TableCell>
                        <TableCell align="right">
                              <Button
                                onClick={() => setCompanyData(row)}>
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

    </Page>

  )

}