import { filter } from 'lodash';
import * as Yup from 'yup';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faEye } from '@fortawesome/free-solid-svg-icons';
import {
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
  Grid,
  CardHeader,
  CardContent,
  TextField,
  CardActions,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useAlert } from 'react-alert';
import Page from 'src/components/Page';
import Scrollbar from 'src/components/Scrollbar';
import { UserListHead, UserListToolbar } from 'src/sections/@dashboard/user';

import USERLIST from 'src/_mocks_/user';
import {
  SET_EMPLOYMENT_PROFILE,
  GET_EMPLOYMENT_PROFILE,
  UPDATE_EMPLOYMENT_PROFILE,
  BASE_URL
} from 'src/api/Endpoints';
import { ProfileContext } from 'src/context/ProfileContext';
import { UserContext } from 'src/context/UserContext';
import { useContext } from 'react';
import { FetchApi } from 'src/api/FetchApi';
import { useEffect } from 'react';

const TABLE_HEAD = [
  { id: 'employer', label: 'Employer', alignRight: false },
  { id: 'employer_location', label: 'Employer Location', alignRight: false },
  { id: 'employer_contact', label: 'Employer Contact', alignRight: false },
  { id: 'role_played', label: 'Role Played', alignRight: false },
  { id: 'start_date', label: 'Start Date', alignRight: false },
  { id: 'end_date', label: 'End Date', alignRight: false },
  //{ id: 'remarks', label: 'Remarks', alignRight: false },
  { id: 'attachmnents', label: 'Attachments', alignRight: false },
  //{ id: 'gross_salary', label: 'Gross Salary', alignRight: false },
  // { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
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
    return filter(
      array,
      (_user) => _user.employer.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Employment({ id, updateProfileData }) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allData, setAllData] = useState([]);
  const { userData } = useContext(UserContext);
  const [userID, setUserID] = useState(userData.userID);

  // const [allData, setAllData] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([]);

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
    const employment = applySortFilter(allData, getComparator(order, orderBy), filterName);
    setFilteredUsers(employment);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const alert = useAlert();

  const [otherResidents, setOtherResidents] = useState([]);

  const { profile, setEmployment, employment } = useContext(ProfileContext);

  // console.log("PROFILE DATA EMPLOY:::", profile)

  const [employmentData, setEmploymentData] = useState(employment);
  // const [start_date, setValue] = useState(null);
  // const [end_date, setEndDate] = useState(null);

  const [attachments, setAttachment] = useState(undefined);

  const [subjectId, setSubjectID] = useState(profile.subjectID);
  const showErrorAlert = (message) => {
    alert.error(message);
  };

  const showSuccessAlert = (message) => {
    alert.success(message);
  };

  const addResidents = () => {
    setOtherResidents([{}]);
  };

  const removeResidentAt = () => {
    otherResidents.pop();
    setOtherResidents(otherResidents);
  };

  const showAlert = () => {
    alert.success('SAVED SUCCESSFULLY');
  };

  // Date Picker

  const [start_date, setStartDate] = useState(null);
  const [end_date, setEndDate] = useState(null);

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
  const RegisterSchema = Yup.object().shape({
    employer: Yup.string().required('Employer is required').max(50, 'Too Long!'),
    employer_location: Yup.string().max(50, 'Too Long!'),
    employer_contact: Yup.string().max(50, 'Too Long!'),
    role_played: Yup.string().max(50, 'Too Long!'),
    start_date: Yup.date(),
    end_date: Yup.date(),
    remarks: Yup.string(),
    grossSalary: Yup.string().matches(numericRegExp, 'Only digits are allowed')
  });
  useEffect(() => {
    getEmploymentData();
  }, []);

  const formik = useFormik({
    initialValues: {
      employer: employmentData.employer || '',
      employer_location: employmentData.employer_location || '',
      employer_contact: employmentData.employer_contact || '',
      role_played: employmentData.role_played || '',
      start_date: employmentData.start_date || '',
      end_date: employmentData.end_date || '',
      remarks: employmentData.remarks || '',
      grossSalary: employmentData.grossSalary || '',
      attachments: employmentData.attachments || ''
    },
    validationSchema: RegisterSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      values.start_date = start_date;
      values.end_date = end_date;
      values.subject_ID = subjectId;
      values.userID = userID;
      values.employmentID = employmentData.employment_ID;
      if (!values.start_date) {
        values.start_date = employmentData.start_date;
      }
      if (!values.end_date) {
        values.end_date = employmentData.end_date;
      }

      console.log('VALUES::', values);
      console.log('EMP DATA::', employmentData);
      // console.log("StartDate",typeof(start_date))

      if (attachments) {
        const formData = new FormData();
        formData.append('file', attachments[0]);

        FetchApi.upload(formData, (status, data) => {
          if (status) {
            const fileUrl = BASE_URL + '/' + data.url;
            values.attachments = fileUrl;

            setSubjectEmployment(values);

            setAttachment(undefined);
          } else {
            showErrorAlert('SAVE FAILED');
          }
        });
      } else {
        setSubjectEmployment(values);
        showSuccessAlert();
      }

      resetForm({ values: '' });
    }
  });

  const getEmploymentData = () => {
    if (id) {
      const requestBody = {
        userID: userID,
        subjectID: subjectId
      };
      console.log("What I'm sending", requestBody);

      FetchApi.post(GET_EMPLOYMENT_PROFILE, requestBody, (status, data) => {
        if (status) {
          // setName(data.subject_Name)
          console.log('API DATA', data);
          const employment = applySortFilter(data, getComparator(order, orderBy), filterName);
          // const users = applySortFilter(data, getComparator(order, orderBy), filterName);
          setFilteredUsers(employment);

          setAllData(employment);

          //ALSO UPDATE THE PROFILE CONTEXT
          // setEmployment(data)
        } else {
          console.log('some error occured');
        }
      });
    }
  };

  const setSubjectEmployment = (values) => {
    FetchApi.post(
      employmentData.employment_ID ? UPDATE_EMPLOYMENT_PROFILE : SET_EMPLOYMENT_PROFILE,
      values,
      (status, data) => {
        if (status) {
          console.log('SET EMPLOYMENT RESP::::', data);
          // const users = applySortFilter(data, getComparator(order, orderBy), filterName);
          // setFilteredUsers(users)
          // setAllData(users)

          const residence = applySortFilter(data, getComparator(order, orderBy), filterName);
          // const users = applySortFilter(data, getComparator(order, orderBy), filterName);
          setFilteredUsers(residence);

          setEmploymentData(data);

          setAllData([...allData, data]);

          //ALSO UPDATE THE PROFILE CONTEXT
          setEmployment(allData);

          updateProfileData();

          showSuccessAlert('SAVED SUCCESSFULLY');
        } else {
          showErrorAlert('SAVE FAILED');
        }
      }
    );
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="KRA - VLA | Home">
      <Container maxWidth="xl">
        <Container>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid item md={12}>
                  <Card sx={{ width: '100%', paddingBottom: 3 }}>
                    <CardHeader title="Employment History" />
                  </Card>
                </Grid>

                <Grid item md={12}>
                  <Card sx={{ width: '100%', paddingBottom: 1 }}>
                    <CardHeader title="Employment" />
                    <CardContent>
                      <Stack spacing={3}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                          <TextField
                            fullWidth
                            label="Employer"
                            {...getFieldProps('employer')}
                            error={Boolean(touched.employer && errors.employer)}
                            helperText={touched.employer && errors.employer}
                          />

                          <TextField
                            fullWidth
                            label="Employer Location"
                            {...getFieldProps('employer_location')}
                            error={Boolean(touched.employer_location && errors.employer_location)}
                            helperText={touched.employer_location && errors.employer_location}
                          />

                          <TextField
                            fullWidth
                            label="Employer Contact"
                            {...getFieldProps('employer_contact')}
                            error={Boolean(touched.employer_contact && errors.employer_contact)}
                            helperText={touched.employer_contact && errors.employer_contact}
                          />
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                          <TextField
                            fullWidth
                            label="Role Played"
                            {...getFieldProps('role_played')}
                            error={Boolean(touched.role_played && errors.role_played)}
                            helperText={touched.role_played && errors.role_played}
                          />

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
                              renderInput={(params) => (
                                <TextField {...params} sx={{ width: '100%' }} />
                              )}
                            />
                          </LocalizationProvider>

                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                              disableFuture
                              label="End Date"
                              inputFormat="MM/dd/yyyy"
                              value={end_date}
                              fullWidth
                              minDate={start_date}
                              onChange={(newValue) => {
                                handleEndDate(newValue);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} sx={{ width: '100%' }} />
                              )}
                            />
                          </LocalizationProvider>

                          {/* 
                          <LocalizationProvider

                            dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label="Start Date"
                              value={start_date}
                              onChange={(newValue) => {
                                setValue(newValue);
                              }}
                              renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                          </LocalizationProvider> */}
                          {/* <TextField
                                            fullWidth
                                            label="End Date"
                                            {...getFieldProps('end_date')}
                                            error={Boolean(touched.end_date && errors.end_date)}
                                            helperText={touched.end_date && errors.end_date}
                                        /> */}
                          {/* <LocalizationProvider

                            dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label="End Date"
                              value={end_date}
                              onChange={(newValue) => {
                                setEndDate(newValue);
                              }}
                              renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                          </LocalizationProvider> */}
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                          <TextField
                            fullWidth
                            label="Gross Salary"
                            {...getFieldProps('grossSalary')}
                            inputMode="numeric"
                          />
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
                            <Typography>{employmentData.attachments}</Typography>
                          )}
                        </Stack>
                        <Stack>
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
                      </Stack>
                      <CardActions sx={{ marginTop: 2 }}>
                        <Button
                          variant="contained"
                          // sx={{ background: '#009900' }}
                          onClick={handleSubmit}
                        >
                          Save
                        </Button>
                      </CardActions>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </Container>

        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}></Stack>

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
                          subject_ID,
                          attachments,
                          employer,
                          employer_location,
                          role_played,
                          start_date,
                          end_date,
                          remarks,
                          employer_contact
                        } = row;
                        const isItemSelected = selected.indexOf(employer) !== -1;

                        return (
                          <TableRow
                          // hover
                          // key={subject_ID}
                          // tabIndex={-1}
                          // role="checkbox"
                          // selected={isItemSelected}
                          // aria-checked={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                // onChange={(event) => handleClick(event, employer)}
                              />
                            </TableCell>
                            {/* <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt={subject_Name} src={profile_pic} />
                          <Typography variant="subtitle2" noWrap>
                            {subject_Name}employer_location
                          </Typography>
                        </Stack>
                      </TableCell> */}
                            <TableCell align="left">{employer}</TableCell>
                            <TableCell align="left">{employer_location}</TableCell>
                            <TableCell align="left">{employer_contact}</TableCell>
                            <TableCell align="left">{role_played}</TableCell>
                            <TableCell align="left">{start_date}</TableCell>
                            <TableCell align="left">{end_date}</TableCell>
                            {/* <TableCell align="left">{remarks}</TableCell> */}

                            <TableCell align="left">
                              <a href={attachments} target="_blank" rel="noopener noreferrer">
                                {attachments}
                              </a>
                            </TableCell>

                            {/* <Label
                          variant="ghost"
                          color={(status === 'banned' && 'error') || 'success'}
                        >
                          {sentenceCase(status)}
                        </Label> */}
                            {/* </TableCell> */}

                            <TableCell align="right">
                              <Button onClick={() => setEmploymentData(row)}>
                                <FontAwesomeIcon icon={faEye} />
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

                  {/* {isUserNotFound && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    <SearchNotFound searchQuery={filterName} />
                  </TableCell>
                </TableRow>
              </TableBody>
            )} */}
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
    </Page>
  );
}
