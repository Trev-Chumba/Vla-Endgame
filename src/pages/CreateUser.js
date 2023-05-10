import { Container } from "@mui/material";
import * as Yup from 'yup';
import {
    CardHeader, Grid, Card, Button, CardContent,
    MenuItem, Stack, TextField
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { useFormik, Form, FormikProvider } from 'formik';
import Page from '../components/Page';
import { useAlert } from 'react-alert'
import { FetchApi } from '../api/FetchApi';
import { FIND_USER_ID } from "src/api/Endpoints";
import { CREATE_USER, GET_ALL_USER_GROUPS } from '../api/Endpoints';
import { UserContext } from 'src/context/UserContext';

export default function CreateUser() {


    const alert = useAlert();

    const showInfoAlert = (message) => {
        alert.info(message)
    }

    const showErrorAlert = (message) => {
        alert.error(message)
    }

    const showSuccessAlert = (message) => {
        alert.success(message)
    }

    const [userProfile, setUserProfile] = useState({});
    const [idNo, setidNo] = useState("")
    const [userGroups, setUserGroups] = useState([])

    const { userData } = useContext(UserContext)
  
    const [userID, setUserID] = useState(userData.userID)


    useEffect(()=> { 
        getUserGroups()
    }, [])


    const RegisterSchema = Yup.object().shape({
        idNo: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('ID Number name required'),
        staffNO: Yup.string(),
        firstName: Yup.string(),
        lastName: Yup.string(),
        regionName: Yup.string(),
        department: Yup.string(),
        status: Yup.string(),
        userGroup: Yup.string().required("Select User Group"),
        tell: Yup.string(),
        email: Yup.string()

    });

    const formik = useFormik({
        initialValues: {
            idNo: userProfile.IDNUMBER || "",
            staffNO: userProfile.EMPNO || "",
            firstName: userProfile.SURNAME || "",
            lastName: userProfile.OTHERNAMES || "",
            regionName: userProfile.REGIONNAME || "",
            department: userProfile.DEPTNAME || "",
            status: userProfile.STATUS || "active",
            userGroup: userProfile.userGroup || "Select User Group",
            tell: "0987654444",
            email: "cmurilla@mm.cc"


        },
        validationSchema: RegisterSchema,
        enableReinitialize: true,
        onSubmit: (values) => {

            values.userID=userID

            // Handle submission
            console.log("VALUES::", values)

            setUser(values)

        },
        validator: () => { }
    });



    const searchUserFromAD = () => {

        const postBody = {
                idNo: idNo,
                userID:userID
                // phonenumber: "",
                // id_type: "ID",
                // channel: "mobile"
        }

        FetchApi.post(FIND_USER_ID, postBody, (status, data) =>{

            console.log(data)

            if(status && data.StaffDetails.RESULT.CODE){
                setUserProfile(data.StaffDetails.STAFF)
            }else{
                setUserProfile({})
                showErrorAlert("User Not Found in iSupport");
            }

        })


    }


    const setUser = (values) => {

        FetchApi.post(CREATE_USER, values, (status, data) => {

            console.log(data)

            if(status){

                showSuccessAlert("User Saved Success");

            }else{
                showSuccessAlert("User Saved Success");
            }

        })

      if (status) {
        showSuccessAlert('User Saved ');
      } else {
        showSuccessAlert('User could not be found');
      }
    });
  };

    const getUserGroups = () => {

        const postBody = {
            userID: userData.userID
        }

        FetchApi.post(GET_ALL_USER_GROUPS, postBody, (status, data) => {

            console.log("ALL GROUP RESP", data)

            if (status) {
                setUserGroups(data)
            }
        })

    }

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;



    return (
        <Page>
            <Container>
                <form >
                    <Grid container spacing={2} sx={{ width: '100%' }}>

                        <Grid item md={12}>
                            <Card sx={{ width: '100%', paddingBottom: 3 }}>
                                <CardHeader
                                    title="Add User - Search with Personal Number"
                                />

                                <CardContent>
                                    <Stack spacing={3}>

                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                            <TextField
                                                fullWidth
                                                label="User ID Number"
                                                onChange={(event) => setidNo(event.target.value)}
                                            />

                                            <Button variant="contained"
                                                sx={{ background: '#00B23A' }}
                                                onClick={() => searchUserFromAD()}
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
                                        title="User Details"
                                        action={

                                            <Button
                                                onClick={handleSubmit}
                                                variant="contained" >Save</Button>
                                        }
                                    />
                                    <CardContent>

                                        <Stack spacing={3}>
                                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                                <TextField
                                                    fullWidth
                                                    label="User firstName"

                                                    {...getFieldProps('firstName')}
                                                    error={Boolean(touched.firstName && errors.firstName)}
                                                    helperText={touched.firstName && errors.firstName}
                                                />


                                                <TextField
                                                    fullWidth
                                                    label="Other Names"
                                                    {...getFieldProps('lastName')}
                                                    error={Boolean(touched.lastName && errors.lastName)}
                                                    helperText={touched.lastName && errors.lastName}
                                                />

                                                <TextField
                                                    fullWidth
                                                    disabled
                                                    label="National ID/ Passport No"
                                                    {...getFieldProps('idNo')}
                                                    error={Boolean(touched.idNo && errors.idNo)}
                                                    helperText={touched.idNo && errors.idNo}
                                                />
                                            </Stack>
                                        </Stack>


                                        <Stack spacing={3} sx={{marginTop: 2 }}>
                                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                                <TextField
                                                    fullWidth
                                                    label="Region Name"

                                                    {...getFieldProps('regionName')}
                                                    error={Boolean(touched.regionName && errors.regionName)}
                                                    helperText={touched.regionName && errors.regionName}
                                                />


                                                <TextField
                                                    fullWidth
                                                    label="DepartMent Name"
                                                    {...getFieldProps('department')}
                                                    error={Boolean(touched.department && errors.department)}
                                                    helperText={touched.department && errors.department}
                                                />

                                                <TextField
                                                    fullWidth
                                                    select
                                                    label="User Group"
                                                    {...getFieldProps('userGroup')}

                                                >
                                                    {userGroups.map((option) => (
                                                        <MenuItem key={option.groupid} value={option.groupid}>
                                                            {option.groupName}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Stack>
                                        </Stack>


                                    </CardContent>


                                </Card>

                            </Grid>

                        </Grid>

                    </Form>

                </FormikProvider>











            </Container>
        </Page>
    )
}