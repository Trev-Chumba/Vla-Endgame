import { Container } from "@mui/material";
import * as Yup from 'yup';
import {
    CardHeader, Grid, Card, Button, CardContent,
    MenuItem, Stack, TextField
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { useFormik, Form, FormikProvider, Field } from 'formik';
import Page from '../components/Page';
import { useAlert } from 'react-alert'
import { FetchApi } from '../api/FetchApi';
import { FIND_USER_ID, GET_ALL_USER_GROUPS, GET_PRIVILEDGES, GET_PRIVILEDGES_GROUP, GIVE_PRIVILEDGES } from "src/api/Endpoints";
import { CREATE_USER, SET_USER_GROUP } from '../api/Endpoints';
import { UserContext } from '../context/UserContext';


export default function AccessManagement() {


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

    const [permissions, setPermissions] = useState([]);
    const [userGroupName, setUserGroupName] = useState("")
    const [userGroupDec, setUserGroupDesc] = useState("")
    const [userGroups, setUserGroups] = useState([])
    const [selectedUserGroup, setSelectedUserGroup] = useState({})

    const [checkedPermissions, setCheckedPermissions] = useState([])

    const { userData } = useContext(UserContext)
    const [userID, setUserID] = useState(userData.userID)


    useEffect(() => {
        getUserGroups()
        getPriveleges()
    }, [])



    const RegisterSchema = Yup.object().shape({
        permissions: Yup.array()

    });

    const formik = useFormik({
        initialValues: {
            permissions: checkedPermissions,
        },
        validationSchema: RegisterSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            values.userID=userID
            console.log(userID)


            const prevs = []


            permissions.forEach( permi => {

                prevs.push({ name : permi.priviledgeName, status: values.permissions.includes(permi.priviledgeName) ? 1 : 0})

            })

            const postBody = {
                userID:userID,
                groupID : selectedUserGroup.groupid,
                prevs: prevs
            }

            setUserGroupPermissions(postBody)

            // Handle submission
            console.log("VALUES::", JSON.stringify(postBody))


        },
        validator: () => { }
    });



    const handleSelect = (event) => {

        setSelectedUserGroup(event.target.value)
        getPermissionsForUserGroup(event.target.value)


    }



    const getPriveleges = () => {

        const postBody = {
            userID: userData.userID
        }

        FetchApi.post(GET_PRIVILEDGES, postBody, (status, data) => {
            setPermissions(data)
        })

    }


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



    const addUserGroup = () => {


        if (userGroupName && userGroupDec) {

            const postBody = {
                userID:userID,
                groupName: userGroupName,
                groupDisp: userGroupDec
            }

            FetchApi.post(SET_USER_GROUP, postBody, (status, data) => {

                console.log("ADD GROUP RESP", data)

                if (status) {
                    getUserGroups()
                    setUserGroupName("")
                    setUserGroupDesc("")
                } else {
                 
                    showErrorAlert("Cannot Add Group");
                }

            })

        }


    }



    const setUserGroupPermissions = (values) => {

        FetchApi.post(GIVE_PRIVILEDGES, values, (status, data) => {

            console.log("SET P RESP",data)

            if (status) {

                showSuccessAlert("Priviledge Saved Success");

            } else {
                showErrorAlert("Unable to Save Priviledge");
            }

        })

    }



    const getPermissionsForUserGroup = (value) => {

        const postBody = {
            groupID: value.groupid,
         
        }

        console.log("SENDING", postBody)

        FetchApi.post(GET_PRIVILEDGES_GROUP, postBody, (status, data) => {

            console.log("GET RESP", data)

            const perms = []

            data.forEach( perm => {

               if(perm.status){
                   perms.push(perm.priviledgeName)
               }

            })

            setCheckedPermissions(perms)


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
                                    title="Add User Group"
                                />

                                <CardContent>
                                    <Stack spacing={3}>

                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                            <TextField
                                                fullWidth
                                                label="User Group Name"
                                                onChange={(event) => setUserGroupName(event.target.value)}
                                            />

                                            <TextField
                                                fullWidth
                                                label="User Group Description"
                                                onChange={(event) => setUserGroupDesc(event.target.value)}
                                            />

                                            <Button variant="contained"
                                                sx={{ background: '#00B23A' }}
                                                onClick={() => addUserGroup()}
                                            >Add</Button>


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
                                        title="Set Access Rights for UserGroup"
                                        action={

                                            <Button
                                                onClick={handleSubmit}
                                                variant="contained" >Save</Button>
                                        }
                                    />
                                    <CardContent>

                                        <TextField
                                            fullWidth
                                            select
                                            label="Select User Group to Set Permission"
                                            onChange={(event) => handleSelect(event)}

                                        >
                                            {userGroups.map((option) => (
                                                <MenuItem key={option.groupName} value={option}>
                                                    {option.groupName + " - " + option.groupDisp}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        {/* <CardHeader
                                            title="Set Access Rights"

                                        /> */}

                                        <h4 style={{ margin: 10 }} >Set Access Rights</h4>

                                        <Container maxWidth="xl">
                                            <Grid container spacing={3} role="group">

                                                {
                                                    permissions.map(permi => {
                                                        return(
                                                        <Grid item xs={12} sm={6} md={3}>
                                                            <label>
                                                                <Field type="checkbox" name="permissions" value={permi.priviledgeName} />
                                                                {permi.priviledgeName}
                                                            </label>
                                                        </Grid>
                                                        )
                                                    })
                                                }



                                            </Grid>

                                        </Container>


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