import { filter } from 'lodash';
import * as Yup from 'yup';
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
    Typography,
    MenuItem,
    CardHeader, CardContent,
    TextField, CardActions
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { useFormik, Form, FormikProvider } from 'formik';
import { useAlert } from 'react-alert'
import USERLIST from 'src/_mocks_/user';
import { ProfileContext } from 'src/context/ProfileContext';
import { UserContext } from 'src/context/UserContext';
import Scrollbar from 'src/components/Scrollbar';
import { UserListHead, UserListToolbar } from 'src/sections/@dashboard/user';
import {
    GET_INTEGRITY, SET_INTEGRITY, UPDATE_INTEGRITY,BASE_URL
} from 'src/api/Endpoints';
import { FetchApi } from 'src/api/FetchApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEye } from '@fortawesome/free-solid-svg-icons';


const TABLE_HEAD = [
    { id: 'offence', label: 'Offence', alignRight: false },
    { id: 'details', label: 'Details', alignRight: false },
    { id: 'findings', label: 'Findings', alignRight: false },
    { id: 'attachments', label: 'Attachments', alignRight: false },
    { id: 'remarks', label: 'Remarks', alignRight: false },


];

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.offence.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}
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

export default function IntegrityIssues({ id, updateProfileData }) {

    const alert = useAlert();

    const showAlert = () => {
        alert.success("SAVED SUCCESSFULLY")
    }

    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [allData, setAllData] = useState([])

    const [filteredUsers, setFilteredUsers] = useState([]);
    const { profile } = useContext(ProfileContext);
    const { userData } = useContext(UserContext);

    const [subjectID, setSubjectID] = useState(profile.subjectID)
    const [userID, setUserID] = useState(userData.userID)

    const [attachments, setAttachment] = useState(undefined)
    const[integrityData,setIntegrityData]=useState({})


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
        const residence = applySortFilter(allData, getComparator(order, orderBy), filterName);
        setFilteredUsers(residence)
    };

    const showErrorAlert = (message) => {
        alert.error(message)
    }

    const showSuccessAlert = (message) => {
        alert.success(message)
    }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;
    const phoneRegExp = /^((\\+[1-9]{1,4})|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const stringRegExp= /^[aA-zZ\s]+$/
    const numericRegExp= /^[0-9]+$/










    const RegisterSchema = Yup.object().shape({
        offence: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Offence name required'),
        details: Yup.string().matches(stringRegExp,"Only characters are allowed ").max(50,"Too Long!"),
        findings: Yup.string().max(50,"Too Long!"),
        remarks: Yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            offence: integrityData.offence||"",
            details: integrityData.details||"",
            findings: integrityData.findings||"",
            remarks: integrityData.remarks||"",
            attachments:integrityData.attachments||""
        },
        validationSchema: RegisterSchema,
        enableReinitialize:true,
        onSubmit: (values, { resetForm }) => {

            values.subjectID = subjectID
            values.userID = userID
            values.itID=integrityData.itID
            console.log(values)


            //upload any files

            if (attachments) {

                const formData = new FormData();
                formData.append("file", attachments[0])

                FetchApi.upload(formData, (status, data) => {

                    if (status) {
                        const fileUrl = BASE_URL + "/" + data.url;
                        values.attachments = fileUrl

                        setIntegrityProfile(values)

                        setAttachment(undefined)
                    } else {
                        showErrorAlert("SAVE FAILED")
                    }

                })


            } else {

                setIntegrityProfile(values)
            }

            resetForm({ values: '' })

        }
    });


    const setIntegrityProfile = (values) => {
        console.log(values)
        FetchApi.post(integrityData.itID ? UPDATE_INTEGRITY:SET_INTEGRITY, values, (status, data) => {
            if (status) {
                console.log("Integrity data :::", data)

                if (!data.case.subjectID) {
                    showErrorAlert("CREATE USER FIRST")
                } else {
                    setSubjectID(data.subjectID)
                    console.log(values)

                    getIntegrityData()

                    // setAssociates({})

                    showSuccessAlert("SAVED SUCCESSFULLY")

                    updateProfileData()
                }



            } else {
                showErrorAlert("SAVE FAILED")
            }
        })
    }


    useEffect(() => {

        getIntegrityData()

    }, [])
    const getIntegrityData = () => {
        if (id) {
            const requestBody = {
                userID: userID,
                subjectID: subjectID
            }
            console.log("What I'm sending", requestBody)

            FetchApi.post(GET_INTEGRITY, requestBody, (status, data) => {

                if (status) {

                    console.log("API DATA", data)
                    const integrity = applySortFilter(data, getComparator(order, orderBy), filterName);
                    console.log("INFO:::", integrity)
                    // const users = applySortFilter(data, getComparator(order, orderBy), filterName);
                    setFilteredUsers(integrity)

                    setAllData(integrity)
                    // setOtherResidents(residence)
                    // console.log("RESIDENCE", residence)

                    //ALSO UPDATE THE PROFILE CONTEXT



                } else {
                    console.log("some error occured")
                }
            })
        }
    }

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

    return (
        <Container>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2} sx={{ width: '100%' }}>

                        <Grid item md={12}>
                            <Card sx={{ width: '100%', paddingBottom: 3 }}>
                                <CardHeader
                                    title="Integrity and Ethical Issues"
                                    action={
                                        <>
                                            {/* Add actions here */}
                                        </>
                                    }
                                />






                            </Card>
                        </Grid>
                    </Grid>

                    <Grid item md={12}>

                        <Card sx={{ width: '100%', paddingBottom: 3, marginTop: 2 }}>
                            <CardContent>
                                <Stack spacing={3}>

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            label="Type of offence"
                                            {...getFieldProps('offence')}
                                            error={Boolean(touched.offence && errors.offence)}
                                            helperText={touched.offence && errors.offence}
                                        />

                                        <TextField
                                            fullWidth
                                            label="Details"
                                            {...getFieldProps('details')}
                                            error={Boolean(touched.details && errors.details)}
                                            helperText={touched.details && errors.details}
                                        />




                                    </Stack>
                                </Stack>

                                <Stack spacing={3} sx={{ marginTop: 3 }}>

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="Findings"
                                            {...getFieldProps('findings')}
                                            error={Boolean(touched.findings && errors.findings)}
                                            helperText={touched.findings && errors.findings}
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
                          attachments ? <Typography>{attachments[0].name}</Typography> : <Typography>{integrityData.attachments}</Typography>
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

                </Form>
            </FormikProvider>






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
                                            const { subjectID, attachments, offence, details, findings,
                                                remarks } = row;
                                            const isItemSelected = selected.indexOf(offence) !== -1;

                                            return (
                                                <TableRow
                                                    // hover
                                                    // key={subjectID}
                                                    // tabIndex={-1}
                                                    // role="checkbox"
                                                    // selected={isItemSelected}
                                                    // aria-checked={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            // onChange={(event) => handleClick(event, offence)}
                                                        />
                                                    </TableCell>


                                                    <TableCell align="left">{offence}</TableCell>
                                                    <TableCell align="left">{details}</TableCell>
                                                    <TableCell align="left">{findings}</TableCell>

                                                    <TableCell align="left">
                                                        <a href={attachments} target="_blank" rel="noopener noreferrer">{attachments}</a>
                                                    </TableCell>
                                                    <TableCell align="left">{remarks}</TableCell>


                                                    <TableCell align="right">
                                                        <Button
                                                        onClick={() => setIntegrityData(row)}
                                                        >
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
    )

}