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
    MenuItem,
    CardHeader, CardContent,
    TextField, CardActions,
    Typography
} from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import { useFormik, Form, FormikProvider } from 'formik';
import { useAlert } from 'react-alert'
import USERLIST from 'src/_mocks_/user';
import Scrollbar from 'src/components/Scrollbar';
import { UserListHead, UserListToolbar } from 'src/sections/@dashboard/user';
import { ProfileContext } from 'src/context/ProfileContext';
import { UserContext } from 'src/context/UserContext';
import { GET_AGENCY, SET_AGENCY,BASE_URL,UPDATE_AGENCY } from 'src/api/Endpoints';
import { FetchApi } from 'src/api/FetchApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEye } from '@fortawesome/free-solid-svg-icons';

const TABLE_HEAD = [
    { id: 'agency', label: 'Agency', alignRight: false },
    { id: 'findings', label: 'Findings.', alignRight: false },
    { id: 'details', label: 'Details', alignRight: false },
    { id: 'attachments', label: 'Attachments', alignRight: false },
    { id: 'findings', label: 'Offence', alignRight: false },

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
        return filter(array, (_user) => _user.agency.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

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

export default function OtherAgencyInfo({ id, updateProfileData  }) {

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

    const [subjectID, setSubjectID] = useState(profile.subjectID);
    const [userID, setUserID] = useState(userData.userID);
    const [agencyData,setAgencyData]=useState({})



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


    const RegisterSchema = Yup.object().shape({
        agency: Yup.string().required("Select an agency"),
        findings: Yup.string().required('Offence name required'),
        details: Yup.string(),
        // findings: Yup.string(),
        remarks: Yup.string(),

    });
    const [attachments, setAttachment] = useState(undefined)

    const formik = useFormik({
        initialValues: {
            agency: agencyData.agency||"",
            findings: agencyData.findings||"",
            details: agencyData.details||"",
            // findings: agencyData.findings||"",
            remarks: agencyData.remarks||"",
            attachments:agencyData.attachments||""
        },
        validationSchema: RegisterSchema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            values.subjectID = subjectID
            values.userID = userID
            values.arID=agencyData.arID

            console.log(values,"Values")

            if (attachments) {

                const formData = new FormData();
                formData.append("file", attachments[0])

                FetchApi.upload(formData, (status, data) => {

                    if (status) {
                        const fileUrl = BASE_URL + "/" + data.url;
                        values.attachments = fileUrl

                        setAgencyProfile(values)

                        setAttachment(undefined)
                    } else {
                        showErrorAlert("SAVE FAILED")
                    }

                })


            } else {

                setAgencyProfile(values)
            }



            resetForm({ values: '' })

        }
    });

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

    const agency = [
        {
            value: 'select agency', label: 'select agency'
        },
        {
            value: 'DCI', label: 'DCI'
        },
        {
            value: 'BRS', label: 'BRS'
        },
        {
            value: 'FRC', label: 'FRC'
        },
        {
            value: 'CRB', label: 'CRB'
        },
        {
            value: 'OTHER', label: 'OTHER'
        }
    ]


    const setAgencyProfile = (values) => {
        console.log(values)
        FetchApi.post(agencyData.arID? UPDATE_AGENCY:SET_AGENCY, values, (status, data) => {
            if (status) {
                console.log(data)

                    setSubjectID(data.subjectID)
                    console.log(values)

                    getAgencyData()

                    // setAssociates({})

                    showSuccessAlert("SAVED SUCCESSFULLY")

                    updateProfileData()
                



            } else {
                showErrorAlert("SAVE FAILED")
            }
            
        })
    }


    useEffect(() => {

        getAgencyData()

    }, [])
    const getAgencyData = () => {
        if (id) {
            const requestBody = {
                userID: userID,
                subjectID: subjectID
            }
            console.log("What I'm sending", requestBody)

            FetchApi.post(GET_AGENCY, requestBody, (status, data) => {

                if (status) {

                    console.log("API DATA", data)
                    const agency = applySortFilter(data, getComparator(order, orderBy), filterName);
                    console.log("INFO:::", agency)
                    // const users = applySortFilter(data, getComparator(order, orderBy), filterName);
                    setFilteredUsers(agency)

                    setAllData(agency)
                    // setOtherResidents(residence)
                    // console.log("RESIDENCE", residence)

                    //ALSO UPDATE THE PROFILE CONTEXT



                } else {
                    console.log("some error occured")
                }
            })
        }
    }

    return (
        <Container>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2} sx={{ width: '100%' }}>

                        <Grid item md={12}>
                            <Card sx={{ width: '100%', paddingBottom: 3 }}>
                                <CardHeader
                                    title="Information from other Agencies"

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
                                            select
                                            label="Agency"
                                            {...getFieldProps('agency')}
                                            error={Boolean(touched.agency && errors.agency)}
                                            helperText={touched.agency && errors.agency}

                                        >
                                            {agency.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>








                                    </Stack>
                                </Stack>

                                <Stack spacing={3}>

                                    {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            label="Type of findings"
                                            {...getFieldProps('findings')}
                                            error={Boolean(touched.findings && errors.findings)}
                                            helperText={touched.findings && errors.findings}
                                        />

                                        <TextField
                                            fullWidth
                                            label="Details"
                                            {...getFieldProps('details')}
                                            error={Boolean(touched.details && errors.details)}
                                            helperText={touched.details && errors.details}
                                        />




                                    </Stack> */}
                                </Stack>

                                <Stack spacing={3} sx={{ marginTop: 3 }}>

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="Details"
                                            {...getFieldProps('details')}
                                            error={Boolean(touched.details && errors.details)}
                                            helperText={touched.details && errors.details}
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
                          attachments ? <Typography>{attachments[0].name}</Typography> : <Typography>{agencyData.attachments}</Typography>
                        }

                        
                        </Stack>

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>


                                        {/* <TextField
                                            fullWidth
                                            label="Offence"
                                            multiline
                                            rows={3}
                                            {...getFieldProps('findings')}
                                            error={Boolean(touched.findings && errors.findings)}
                                            helperText={touched.findings && errors.findings}

                                        /> */}
                                        


                                    </Stack>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>


                                        <TextField
                                            fullWidth
                                            label="Findings"
                                            multiline
                                            rows={3}
                                            {...getFieldProps('findings')}

                                        />


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
                                            const { arID,subjectID, agency, details, attachments, findings,
                                                remarks } = row;
                                            const isItemSelected = selected.indexOf(agency) !== -1;

                                            return (
                                                <TableRow
                                                    // hover
                                                    // key={arID}
                                                    // tabIndex={-1}
                                                    // role="checkbox"
                                                    // selected={isItemSelected}
                                                    // aria-checked={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            // onChange={(event) => handleClick(event, name)}
                                                        />
                                                    </TableCell>


                                                    <TableCell align="left">{agency}</TableCell>
                                                    <TableCell align="left">{findings}</TableCell>
                                                    
                                                    <TableCell align="left">{details}</TableCell>


                                                    <TableCell align="left">
                                                        <a href={attachments} target="_blank" rel="noopener noreferrer">{attachments}</a>
                                                    </TableCell>
                                                    
                                                    <TableCell align="left">{remarks}</TableCell>


                                                    <TableCell align="right">
                                                        <Button
                                                        onClick={() => setAgencyData(row)}
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