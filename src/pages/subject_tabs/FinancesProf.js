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
import { GET_FIN_ACCOUNT, SET_FIN_ACCOUNT } from 'src/api/Endpoints';
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
import { UPDATE_FIN_ACCOUNT, BASE_URL } from '../../api/Endpoints';
import SearchNotFound from 'src/components/SearchNotFound';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';




const TABLE_HEAD = [
  { id: 'accountName', label: 'Account Name', alignRight: false },
  { id: 'accountType', label: 'Account Type', alignRight: false },
  { id: 'accountNumber', label: 'Account Number', alignRight: false },
  // { id: 'serviceProvider', label: 'Service Provider', alignRight: false },

  { id: 'typeOfAccount', label: 'Type of Account', alignRight: false },
  { id: 'serviceProvider', label: 'Service Provider', alignRight: false },
  { id: 'balances', label: 'Balances', alignRight: false },
  { id: 'totalCredit', label: 'Total Credit', alignRight: false },
  { id: 'totalDebit', label: 'Total Debit', alignRight: false },
  { id: 'dateOfInquiry', label: 'Date of Enquiry', alignRight: false },
  { id: 'attachment', label: 'Attachment', alignRight: false },
  { id: 'remarks', label: 'Remarks', alignRight: false },
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
    return filter(array, (_user) => _user.accountNumber.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}

export default function FinancesProf({ id, updateProfileData }) {

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('accountNumber');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allData, setAllData] = useState([])

  const [filteredUsers, setFilteredUsers] = useState([]);
  const { profile, setFinancialProfile, financialProfile } = useContext(ProfileContext)
  const [profileData, setProfileData] = useState(profile)

  const [otherResidents, setOtherResidents] = useState(financialProfile)

  const [accountData, setAccountData] = useState({})

  const [attachments, setAttachment] = useState(undefined)
  const [enqDate, setValue] = useState(null);
  const { userData } = useContext(UserContext)
  const [userID, setUserID] = useState(userData.userID)



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
  const types = [
    {
      value: 'Select Account Type', label: 'Select Account Type'
    },
    {
      value: 'Bank', label: 'Bank'
    },
    {
      value: 'Sacco', label: 'Sacco'
    },
    {
      value: 'Mobile', label: 'Mobile'
    },
    {
      value: 'Other', label: 'Other'
    }
  ]

  const phoneRegExp = /^((\\+[1-9]{1,4})|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const stringRegExp= /^[aA-zZ\s]+$/
  const numericRegExp= /^[0-9]+$/
  //get financialProfile info
  useEffect(() => {
    getProfileResidents()
  }, [])



  const getProfileResidents = () => {
    if (id) {
      const requestBody = {
        userID: userID,
        subjectID: subjectID
      }
      console.log("What I'm sending", requestBody)

      FetchApi.post(GET_FIN_ACCOUNT, requestBody, (status, data) => {
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
          setFinancialProfile(data)
        } else {
          console.log("some error occured")
        }
      })
    }
  }




  const RegisterSchema = Yup.object().shape({
    serviceProvider: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required Field'),
    accountName: Yup.string().matches(stringRegExp,"Only Characters are allowed").max(50,"Too Long!"),
    accountNumber: Yup.string().matches(numericRegExp,"Only digits are allowed"),
    accountType: Yup.string().matches(stringRegExp,"Only Characters are allowed").max(50,"Too Long!"),
    typeOfAccount: Yup.string().matches(stringRegExp,"Only Characters are allowed").max(50,"Too Long!"),
    balances: Yup.string().matches(numericRegExp,"Only digits are allowed"),
    totalCredit: Yup.string().matches(numericRegExp,"Only digits are allowed"),
    totalDebit: Yup.string().matches(numericRegExp,"Only digits are allowed"),
    dateOfInquiry: Yup.string(),
    remarks: Yup.string()
  });


  const formik = useFormik({
    initialValues: {
      serviceProvider: accountData.serviceProvider || '',
      accountName: accountData.accountName || '',
      accountNumber: accountData.accountNumber || '',
      accountType: accountData.accountType || '',
      typeOfAccount: accountData.typeOfAccount || '',
      balances: accountData.balances || '',
      totalCredit: accountData.totalCredit || '',
      totalDebit: accountData.totalDebit || '',
      dateOfInquiry: accountData.dateOfInquiry || '',
      attachments: accountData.attachments || '',
      remarks: accountData.remarks || '',
      attachments:accountData.attachments||''
    },
    enableReinitialize: true,
    validationSchema: RegisterSchema,
    onSubmit: (values, { resetForm }) => {

      values.dateOfInquiry = enqDate

      values.subjectID = subjectID;
      values.userID = userID;
      values.accID = accountData.acc_ID;

      console.log(values,"VAlues")
      


      //upload any files

      if (attachments) {

        const formData = new FormData();
        formData.append("file", attachments[0])


        FetchApi.upload(formData, (status, data) => {

          if (status) {
            const fileUrl = BASE_URL + "/" + data.url;
            values.attachments = fileUrl

            setSubjectResidence(values)

            setAttachment(undefined)
          } else {
            showErrorAlert("SAVE FAILED")
          }

        })


      } else {

        setSubjectResidence(values)
      }

      resetForm({values:''})

    }
  });


  const setSubjectResidence = (values) => {
    FetchApi.post(accountData.acc_ID? UPDATE_FIN_ACCOUNT : SET_FIN_ACCOUNT, values, (status, data) => {
      if (status) {
        // setProfileData(data)
        
        if (!data.subjectID) {
          showErrorAlert("CREATE USER FIRST")

        } else {
          setSubjectID(data.subjectID)
   

          getProfileResidents()

          setAccountData({})

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
                    title="Financial Details"
                    
                  />
                </Card>
              </Grid>


              <Grid item md={12} >
                <Card sx={{ width: '100%', paddingBottom: 1 }}>
                  <CardHeader
                    title="Add a Financial Details"
                  />
                  <CardContent>
                  <Stack spacing={3}>


<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

  <TextField
    fullWidth
    select
    label="Type"
    {...getFieldProps('accountType')}

  >
    {types.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>


  <TextField
    fullWidth
    label="Bank/Sacco/Telco Name"
    {...getFieldProps('serviceProvider')}
    error={Boolean(touched.serviceProvider && errors.serviceProvider)}
    helperText={touched.serviceProvider && errors.serviceProvider}
  />

  <TextField
    fullWidth
    label="Account Name"
    {...getFieldProps('accountName')}
    error={Boolean(touched.accountName && errors.accountName)}
    helperText={touched.accountName && errors.accountName}
  />


</Stack>

<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

  <TextField
    fullWidth
    label="Account Number"
    {...getFieldProps('accountNumber')}
    error={Boolean(touched.accountNumber && errors.accountNumber)}
    helperText={touched.accountNumber && errors.accountNumber}
  />

  <TextField
    fullWidth
    label="Type of Account"
    {...getFieldProps('typeOfAccount')}
    error={Boolean(touched.typeOfAccount && errors.typeOfAccount)}
    helperText={touched.typeOfAccount && errors.typeOfAccount}
  />

  <TextField
    fullWidth
    label="Balances"
    {...getFieldProps('balances')}
    error={Boolean(touched.balances && errors.balances)}
    helperText={touched.balances && errors.balances}
  />


</Stack>



<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>


  <TextField
    fullWidth
    label="Total Debit"
    {...getFieldProps('totalDebit')}
    error={Boolean(touched.totalDebit && errors.totalDebit)}
    helperText={touched.totalDebit && errors.totalDebit}
  />

  <TextField
    fullWidth
    label="Total Credit"
    {...getFieldProps('totalCredit')}
    error={Boolean(touched.totalCredit && errors.totalCredit)}
    helperText={touched.totalCredit && errors.totalCredit}
  />



  <LocalizationProvider
    dateAdapter={AdapterDateFns}>
    <DatePicker
    disableFuture
      label="Date of Enquiry"
      value={enqDate}
      onChange={(newValue) => {
        setValue(newValue);
      }}
      renderInput={(params) => <TextField fullWidth {...params} />}
    />
  </LocalizationProvider>







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
    attachments ? <Typography>{attachments[0].name}</Typography> : <Typography>{accountData.attachments}</Typography>
  }

  
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
<Button variant="contained"
  // sx={{ background: '#009900' }}
  onClick={handleSubmit}
>Save</Button>
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
                      const { id, accountName, serviceProvider, accountNumber, attachments,
                        accountType, typeOfAccount, balances, totalCredit, totalDebit, dateOfInquiry, remarks } = row;
                      const isItemSelected = selected.indexOf(accountNumber) !== -1;

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
                            <TableCell align="left">{accountName}</TableCell>
                            <TableCell align="left">{serviceProvider}</TableCell>
                            <TableCell align="left">{accountNumber}</TableCell>
                            <TableCell align="left">{accountType}</TableCell>
                            <TableCell align="left">{typeOfAccount}</TableCell>
                            <TableCell align="left">{balances}</TableCell>
                            <TableCell align="left">{totalCredit}</TableCell>
                            <TableCell align="left">{totalDebit}</TableCell>
                            <TableCell align="left">{dateOfInquiry}</TableCell>
                            <TableCell align="left">
                              <a href={attachments} target="_blank" rel="noopener noreferrer">{attachments}</a>
                            </TableCell>
                            <TableCell align="left">{remarks}</TableCell>
                            <TableCell align="right">
                              <Button
                                onClick={() => setAccountData(row)}>
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
