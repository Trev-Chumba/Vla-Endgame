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
  TextareaAutosize,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useAlert } from 'react-alert';
import { GET_RESIDENTIAL, SET_RESIDENTIAL } from 'src/api/Endpoints';
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
import { UPDATE_RESIDENTIAL, BASE_URL } from '../../api/Endpoints';
import SearchNotFound from 'src/components/SearchNotFound';

const TABLE_HEAD = [
  { id: 'currentAddress', label: 'Current Address', alignRight: false },
  { id: 'coordinates', label: 'Coordinates', alignRight: false },
  { id: 'otherAddress', label: 'Other Address', alignRight: false },
  { id: 'physicalAddress', label: 'Physical Address', alignRight: false },
  { id: 'postalAddress', label: 'Postal Address', alignRight: false },
  { id: 'attachments', label: 'Attachments', alignRight: false },
  { id: 'remarks', label: 'Remarks', alignRight: false }
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
      (_user) => _user.currentAddress.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return stabilizedThis.map((el) => el[0]);
}

export default function ResidentialProfile({ id, updateProfileData }) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('currentAddress');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allData, setAllData] = useState([]);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const { profile, setResidential, residential } = useContext(ProfileContext);
  const [profileData, setProfileData] = useState(profile);

  const [otherResidents, setOtherResidents] = useState(residential);

  const [residentialData, setResidentialData] = useState({});

  const [attachments, setAttachment] = useState(undefined);
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
  const poRegex = /\bP(ost|ostal)?([ \.]*O(ffice)?)?([ \.]*Box)?\b/i;

  //get residential info
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

      FetchApi.post(GET_RESIDENTIAL, requestBody, (status, data) => {
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
          setResidential(data);
        } else {
          console.log('some error occured');
        }
      });
    }
  };

  const RegisterSchema = Yup.object().shape({
    currentAddress: Yup.string()
      .required('Current address is required')
      .matches(stringRegExp, 'Only Characters allowed'),
    physicalAddress: Yup.string().matches(stringRegExp, 'Only Characters allowed'),
    otherAddress: Yup.string().matches(stringRegExp, 'Only Characters allowed'),
    postalAddress: Yup.string(), //(PO Box|POBox|PO. Box|P.O. Box|P O Box|P.O Box|Postal Box|Post Office Box|PO)
    coordinates: Yup.string(),
    remarks: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      currentAddress: residentialData.currentAddress || '',
      physicalAddress: residentialData.physicalAddress || '',
      otherAddress: residentialData.otherAddress || '',
      postalAddress: residentialData.postalAddress || '',
      coordinates: residentialData.coordinates || '',
      attachments: residentialData.attachments || '',
      remarks: residentialData.remarks || ''
    },
    enableReinitialize: true,
    validationSchema: RegisterSchema,
    onSubmit: (values, { resetForm }) => {
      values.subjectID = subjectID;
      values.userID = userID;

      // values.userID = "4"
      values.resInfoID = residentialData.res_INFO_ID;
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
      residentialData.res_INFO_ID ? UPDATE_RESIDENTIAL : SET_RESIDENTIAL,
      values,
      (status, data) => {
        if (status) {
          // setProfileData(data)

          if (!data.subjectID) {
            showErrorAlert('CREATE USER FIRST');
          } else {
            setSubjectID(data.subjectID);

            getProfileResidents();

            setResidentialData({});

            showSuccessAlert('SAVED SUCCESSFULLY');

            updateProfileData();
          }
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
                  <CardHeader title="Residential Details" />
                </Card>
              </Grid>

              <Grid item md={12}>
                <Card sx={{ width: '100%', paddingBottom: 1 }}>
                  <CardHeader title="Add a Residence" />
                  <CardContent>
                    <Stack spacing={3}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                          fullWidth
                          label="current address"
                          {...getFieldProps('currentAddress')}
                          error={Boolean(touched.currentAddress && errors.currentAddress)}
                          helperText={touched.currentAddress && errors.currentAddress}
                        />

                        <TextField
                          fullWidth
                          label="physical address"
                          {...getFieldProps('physicalAddress')}
                          error={Boolean(touched.physicalAddress && errors.physicalAddress)}
                          helperText={touched.physicalAddress && errors.physicalAddress}
                        />

                        <TextField
                          fullWidth
                          label="other address"
                          {...getFieldProps('otherAddress')}
                          error={Boolean(touched.otherAddress && errors.otherAddress)}
                          helperText={touched.otherAddress && errors.otherAddress}
                        />
                      </Stack>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                          fullWidth
                          label="postal address"
                          {...getFieldProps('postalAddress')}
                          error={Boolean(touched.postalAddress && errors.postalAddress)}
                          helperText={touched.postalAddress && errors.postalAddress}
                        />

                        <TextField
                          fullWidth
                          label="coordinates"
                          {...getFieldProps('coordinates')}
                          error={Boolean(touched.coordinates && errors.coordinates)}
                          helperText={touched.coordinates && errors.coordinates}
                        />

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
                            <Typography>{residentialData.attachments}</Typography>
                          )}
                        </Stack>
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
                          coordinates,
                          currentAddress,
                          otherAddress,
                          physicalAddress,
                          postalAddress,
                          remarks,
                          res_INFO_ID
                        } = row;
                        const isItemSelected = selected.indexOf(currentAddress) !== -1;

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

                            <TableCell align="left">{currentAddress}</TableCell>
                            <TableCell align="left">{coordinates}</TableCell>
                            <TableCell align="left">{otherAddress}</TableCell>
                            <TableCell align="left">{physicalAddress}</TableCell>
                            <TableCell align="left">{postalAddress}</TableCell>

                            <TableCell align="left">
                              <a href={attachments} target="_blank" rel="noopener noreferrer">
                                {attachments}
                              </a>
                            </TableCell>
                            <TableCell align="left">{remarks}</TableCell>

                            <TableCell align="right">
                              <Button onClick={() => setResidentialData(row)}>
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
