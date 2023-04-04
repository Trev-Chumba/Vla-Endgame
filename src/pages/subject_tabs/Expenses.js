import { filter } from 'lodash';
import * as Yup from 'yup';
import Papa from 'papaparse';
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
  Grid,
  CardHeader,
  CardContent,
  TextField,
  CardActions
} from '@mui/material';
import Page from 'src/components/Page';
import Label from 'src/components/Label';
import Scrollbar from 'src/components/Scrollbar';
import Iconify from 'src/components/Iconify';
import SearchNotFound from 'src/components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from 'src/sections/@dashboard/user';
import { BASE_URL, GET_TRAVEL, SET_TRAVEL, UPDATE_TRAVEL } from 'src/api/Endpoints';
//
import USERLIST from 'src/_mocks_/user';
import { FetchApi } from 'src/api/FetchApi';
import { GET_ALL_USERS } from 'src/api/Endpoints';
// import { FetchApi } from '../api/FetchApi';
// import { GET_ALL_PROFILE } from '../api/Endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from 'src/context/UserContext';
import { useAlert } from 'react-alert';
import React, { useState, useContext, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { Link as RouterLink, useNavigate, useRoutes } from 'react-router-dom';
import { ProfileContext } from 'src/context/ProfileContext';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import ReactHtmlParser from 'react-html-parser';

const TABLE_HEAD = [
  { id: 'description', label: 'Description of Expense', alignRight: false },
  { id: 'estValue', label: 'Amount Expensed', alignRight: false },
  { id: 'start_date', label: 'Start Date', alignRight: false },
  { id: 'end_date', label: 'End Date', alignRight: false },

  { id: 'remarks', label: 'Remarks', alignRight: false },
  { id: 'attachment', label: 'Attachment', alignRight: false },

  // { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
];
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
    return filter(
      array,
      (_user) => _user.description.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return stabilizedThis.map((el) => el[0]);
}

export default function Expenses({ id, updateProfileData }) {
  const [showPassword, setShowPassword] = useState(false);
  const [attachments, setAttachment] = useState(undefined);
  const [travelsData, setTravelsData] = useState({});
  const alert = useAlert();

  const showAlert = () => {
    alert.success('SAVED SUCCESSFULLY');
  };
  const showErrorAlert = (message) => {
    alert.error(message);
  };
  const showSuccessAlert = (message) => {
    alert.success(message);
  };

  const { profile, setTravels, travels } = useContext(ProfileContext);
  const { userData } = useContext(UserContext);

  const [userID] = useState(userData.userID);
  const [dateOfExpense, setDateOfExpense] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [values, setValues] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [remark, setremark] = useState('');

  const [subjectID, setSubjectID] = useState(profile.subjectID);
  const [start_date, setStartDate] = useState(null);
  const [end_date, setEndDate] = useState(null);
  const [expenseData, setExpenseData] = useState({});

  const handleStartDate = (value) => {
    setStartDate(value);
    setEndDate(value);
  };

  const handleEndDate = (value) => {
    setEndDate(value);
  };
  const phoneRegExp =
    /^((\\+[1-9]{1,4})|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const stringRegExp = /^[aA-zZ\s]+$/;
  const numericRegExp = /^[0-9]+$/;

  const handlesun = (content) => {
    console.log(content, 'sun log content');
    setremark(content);
  };

  const RegisterSchema = Yup.object().shape({
    // description: Yup.string().max(50, 'Too Long!').required('description required'),
    // estValue: Yup.number(),
    // dateOfExpense: Yup.string(),
    // remarks: Yup.string(),

    description: Yup.string().max(50, 'Too Long!').required('description required'),
    estValue: Yup.string().matches(numericRegExp, 'Only digits allowed!'),
    //remarks: Yup.string(),
    // dateOfExpense: Yup.string()
    start_date: Yup.date(),
    end_date: Yup.date()
  });

  const formik = useFormik({
    initialValues: {
      description: expenseData.description || '',
      estValue: expenseData.estValue || '',
      dateOfExpense: expenseData.dateOfExpense || '',
      remarks: expenseData.remarks || '',
      start_date: expenseData.start_date || '',
      end_date: expenseData.end_date || ''
    },
    validationSchema: RegisterSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      values.subjectID = subjectID;
      values.userID = userID;
      // values.dateOfExpense=dateOfExpense;
      values.start_date = start_date;
      values.end_date = end_date;
      values.validity = '';
      values.travelID = expenseData.travelID;
      values.remarks = remark;
      if (!values.start_date) {
        values.start_date = expenseData.start_date;
      }
      if (!values.end_date) {
        values.end_date = expenseData.end_date;
      }
      console.log(values);

      if (attachments) {
        const formData = new FormData();
        formData.append('file', attachments[0]);

        FetchApi.upload(formData, (status, data) => {
          if (status) {
            const fileUrl = BASE_URL + '/' + data.url;
            values.attachments = fileUrl;

            setProfileTravel(values);

            setAttachment(undefined);
          } else {
            showErrorAlert('SAVE FAILED');
          }
        });
      } else {
        setProfileTravel(values);
      }

      resetForm({ values: '' });
    }
  });

  const setProfileTravel = (values) => {
    FetchApi.post(expenseData.travelID ? UPDATE_TRAVEL : SET_TRAVEL, values, (status, data) => {
      console.log('SET Assets RES:::', data);

      if (status) {
        getTravelData();
        // setAssets({})

        updateProfileData();

        showSuccessAlert('SAVED SUCCESSFULLY');
      } else {
        showErrorAlert('SAVE FAILED');
      }
    });
  };
  useEffect(() => {
    getTravelData();
  }, []);

  const getTravelData = () => {
    if (id) {
      console.log(id);
      const requestBody = {
        userID: userID,

        subjectID: subjectID
      };
      console.log("What I'm sending", requestBody);

      FetchApi.post(GET_TRAVEL, requestBody, (status, data) => {
        if (status) {
          console.log('API DATA', data);
          const assets = applySortFilter(data, getComparator(order, orderBy), filterName);
          console.log('INFO:::', assets);
          // const users = applySortFilter(data, getComparator(order, orderBy), filterName);
          setFilteredUsers(assets);

          setAllData(assets);
          // setOtherResidents(residence)
          // console.log("RESIDENCE", residence)

          //ALSO UPDATE THE PROFILE CONTEXT
        } else {
          console.log('some error occured');
        }
      });
    }
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('description');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allData, setAllData] = useState([]);

  const navigate = useNavigate();

  // const [allData, setAllData] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.description);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, description) => {
    const selectedIndex = selected.indexOf(description);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, description);
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

  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results.data);
      }
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    const users = applySortFilter(allData, getComparator(order, orderBy), filterName);
    setFilteredUsers(users);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;
  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ width: '100%' }}>
            <Grid item md={12}>
              <Card sx={{ width: '100%', paddingBottom: 3 }}>
                <CardContent>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Description"
                        {...getFieldProps('description')}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && errors.description}
                      />

                      <TextField
                        fullWidth
                        label="Amount"
                        {...getFieldProps('estValue')}
                        error={Boolean(touched.estValue && errors.estValue)}
                        helperText={touched.estValue && errors.estValue}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}></Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                          disableFuture
                          name="startDate"
                          value={start_date}
                          onChange={(newValue) => {
                            handleStartDate(newValue);
                          }}
                          label="Start Date"
                          inputFormat="MM/dd/yyyy"
                          renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                        />
                      </LocalizationProvider>

                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                          disableFuture
                          label="End Date"
                          inputFormat="MM/dd/yyyy"
                          value={end_date}
                          fullWidth
                          minDate={end_date}
                          onChange={(newValue) => {
                            handleEndDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                        />
                      </LocalizationProvider>
                      {/* 
                    <LocalizationProvider
                        dateAdapter={AdapterDateFns}>
                        <DatePicker
                          disableFuture
                          label="Date of Expense"
                          value={dateOfExpense}


                          onChange={(newValue) => {
                            setDateOfExpense(newValue);
                          }


                          }
                          renderInput={(params) => <TextField fullWidth {...params} />}
                        />
                      </LocalizationProvider> */}
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Button fullWidth component="label" variant="outlined">
                        Add Attachment
                        <input
                          type="file"
                          hidden
                          onChange={(event) => setAttachment(event.target.files)}
                        />
                      </Button>

                      {attachments ? (
                        <Typography>{attachments[0].name}</Typography>
                      ) : (
                        <Typography>{expenseData.attachments}</Typography>
                      )}
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}></Stack>
                  </Stack>

                  <Stack>
                    <p>Remarks</p>
                    <SunEditor
                      setOptions={{
                        buttonList: [
                          ['font', 'fontSize', 'formatBlock'],
                          ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                          ['align', 'horizontalRule', 'list', 'table'],
                          ['fontColor', 'hiliteColor'],
                          ['outdent', 'indent'],
                          ['undo', 'redo'],
                          ['removeFormat'],
                          ['outdent', 'indent'],
                          ['link']
                        ]
                      }}
                      onChange={handlesun}
                      placeholder="Remarks"
                    />
                  </Stack>

                  <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => handleSubmit()}>
                    Save
                  </Button>
                </CardContent>

                {/* <CardContent>
                                <Stack spacing={3}>

                                

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        

                                            
                                    </Stack>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            label="Attachments"
                                            {...getFieldProps('description')}
                                            error={Boolean(touched.description && errors.description)}
                                            helperText={touched.description && errors.description}
                                        />


                                    </Stack>

                                </Stack>

                            </CardContent> */}
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
                    const {
                      description,
                      estValue,
                      start_date,
                      end_date,
                      attachments,
                      remarks,
                      travelID
                    } = row;
                    const isItemSelected = selected.indexOf(description) !== -1;

                    return (
                      <TableRow
                      // hover
                      // key={travelID}
                      // tabIndex={-1}
                      // role="checkbox"
                      // selected={isItemSelected}
                      // aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            // onChange={(event) => handleClick(event, travelID)}
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
                        <TableCell align="left">{description}</TableCell>
                        <TableCell align="left">{estValue}</TableCell>
                        <TableCell align="left">{start_date}</TableCell>
                        <TableCell align="left">{end_date}</TableCell>

                        <TableCell align="left">{ReactHtmlParser(remarks)}</TableCell>
                        <TableCell align="left">
                          <a href={attachments} target="_blank" rel="noopener noreferrer">
                            {attachments}
                          </a>
                        </TableCell>
                        <TableCell align="right">
                          <Button onClick={() => setExpenseData(row)}>
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
  );
}
