import * as Yup from 'yup';
import {
    CardHeader, Grid, Card, Button, CardContent,
    MenuItem, Stack, TextField, Container
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useFormik, Form, FormikProvider } from 'formik';
import { useAlert } from 'react-alert'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { FetchApi } from '../../api/FetchApi';
import { SET_PROFILE, GET_ONE_PROFILE, UPDATE_PROFILE, CREATE_INQUIRY } from 'src/api/Endpoints';
// import { useEffect } from 'react';
import { useContext } from 'react';
import { ProfileContext } from '../../context/ProfileContext';
import { UserContext } from '../../context/UserContext';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';



export default function BioData({ id, setProfileAdded, type, setCaseAdded, updateProfileData }) {

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

    const { userData } = useContext(UserContext)


    ////Consuming our profile context, this is done in all tabs
    const { profile, setProfile } = useContext(ProfileContext)

    const { setLoginStatus } = useContext(UserContext)
    const radioGroupRef = React.useRef(null);

    //default value is 'profile'
    //update the context by calling setProfile(profileData)
    //irregadless of where this is called, all components using 
    //ProfileContext are updated with the new value of profile


    const [profileData, setProfileData] = useState(profile) // using the Profile context value as the default value
    const [subjectId, setSubjectID] = useState(undefined)
    const [confirmBackgroundOpen, setConfirmBackgroundOpen] = useState(false)
    const [confirmVettingOpen, setConfirmVettingOpen] = useState(false)
    const [confirmPiOpen, setConfirmPiOpen] = useState(false)
    const [confirmLsaOpen, setConfirmLsaOpen] = useState(false)


  

    

    ////////////////////////////////////////////////
    // const convertToJscriptDate(()=>{})
    function formatDate(date) {
        var d = new Date(date)
         
    
        return d;
    }

    

    useEffect(() => {

        if (id) {
            const requestBody = {
                subjectID: "",
                idNo: id
            }
            console.log("What I'm sending", requestBody)

            FetchApi.post(GET_ONE_PROFILE, requestBody, (status, data) => {
                if (status) {

                    setProfileData(data)
                    console.log("PROFILE DATA ::::", data)
                    let dbob=formatDate(data.dob) 
                    setDbDob(dbob)

                    console.log("JDAte ",dbob)

                    //ALSO UPDATE THE PROFILE CONTEXT
                    setProfile(data)
                } else {
                    console.log("some error occured")
                }
            })
        }


        if (!type) {
            setProfile({})
            setProfileData({})
        }

    }, [])
    const[dbDob,setDbDob]=useState()
    const [dob, setValue] = useState(dbDob);
    
    console.log(dbDob,"DBDOOOOB")
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const stringRegExp= /^[aA-zZ\s]+$/
    const numericRegExp= /^[0-9]+$/
    const id_regex = /^[0-9]{1,9}$/
    const kra_regex = "/^[A]{1}[0-9]{9}[a-zA-Z]{1}$/"

    


    const RegisterSchema = Yup.object().shape({
        subject_name: Yup.string().required('First name required'),
        email: Yup.string().email('Email must be a valid email address'),
        idNo: Yup.string().required('ID Number is required').matches(id_regex,"Only valid Kenyan ID allowed"),
        street_name: Yup.string().max(50,"Too long!"),
        dob: Yup.date(),
        gender: Yup.string().required("select gender"),
        ethnicity: Yup.string().matches(stringRegExp,'No numbers allowed'),
        tel1: Yup.string().required("provide primary telephone number").matches(phoneRegExp, 'Please input valid mobile/telephone number'),
        tel2: Yup.string().matches(phoneRegExp, "Please input valid mobile/telephone number"),
        tel3: Yup.string(),
        nationality: Yup.string().max(50,"Too Long!"),
        county: Yup.string(),
        division: Yup.string(),
        location: Yup.string(),
        sub_location: Yup.string(),
        kra_pin: Yup.string().max(12,"Too Long!").matches(kra_regex, "Please input valid KRA pin"),
        occupation: Yup.string(),
        place_of_work: Yup.string(),
        height: Yup.string(),
        complexion: Yup.string(),
        other_description: Yup.string(),
        clan: Yup.string(),
        family: Yup.string(),
        twitter_username: Yup.string(),
        facebook_username: Yup.string(),
        place_of_birth: Yup.string(),
        remarks: Yup.string()
    });

    const formik = useFormik({
        initialValues: {
            subject_name: profileData.subject_Name || "",
            email: profileData.email || "",
            idNo: profileData.idNo || "",
            street_name: profileData.street_Name || "",
            dob: dbDob|| "",
            gender: profileData.gender || "Select Gender",
            ethnicity: profileData.ethnicity || "",
            tel1: profileData.tel1 || "",
            tel2: profileData.tel2 || "",
            tel3: profileData.tel3 || "",
            nationality: profileData.nationality || "",
            county: profileData.county || "",
            division: profileData.division || "",
            location: profileData.location || "",
            sub_location: profileData.sub_location || "",
            kra_pin: profileData.kra_pin || "",
            occupation: profileData.occupation || "",
            place_of_work: profileData.place_of_work || "",
            height: profileData.height || "",
            complexion: profileData.complexion || "",
            other_description: profileData.other_description || "",
            clan: profileData.clan || "",
            family: profileData.family || "",
            twitter_username: profileData.twitter_username || "",
            facebook_username: profileData.facebook_username || "",
            place_of_birth: profileData.place_of_birth || "",
            remarks: profileData.remarks || ""
        },
        validationSchema: RegisterSchema,
        enableReinitialize: true,
        onSubmit: (values) => {

            // Handle submission
            values.dob = dob;
            values.subjectID = profileData.subjectID

            if (!values.dob) {
                values.dob = profileData.dob
            }

            //console.log(values)
            console.log("VALUES ::", values)

            setSubjectProfile(values)


        },
        validator: () => { }
    });




    const setSubjectProfile = (values) => {
        console.log("VALUES:::", values)
        FetchApi.post(profileData.subjectID ? UPDATE_PROFILE : SET_PROFILE, values, (status, data) => {
            if (status) {
                setProfileData(data)

                setSubjectID(data.subjectID)
                showSuccessAlert("SAVED SUCCESSFULLY")

                setProfileAdded(data)

                updateProfileData()

                console.log("SAVED DATA ::::", data)

            } else {
                showErrorAlert("SAVE FAILED")
            }
        })
    }

    const openBackgroundCheck = (values) => {
        setConfirmBackgroundOpen(false)

        const postBody = {

            "subjectID": profileData.subjectID,
            "inquryType": "Background Check",
            "creator": userData.userID,
            "status": 1

        }

        console.log("POSTBODY::::", postBody)
        FetchApi.post(CREATE_INQUIRY, postBody, (status, data) => {
            if (status && data.status) {

                showSuccessAlert("SAVED SUCCESSFULLY")
                console.log("ENQUIRY DATA ::::", data)

                setCaseAdded(data)

            } else {
                showErrorAlert("CREATE SUBJECT FIRST")
            }
        })
    }
    const openVetting = (values) => {
        setConfirmVettingOpen(false)

        const postBody = {

            "subjectID": profileData.subjectID,
            "inquryType": "Vetting",
            "creator": userData.userID,
            "status": 1


        }
        console.log("POSTBODY::::", postBody)
        FetchApi.post(CREATE_INQUIRY, postBody, (status, data) => {
            if (status && data.status) {

                showSuccessAlert("SAVED SUCCESSFULLY")
               // console.log("ENQUIRY DATA ::::", data)

            } else {
                showErrorAlert("CREATE SUBJECT FIRST")
            }
        })
    }


    const openLifestyleAudit = (values) => {
        setConfirmLsaOpen(false)

        const postBody = {

            "subjectID": profileData.subjectID,
            "inquryType": "Lifestyle Audit",
            "creator": userData.userID,
            "status": 1
        }

        console.log("POSTBODY::::", postBody)
        FetchApi.post(CREATE_INQUIRY, postBody, (status, data) => {
            if (status && data.status) {

                showSuccessAlert("SAVED SUCCESSFULLY")
                console.log("ENQUIRY DATA ::::", data)

            } else {
                showErrorAlert("CREATE SUBJECT FIRST")
            }
        })
    }


    const openPI = (values) => {
        setConfirmPiOpen(false)

        const postBody = {

            "subjectID": profileData.subjectID,
            "inquryType": "Preliminary Investigation",
            "creator": userData.userID,
            "status": 1
        }

        console.log("POSTBODY::::", postBody)
        FetchApi.post(CREATE_INQUIRY, postBody, (status, data) => {
            if (status && data.status) {

                showSuccessAlert("SAVED SUCCESSFULLY")
                console.log("ENQUIRY DATA ::::", data)

            } else {
                showErrorAlert("CREATE SUBJECT FIRST")
            }
        })
    }
    const handleEntering = () => {
        if (radioGroupRef.current != null) {
          radioGroupRef.current.focus();
        }
    
      };


    const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

    // 
    const genders = [
        {
            value: 'Select Gender', label: 'Select Gender'
        },
        {
            value: 'M', label: 'M'
        },
        {
            value: 'F', label: 'F'
        }
    ]

    
    // Navigate to Profile
    // const navigateProfile = () => {
    //     navigate('/dashboard/profile/SP/' + subjectData.naID)
    //   };



    return (
        <Container>


            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2} sx={{ width: '100%' }}>

                        <Grid item md={12}>
                            <Card sx={{ width: '100%', paddingBottom: 3 }}>
                                <CardHeader
                                    title="Subject Options"
                                    action={
                                        <>
                                            {
                                                type == "SP" && <Button variant="contained"
                                                    sx={{ marginRight: 2, background: '#0090B2' }}
                                                    // onClick={openBackgroundCheck}
                                                    onClick={() => setConfirmBackgroundOpen(true)}
                                                >
                                                    Open BC Inquiry
                                                </Button>

                                            }



                                            {
                                                type == "SP" && <Button variant="contained"
                                                    sx={{ marginRight: 2, background: '#B29300' }}
                                                    onClick={() => setConfirmVettingOpen(true)}
                                                >Open Vetting Case</Button>

                                            }

                                            {
                                                type == "SP" && <Button variant="contained"
                                                    sx={{ marginRight: 2, background: '#E04800' }}
                                                    onClick={()=> setConfirmPiOpen(true)}
                                                >Open PI</Button>
                                            }

                                            {
                                                type == "PI" && <Button variant="contained"
                                                    sx={{ marginRight: 2, background: '#E04800' }}
                                                    onClick={()=> setConfirmLsaOpen(true)}
                                                >OPEN LSA CASE</Button>
                                            }

                                            {/* <Button variant="contained"
                                            sx={{ background: '#00B23A' }}
                                        >Create Task</Button> */}


                                            {/* <Button variant="contained"
                                                sx={{ marginRight: 1, background: '#1cac78' }}
                                                onClick={exportExcel}
                                            >XLS</Button> */}
                                        </>
                                    }
                                />
                            </Card>
                        </Grid>

                        <Grid item md={12} >
                            <Card sx={{ width: '100%', paddingBottom: 1 }}>
                                <CardHeader
                                    title="Bio Data"
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
                                                // disabled
                                                fullWidth
                                                label="Subject name"

                                                {...getFieldProps('subject_name')}
                                                error={Boolean(touched.subject_name && errors.subject_name)}
                                                helperText={touched.subject_name && errors.subject_name}
                                            />


                                            <TextField
                                                // disabled
                                                fullWidth
                                                label="National ID/ Passport No"
                                                {...getFieldProps('idNo')}
                                                error={Boolean(touched.idNo && errors.idNo)}
                                                helperText={touched.idNo && errors.idNo}
                                            />
                                        </Stack>



                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                                            <TextField
                                                fullWidth
                                                label="Alias/Street Name"
                                                {...getFieldProps('street_name')}

                                            />

                                            <LocalizationProvider
                                                dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                disableFuture
                                                    label="Date of Birth"
                                                    value={dob}
                                                    

                                                    onChange={(newValue) => {
                                                        setValue(newValue);
                                                    }
                                                   

                                                    }
                                                    renderInput={(params) => <TextField fullWidth {...params} />}
                                                />
                                            </LocalizationProvider>


                                            <TextField
                                            // disabled
                                                fullWidth
                                                select
                                                label="Gender"
                                                {...getFieldProps('gender')}

                                            >
                                                {genders.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>


                                            <TextField
                                                fullWidth
                                                label="Ethnicity"
                                                {...getFieldProps('ethnicity')}
                                                error={Boolean(touched.ethnicity && errors.ethnicity)}
                                                helperText={touched.ethnicity && errors.ethnicity}
                                            />




                                        </Stack>


                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                {...getFieldProps('tel1')}
                                                error={Boolean(touched.tel1 && errors.tel1)}
                                                helperText={touched.tel1 && errors.tel1}

                                            />


                                            <TextField
                                                fullWidth
                                                label="Alt Phone Number"
                                                {...getFieldProps('tel2')}

                                            />


                                            <TextField
                                                fullWidth
                                                label="Alt Phone Number 2"
                                                {...getFieldProps('tel3')}

                                            />

                                            <TextField
                                                fullWidth
                                                label="Email"
                                                {...getFieldProps('email')}

                                            />

                                        </Stack>

                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item md={12} >
                            <Card sx={{ width: '100%', paddingBottom: 1 }}>
                                <CardHeader
                                    title="Personal Profile"
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
                                                label="Nationality"
                                                {...getFieldProps('nationality')}

                                            />


                                            <TextField
                                                fullWidth
                                                label="County"
                                                {...getFieldProps('county')}

                                            />

                                            <TextField
                                                fullWidth
                                                label="Division"
                                                {...getFieldProps('division')}

                                            />

                                            <TextField
                                                fullWidth
                                                label="Location"
                                                {...getFieldProps('location')}

                                            />
                                        </Stack>



                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                                            <TextField
                                                fullWidth
                                                label="Sub Location"
                                                {...getFieldProps('sub_location')}

                                            />


                                            <TextField
                                                fullWidth
                                                label="KRA PIN"
                                                {...getFieldProps('kra_pin')}

                                            />


                                            <TextField
                                                fullWidth
                                                label="Occupation"
                                                {...getFieldProps('occupation')}

                                            />

                                            <TextField
                                                fullWidth
                                                label="Current Place of Work/Designation"
                                                {...getFieldProps('place_of_work')}

                                            />

                                        </Stack>

                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>







                        <Grid item md={12} >
                            <Card sx={{ width: '100%', paddingBottom: 1 }}>
                                <CardHeader
                                    title="Other Information"
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
                                                label="Height Description"
                                                {...getFieldProps('height')}

                                            />


                                            <TextField
                                                fullWidth
                                                label="Complexion Description"
                                                {...getFieldProps('complexion')}

                                            />

                                            <TextField
                                                fullWidth
                                                label="Other Physical Description"
                                                {...getFieldProps('other_description')}

                                            />

                                            <TextField
                                                fullWidth
                                                label="Clan"
                                                {...getFieldProps('clan')}
                                            />
                                        </Stack>



                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                                            <TextField
                                                fullWidth
                                                label="Place of Birth"
                                                {...getFieldProps('place_of_birth')}

                                            />


                                            <TextField
                                                fullWidth
                                                label="Family"
                                                {...getFieldProps('family')}

                                            />


                                            <TextField
                                                fullWidth
                                                label="Twitter Username"
                                                {...getFieldProps('twitter_username')}

                                            />


                                            <TextField
                                                fullWidth
                                                label="Facebook Username"
                                                {...getFieldProps('facebook_username')}

                                            />

                                            {/* <TextField
                                            fullWidth
                                            label="Current Place of Work/Designation"
                                            {...getFieldProps('division')}
                                            error={Boolean(touched.division && errors.division)}
                                            helperText={touched.division && errors.division}
                                        /> */}

                                        </Stack>

                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>



                        <Grid item md={12} >
                            <Card sx={{ width: '100%', paddingBottom: 1 }}>
                                <CardHeader
                                    title="Remarks"
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
                                                label="Remarks"
                                                multiline
                                                rows={3}
                                                {...getFieldProps('remarks')}

                                            />
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>


                    </Grid>

        {/* Submit for background checkDialog */}

        <Dialog
          sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 535 } }}
          maxWidth="sm"
          TransitionProps={{ onEntering: handleEntering }}
          open={confirmBackgroundOpen}
        >
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent dividers>

            <h4>Do you want to Open a Background Check? This action cannot be reversed.</h4>

          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setConfirmBackgroundOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => openBackgroundCheck()}>Confirm</Button>
          </DialogActions>
        </Dialog>


        {/* navigate('/dashboard/profile/SP/' + subjectData.naID) */}


        {/* Submit for vetting Dialog */}

        <Dialog
          sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 535 } }}
          maxWidth="sm"
          TransitionProps={{ onEntering: handleEntering }}
          open={confirmVettingOpen}
        >
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent dividers>

            <h4>Do you want to Open a Vetting? This action cannot be reversed.</h4>

          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setConfirmVettingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => openVetting()}>Confirm</Button>
          </DialogActions>
        </Dialog>


        {/* Submit for pi Dialog */}

        <Dialog
          sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 535 } }}
          maxWidth="sm"
          TransitionProps={{ onEntering: handleEntering }}
          open={confirmPiOpen}
        >
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent dividers>

            <h4>Do you want to Open a Preliminary Investigation? This action cannot be reversed.</h4>

          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setConfirmPiOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => openPI()}>Confirm</Button>
          </DialogActions>
        </Dialog>

         {/* Submit for Lsa Dialog */}

         <Dialog
          sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 535 } }}
          maxWidth="sm"
          TransitionProps={{ onEntering: handleEntering }}
          open={confirmLsaOpen}
        >
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent dividers>

            <h4>Do you want to Open a Lifestyle Audit Case? This action cannot be reversed.</h4>

          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setConfirmLsaOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => openLifestyleAudit()}>Confirm</Button>
          </DialogActions>
        </Dialog>

                </Form>
            </FormikProvider>


        </Container>



    )
}