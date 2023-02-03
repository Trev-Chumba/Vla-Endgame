import * as Yup from 'yup';
import { filter } from 'lodash';
import { useState, useEffect, useContext } from 'react';
import { useAlert } from 'react-alert';
import { LinkasRouterLink, useRoutes, useNavigate } from 'react-router-dom';
import { useFormik, FormikProvider, Form } from 'formik';
var Loader = require('react-loader');

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
    Box,
    Grid,
    CardHeader, CardContent,
    MenuItem, TextField, CardActions
} from '@mui/material';

// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
//
import USERLIST from '../_mocks_/user';
import { FetchApi } from '../api/FetchApi';
import { FIND_SUBJECT_ID, EXPORT_PROFILE } from '../api/Endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from 'src/context/UserContext';
import Label from '../components/Label';



// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'firstname', label: 'Name', alignRight: false },
    { id: 'telNO', label: 'Tel', alignRight: false },
    { id: 'carmake', label: 'Car Make', alignRight: false },
    { id: 'carmodel', label: 'Car Model', alignRight: false },
    { id: 'regno', label: 'Registration Number', alignRight: false },
    { id: 'logbookno', label: 'Log Book Number', alignRight: false },

    { id: 'ownertype', label: 'owner Type', alignRight: false },
    { id: 'pin', label: 'Pin', alignRight: false },

    { id: 'yearofman', label: 'Year of Manufacture', alignRight: false },



];
const KPLC_HEAD = [
    { id: 'customerName', label: 'Customer Name', alignRight: false },
    { id: 'account', label: 'Account', alignRight: false },
    { id: 'telNO', label: 'Tel', alignRight: false },
    { id: 'region', label: 'Region', alignRight: false },
    { id: 'meters', label: 'Meters', alignRight: false },
    { id: 'lrNo', label: 'LR/No', alignRight: false },
    { id: 'kwHr', label: 'Kw/Hr', alignRight: false },



];
const COMPANY_HEAD = [
    { id: 'regName', label: 'Registration Name', alignRight: false },
    { id: 'regNo', label: 'Registration Number', alignRight: false },
    { id: 'entityType', label: 'Entity Type', alignRight: false },
    { id: 'entityStatus', label: 'Entity Status', alignRight: false },
    { id: 'regDate', label: 'Registration Date', alignRight: false },
    { id: 'nssfNo', label: 'NSSF No', alignRight: false },
    { id: 'nhifNo', label: 'NHIF No', alignRight: false },
    { id: 'natuusiness', label: 'Nature usiness', alignRight: false },
    { id: 'ownerDetails', label: 'Owner Details', alignRight: false },





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
        return filter(array, (_user) => _user.subjectName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }

    return stabilizedThis.map((el) => el[0]);
}

export default function SearchSubject() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [allData, setAllData] = useState([])
    const { userData } = useContext(UserContext)

    const [subjectData, setSubjectData] = useState({})
    const [idNo, setidNo] = useState("")

    const [companyData, setCompanyData] = useState({})

    // const [allData, setAllData] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredCompany, setFilteredCompnay] = useState([]);
    const [filteredKplc, setFilteredKplc] = useState([]);

    const [isLoading, setIsLoading] = useState(true)


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
    const alert = useAlert();

    const showAlert = () => {
        alert.info("Data saved sucessfully")
    }

    const showErrorAlert = (message) => {
        alert.error(message)
    }

    const showSuccessAlert = (message) => {
        alert.success(message)
    }


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



    const RegisterSchema = Yup.object().shape({
        idNo: Yup.string(),
        subjectName: Yup.string(),
        dob: Yup.string(),
        gender: Yup.string(),
        placeOfBirth: Yup.string(),
        physicalAddress: Yup.string(),
        citizen: Yup.string()

    });

    const formik = useFormik({
        initialValues: {
            idNo: subjectData.naID || "",
            subjectName: subjectData.firstName + subjectData.middleName + subjectData.lastName || "",
            dob: subjectData.dateBirth || "",
            gender: subjectData.sex || "",
            birthDistrict: subjectData.birthDistrict || "",
            physicalAddress: subjectData.physicalAdress || "",
            citizen: subjectData.citizen || "",
            issueDate: subjectData.issueDate || "",
            issuePlace: subjectData.issuePlace || "",
            birthTown: subjectData.birthTown || ""
        },
        validationSchema: RegisterSchema,
        enableReinitialize: true,
        onSubmit: (values) => {

            // searchSubject(values)

            console.log(values)

            // Handle submission

        }
    });




    const searchSubject = () => {

        setIsLoading(false)

        const postBody = {
            idNo: idNo,
            // phonenumber: "",
            // id_type: "ID",
            // channel: "mobile"
        }
        FetchApi.post(FIND_SUBJECT_ID, postBody, (status, data) => {
            if (status) {
                // const json_data = JSON.parse(data.bio)
                // console.log(json_data)

                //  setSubjectData(json_data)
                console.log(data)

                const json_properties = JSON.parse(data.properties)
                setFilteredUsers(json_properties)

                const json_company = JSON.parse(data.company)
                setFilteredCompnay(json_company)
                console.log(json_properties)

                const json_bio = JSON.parse(data.bio)
                console.log(json_bio, "JSON_BIO")
                setSubjectData(json_bio)

                // {
                // insrrt kplc data here
                // const json_kplc=JSON.parse(data.kplc)
                // setFilteredKplc(json_kplc)
                // }


            } else {
                showErrorAlert("NOT FOUND")
            }

            setIsLoading(true)
        })
    }

    const navigate = useNavigate()


    const exportSubjectData = () => {

        setIsLoading(false)

        const requestBody = {
            "idNo": subjectData.naID
        }

        console.log("What I'm sending", requestBody)

        FetchApi.post(EXPORT_PROFILE, requestBody, (status, data) => {
            if (status) {
                // setName(data.subject_Name)
                console.log("API DATA", data)

                navigate('/dashboard/profile/SP/' + subjectData.naID)

            } else {
                console.log("some error occured")
            }

            setIsLoading(true)
        })
    }





    const isUserNotFound = filteredUsers.length === 0;
    const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

    return (
        <Page title="KRA VLA | Search Subject">

            <Container>
                <form >
                    <Grid container spacing={2} sx={{ width: '100%' }}>
                        <Loader loaded={isLoading} />

                        <Grid item md={12}>
                            <Card sx={{ width: '100%', paddingBottom: 3 }}>
                                <CardHeader
                                    title="Search Subject with ID Number"
                                />

                                <CardContent>
                                    <Stack spacing={3}>

                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                            <TextField
                                                fullWidth
                                                label="Subject ID Number"
                                                onChange={(event) => setidNo(event.target.value)}
                                            />

                                            <Button variant="contained"

                                                sx={{ background: '#00B23A' }}
                                                onClick={() => searchSubject()}
                                            >Search</Button>


                                        </Stack>

                                    </Stack>
                                </CardContent>


                            </Card>
                        </Grid>

                    </Grid>
                </form>

                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={2} sx={{ width: '100%', marginTop: 2 }}>

                            <Grid item md={12} >
                                <Card sx={{ width: '100%', paddingBottom: 1 }}>
                                    <CardHeader
                                        title="Subject Details"
                                        action={

                                            <Button
                                                onClick={() => exportSubjectData()}
                                                variant="contained" >Export to Profile</Button>
                                        }
                                    />
                                    <CardContent>

                                        <Stack spacing={3}>
                                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                                <TextField
                                                    fullWidth
                                                    label="Subject Name"
                                                    disabled

                                                    {...getFieldProps('subjectName')}
                                                    error={Boolean(touched.subjectName && errors.subjectName)}
                                                    helperText={touched.subjectName && errors.subjectName}
                                                />


                                                <TextField
                                                    fullWidth
                                                    disabled
                                                    label="Gender"
                                                    {...getFieldProps('gender')}
                                                    error={Boolean(touched.gender && errors.gender)}
                                                    helperText={touched.gender && errors.gender}
                                                />

                                                <TextField
                                                    fullWidth
                                                    disabled
                                                    label="Date of Birth"
                                                    {...getFieldProps('dob')}
                                                    error={Boolean(touched.dob && errors.dob)}
                                                    helperText={touched.dob && errors.dob}
                                                />
                                            </Stack>
                                        </Stack>


                                        <Stack spacing={3} sx={{ marginTop: 2 }}>
                                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                                <TextField
                                                    fullWidth
                                                    label="ID Number"
                                                    disabled

                                                    {...getFieldProps('idNo')}
                                                    error={Boolean(touched.idNo && errors.idNo)}
                                                    helperText={touched.idNo && errors.idNo}
                                                />


                                                <TextField
                                                    fullWidth
                                                    label="Birth District"
                                                    disabled
                                                    {...getFieldProps('birthDistrict')}
                                                    error={Boolean(touched.birthDistrict && errors.birthDistrict)}
                                                    helperText={touched.birthDistrict && errors.birthDistrict}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Physical Address"
                                                    disabled
                                                    {...getFieldProps('physicalAddress')}
                                                    error={Boolean(touched.physicalAddress && errors.physicalAddress)}
                                                    helperText={touched.physicalAddress && errors.physicalAddress}
                                                />


                                            </Stack>
                                        </Stack>

                                        <Stack spacing={3} sx={{ marginTop: 2 }}>
                                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                                <TextField
                                                    fullWidth
                                                    label="Issue Date"
                                                    disabled

                                                    {...getFieldProps('issueDate')}
                                                    error={Boolean(touched.issueDate && errors.issueDate)}
                                                    helperText={touched.issueDate && errors.issueDate}
                                                />


                                                <TextField
                                                    fullWidth
                                                    label="Issue Place"
                                                    disabled
                                                    {...getFieldProps('issuePlace')}
                                                    error={Boolean(touched.issuePlace && errors.issuePlace)}
                                                    helperText={touched.issuePlace && errors.issuePlace}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Birth Town"
                                                    disabled
                                                    {...getFieldProps('birthTown')}
                                                    error={Boolean(touched.birthTown && errors.birthTown)}
                                                    helperText={touched.birthTown && errors.birthTown}
                                                />


                                            </Stack>
                                        </Stack>


                                    </CardContent>


                                    <CardHeader
                                        title="NTSA information"


                                    />
                                    <CardContent>
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
                                                                const {
                                                                    firstname,
                                                                    telNO,
                                                                    carmake,
                                                                    carmodel,
                                                                    regno,
                                                                    logbookno,

                                                                    ownertype,
                                                                    pin,

                                                                    yearofman,


                                                                } = row;
                                                                const isItemSelected = selected.indexOf(regno) !== -1;

                                                                return (
                                                                    <TableRow
                                                                        hover
                                                                        key={regno}
                                                                        tabIndex={-1}
                                                                        role="checkbox"
                                                                        selected={isItemSelected}
                                                                        aria-checked={isItemSelected}
                                                                    >
                                                                        <TableCell padding="checkbox">
                                                                            <Checkbox
                                                                                checked={isItemSelected}
                                                                                onChange={(event) => handleClick(event, employer)}
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
                                                                        <TableCell align="left">{firstname}</TableCell>
                                                                        <TableCell align="left">{telNO}</TableCell>
                                                                        <TableCell align="left">{carmake}</TableCell>
                                                                        <TableCell align="left">{carmodel}</TableCell>
                                                                        <TableCell align="left">{regno}</TableCell>
                                                                        <TableCell align="left">{logbookno}</TableCell>
                                                                        <TableCell align="left">{ownertype}</TableCell>
                                                                        <TableCell align="left">{pin}</TableCell>


                                                                        <TableCell align="left">{yearofman}</TableCell>

                                                                        {/* <Label
                variant="ghost"
                color={(status === 'banned' && 'error') || 'success'}
              >
                {sentenceCase(status)}
              </Label> */}
                                                                        {/* </TableCell> */}




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

                                    </CardContent>

                                    {/* Companies */}
                                    <CardHeader
                                        title="Companies information"


                                    />
                                    <CardContent>
                                        <Scrollbar>
                                            <TableContainer sx={{ minWidth: 800 }}>
                                                <Table>
                                                    <UserListHead
                                                        order={order}
                                                        orderBy={orderBy}
                                                        headLabel={COMPANY_HEAD}
                                                        rowCount={USERLIST.length}
                                                        numSelected={selected.length}
                                                        onRequestSort={handleRequestSort}
                                                        onSelectAllClick={handleSelectAllClick}
                                                    />
                                                    <TableBody>
                                                        {filteredCompany
                                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                            .map((row) => {
                                                                const {
                                                                    regName,
                                                                    regNo,
                                                                    entityType,
                                                                    entityStatus,
                                                                    regDate,
                                                                    natureOfBusiness,
                                                                    pin,
                                                                    nssfNo,
                                                                    nhifNo,
                                                                    ownwerDetails,




                                                                } = row;
                                                                const isItemSelected = selected.indexOf(regName) !== -1;

                                                                return (
                                                                    <TableRow
                                                                        hover
                                                                        key={regNo}
                                                                        tabIndex={-1}
                                                                        role="checkbox"
                                                                        selected={isItemSelected}
                                                                        aria-checked={isItemSelected}
                                                                    >
                                                                        <TableCell padding="checkbox">
                                                                            <Checkbox
                                                                                checked={isItemSelected}
                                                                                onChange={(event) => handleClick(event, employer)}
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
                                                                        <TableCell align="left">{regName}</TableCell>
                                                                        <TableCell align="left">{regNo}</TableCell>
                                                                        <TableCell align="left">{entityType}</TableCell>
                                                                        <TableCell align="left">{entityStatus}</TableCell>
                                                                        <TableCell align="left">{regDate}</TableCell>
                                                                        {/* <TableCell align="left">{pin}</TableCell> */}
                                                                        <TableCell align="left">{nssfNo}</TableCell>
                                                                        <TableCell align="left">{nhifNo}</TableCell>


                                                                        <TableCell align="left">{natureOfBusiness}</TableCell>
                                                                        <TableCell align="left">{ownwerDetails}</TableCell>





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
                                            count={filteredCompany.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />

                                    </CardContent>

                                    <CardHeader
                                        title="KPLC information"


                                    />
                                    <CardContent>
                                        <Scrollbar>
                                            <TableContainer sx={{ minWidth: 800 }}>
                                                <Table>
                                                    <UserListHead
                                                        order={order}
                                                        orderBy={orderBy}
                                                        headLabel={KPLC_HEAD}
                                                        rowCount={USERLIST.length}
                                                        numSelected={selected.length}
                                                        onRequestSort={handleRequestSort}
                                                        onSelectAllClick={handleSelectAllClick}
                                                    />
                                                    <TableBody>
                                                        {filteredKplc
                                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                            .map((row) => {
                                                                const {
                                                                    customerName,
                                                                    telNO,
                                                                    account,
                                                                    meters,
                                                                    lrNo,
                                                                    region,

                                                                    kwHr,



                                                                } = row;
                                                                const isItemSelected = selected.indexOf(region) !== -1;

                                                                return (
                                                                    <TableRow
                                                                        hover
                                                                        key={customerName}
                                                                        tabIndex={-1}
                                                                        role="checkbox"
                                                                        selected={isItemSelected}
                                                                        aria-checked={isItemSelected}
                                                                    >
                                                                        <TableCell padding="checkbox">
                                                                            <Checkbox
                                                                                checked={isItemSelected}
                                                                                onChange={(event) => handleClick(event, region)}
                                                                            />
                                                                        </TableCell>



                                                                        <TableCell align="left">{account}</TableCell>
                                                                        <TableCell align="left">{meters}</TableCell>
                                                                        <TableCell align="left">{lrNo}</TableCell>
                                                                        <TableCell align="left">{region}</TableCell>
                                                                        <TableCell align="left">{kwHr}</TableCell>






                                                                    </TableRow>
                                                                );
                                                            })}
                                                        {emptyRows > 0 && (
                                                            <TableRow style={{ height: 53 * emptyRows }}>
                                                                <TableCell colSpan={6} />
                                                            </TableRow>
                                                        )}
                                                    </TableBody>


                                                </Table>
                                            </TableContainer>
                                        </Scrollbar>

                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            component="div"
                                            count={filteredKplc.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />

                                    </CardContent>

                                </Card>





                            </Grid>

                        </Grid>


                    </Form>


                </FormikProvider>


            </Container>

        </Page>
    );
}






