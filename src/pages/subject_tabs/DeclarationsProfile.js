import * as Yup from 'yup';
import { filter } from 'lodash';
import {
  CardHeader,
  Grid,
  CardContent,
  TextField,
  CardActions,
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
  MenuItem,
  TextareaAutosize,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useAlert } from 'react-alert';
import { GET_DECLARATIONS, SET_DECLARATIONS } from 'src/api/Endpoints';
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
import { UPDATE_DECLARATIONS, BASE_URL } from '../../api/Endpoints';
import SearchNotFound from 'src/components/SearchNotFound';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

const TABLE_HEAD = [
  { id: 'type', label: 'Type of Asset/Liability', alignRight: false },
  { id: 'description', label: 'Declaration Type', alignRight: false },
 // { id: 'declaration', label: 'Declaration', alignRight: false },
  { id: 'estValue', label: 'Value', alignRight: false },

  { id: 'date', label: ' Date', alignRight: false },
  { id: 'attachments', label: 'Attachments', alignRight: false },
  { id: 'remarks', label: 'Remarks', alignRight: false }
];

// ----------------------------------------------------------------------

const types = [
  {
    value: 'Asset',
    label: 'Asset'
  },
  {
    value: 'Liability',
    label: 'Liability'
  },
  {
    value: 'Income',
    label: 'Income'
  },
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
    return filter(array, (_user) => _user.type.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}

export default function DeclarationsProfile({ id, updateProfileData }) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('type');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allData, setAllData] = useState([]);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const { profile, setDeclarations, declarations } = useContext(ProfileContext);
  const [profileData, setProfileData] = useState(profile);

  const [otherResidents, setOtherResidents] = useState(declarations);

  const [declarationsData, setDeclarationsData] = useState({});

  const [attachments, setAttachment] = useState(undefined);
  const [date, setDate] = useState(null);
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
    setFilteredUsers(users);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const alert = useAlert();

  const [subjectID, setSubjectID] = useState(profile.subjectID);
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
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const stringRegExp = /^[aA-zZ\s]+$/;
  const numericRegExp = /^[0-9]+$/;

  //get declarations info
  useEffect(() => {
    getProfileResidents();
  }, []);

  const getProfileResidents = () => {
    if (id) {
      const requestBody = {
        userID: userID,
        subjectID: subjectID
      };
      console.log("What I'm sending", requestBody);

      FetchApi.post(GET_DECLARATIONS, requestBody, (status, data) => {
        if (status) {
          // setName(data.subject_Name)
          console.log('API DATA', data);

          const residence = applySortFilter(data, getComparator(order, orderBy), filterName);
          // const users = applySortFilter(data, getComparator(order, orderBy), filterName);
          setFilteredUsers(residence);

          setAllData(residence);
          setOtherResidents(residence);
          console.log('RESIDENCE', residence);

          //ALSO UPDATE THE PROFILE CONTEXT
          setDeclarations(data);
        } else {
          console.log('some error occured');
        }
      });
    }
  };

  const RegisterSchema = Yup.object().shape({
    description: Yup.string(),
    type: Yup.string().max(50, 'Too Long!').required('required'),
    estValue: Yup.string(),
    declaration: Yup.string(),
    date: Yup.string(),
    remarks: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      description: declarationsData.description || '',
      type: declarationsData.type || '',
      estValue: declarationsData.estValue || '',
      declaration: declarationsData.declaration || '',
      date: declarationsData.date || '',
      attachments: declarationsData.attachments || '',
      remarks: declarationsData.remarks || ''
    },
    enableReinitialize: true,
    validationSchema: RegisterSchema,
    onSubmit: (values, { resetForm }) => {
      values.subjectID = subjectID;
      values.userID = userID;
      values.date = date;

      // values.userID = "4"
      //   values.resInfoID = declarationsData.res_INFO_ID;
      console.log(values, 'Values');

      //upload any files

      if (attachments) {
        const formData = new FormData();
        formData.append('file', attachments[0]);

        FetchApi.upload(formData, (status, data) => {
          if (status) {
            const fileUrl = BASE_URL + '/' + data.url;
            values.attachments = fileUrl;

            setSubjectResidence(values);

            setAttachment(undefined);
          } else {
            showErrorAlert('SAVE FAILED');
          }
        });
      } else {
        setSubjectResidence(values);
      }

      resetForm({ values: '' });
    }
  });

  const setSubjectResidence = (values) => {
    FetchApi.post(
      declarationsData.declarationID ? UPDATE_DECLARATIONS : SET_DECLARATIONS,
      values,
      (status, data) => {
        if (status) {
          // setProfileData(data)

          setSubjectID(data.subjectID);

          getProfileResidents();

          setDeclarationsData({});

          showSuccessAlert('SAVED SUCCESSFULLY');

          updateProfileData();
        } else {
          showErrorAlert('SAVE FAILED');
        }
      }
    );
  };

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
                  <CardHeader title="Declarations Details" />
                </Card>
              </Grid>

              <Grid item md={12}>
                <Card sx={{ width: '100%', paddingBottom: 1 }}>
                  <CardHeader title="Add Declarations" />
                  <CardContent>
                    <Stack spacing={3}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField fullWidth select label="Type of Declaration" {...getFieldProps('declaration')}>
                          {types.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      <TextField
                          fullWidth
                          label="Description"
                          {...getFieldProps('type')}
                          error={Boolean(touched.type && errors.type)}
                          helperText={touched.type && errors.type}
                        />
                        
                      </Stack>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      
                        
                      <TextField
                          fullWidth
                          label="Value (KSh)"
                          {...getFieldProps('estValue')}
                          error={Boolean(touched.estValue && errors.estValue)}
                          helperText={touched.estValue && errors.estValue}
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            disableFuture
                            label="Date of Inquiry"
                            value={date}
                            onChange={(newValue) => {
                              setDate(newValue);
                            }}
                            renderInput={(params) => <TextField fullWidth {...params} />}
                          />
                        </LocalizationProvider>
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
                          <Typography>{declarationsData.attachments}</Typography>
                        )}
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
                      <Button
                        onClick={handleSubmit}
                        // sx={{ background: '#009900' }}
                        variant="contained"
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
                          subjectID,
                          attachments,
                          estValue,
                          type,
                          declaration,
                          date,
                          postalAddress,
                          remarks,
                          res_INFO_ID
                        } = row;
                        const isItemSelected = selected.indexOf(type) !== -1;

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

                            <TableCell align="left">{declaration}</TableCell>
                            <TableCell align="left">{type}</TableCell>
                            <TableCell align="left">{estValue}</TableCell>
                            <TableCell align="left">{date}</TableCell>

                            <TableCell align="left">
                              <a href={attachments} target="_blank" rel="noopener noreferrer">
                                {attachments}
                              </a>
                            </TableCell>
                            <TableCell align="left">{remarks}</TableCell>

                            <TableCell align="right">
                              <Button onClick={() => setDeclarationsData(row)}>
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
  );
}
