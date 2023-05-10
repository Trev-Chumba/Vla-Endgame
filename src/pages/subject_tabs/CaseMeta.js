import * as Yup from 'yup';
import {
    Grid, Card, Button, CardContent, Stack, TextField, Typography
} from "@mui/material";
import React, { useState, useContext } from "react";
import { useFormik, Form, FormikProvider } from 'formik';
import { useAlert } from 'react-alert';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { FetchApi } from 'src/api/FetchApi';
import { BASE_URL, UPDATE_CASE } from 'src/api/Endpoints';
import { UserContext } from 'src/context/UserContext';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};



export default function CaseMeta({ details, updateProfileData }) {

    const [attachments, setAttachment] = useState(undefined)
    const { userData } = useContext(UserContext)


    const handleChangeRec = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );


    };

    const handleChangeFind = (event) => {
        const {
            target: { value },
        } = event;

        setFindingName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );

    };

    const alert = useAlert();

  const showAlert = () => {
    alert.success('SAVED SUCCESSFULLY');
  };
  const showErrorAlert = () => {
    alert.success('Did not save');
  };
  const RegisterSchema = Yup.object().shape({
    source: Yup.string(),
    reasons: Yup.string(),
    esummary: Yup.string(),
    commissioner: Yup.string(),
    rto: Yup.string(),
    rfrom: Yup.string(),
    date: Yup.string(),
    reference: Yup.string(),
    subject: Yup.string(),
    objectives: Yup.string(),
    position: Yup.string(),
    candidateType: Yup.string(),
    through: Yup.string()
  });

    const formik = useFormik({
        initialValues: {
            source: details.cSource || "",
            reasons: details.cReasons || "",
            esummary: details.esummary || "",
            objectives: details.objectives || "",
            commissioner: details.commissioner || "Select Commissioner",
            rto: details.rto || "",
            rfrom: details.rfrom || "",
            date: details.date || "",
            reference: details.reference || "",
            subject: details.subject || "",
            attachments: details.attachments || "",
            position: details.position || "",
            candidateType: details.candidateType || "",
            through:details.through||""


        },
        validationSchema: RegisterSchema,
        enableReinitialize: true,
        onSubmit: (values) => {


            //upload any files

            if (attachments) {

                const formData = new FormData();
                formData.append("file", attachments[0])

                FetchApi.upload(formData, (status, data) => {

                    if (status) {
                        const fileUrl = BASE_URL + "/" + data.url;
                        values.attachments = fileUrl

                        updateCaseData(values)

                        setAttachment(undefined)
                    } else {
                        showErrorAlert("SAVE FAILED")
                    }

                })


            } else {

                updateCaseData(values)
            }

        }
    });


    const updateCaseData = (values) => {

        console.log("DETAILS VALUES", values)
        console.log("INQID", details.inquiryID)
        if (values.commissioner) {
            details.commissioner = 1
        }

    details.cReasons = values.reasons;
    details.cSource = values.source;
    details.esummary = values.esummary;
    details.objectives = values.objectives;
    details.userID = userData.userID;
    details.inquiryID = details.iquiryid;
    details.rto = values.rto;
    details.cFindings = [],
    (details.rfrom = values.rfrom),
      (details.date = values.from),
      (details.subject = values.subject),
      (details.reference = values.reference),
      (details.attachments = values.attachments),
      (details.position = values.position),
      (details.candidateType = values.candidateType),
      (details.through = values.through);

        console.log("SENDING", details)

        FetchApi.post(UPDATE_CASE, details, (status, data) => {
            if (status) {
                console.log("TRFR RESP", data)
                showAlert()

                updateProfileData()
            }
        })
    }


    const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;


    const personType = [
        {
            value: 'Select Commissioner', label: 'Select Commissioner'
        },
        {
            value: 1, label: 'Comm 1'
        },
        {
            value: 2, label: 'Comm 2'
        },
        {
            value: 3, label: 'Comm 3'
        },
    ]

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2} sx={{ width: '100%' }}>

                    <Grid item md={12}>
                        <Card sx={{ width: '100%', paddingBottom: 3 }}>

                            <CardContent>
                                <Stack spacing={3}>

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                                        <FormControl sx={{ m: 1, width: 1100 }}>
                                            <TextField
                                                fullWidth
                                                label="To"
                                                {...getFieldProps('source')}

                                            />
                                        </FormControl>
                                    </Stack>

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                                        <FormControl sx={{ m: 1, width: 1100 }}>
                                            <TextField
                                                fullWidth
                                                label="Thro'"
                                                {...getFieldProps('through')}

                                            />
                                        </FormControl>
                                    </Stack>

                                    {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                                         <FormControl sx={{ m: 1, width: 1100 }}>
                                            <TextField
                                                fullWidth
                                                label="From"
                                                {...getFieldProps('rfrom')}

                                            />
                                        </FormControl> 
                                    </Stack> */}

                                    {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                                         <FormControl sx={{ m: 1, width: 1100 }}>
                                            <TextField
                                                fullWidth
                                                label="To"
                                                {...getFieldProps('rto')}

                                            />
                                        </FormControl> 
                                    </Stack> */}

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                                        <FormControl sx={{ m: 1, width: 1100 }}>
                                            <TextField
                                                fullWidth
                                                label="From"
                                                {...getFieldProps('subject')}

                                            />
                                        </FormControl>
                                    </Stack>

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                                        <FormControl sx={{ m: 1, width: 1100 }}>
                                            <TextField
                                                fullWidth
                                                label="Reference"
                                                {...getFieldProps('reference')}

                                            />
                                        </FormControl>
                                    </Stack>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                                        <FormControl sx={{ m: 1, width: 1100 }}>
                                            <TextField
                                                fullWidth
                                                label="Position"
                                                {...getFieldProps('position')}

                                            />
                                        </FormControl>
                                    </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <FormControl sx={{ m: 1, width: 1100 }}>
                      <TextField fullWidth label="Internal/External" {...getFieldProps('candidateType')} />
                    </FormControl>
                  </Stack>

                  <FormControl sx={{ m: 1, width: 1000 }}>
                    <TextField
                      fullWidth
                      label="Reasons for BC/VT/LSA"
                      multiline
                      rows={3}
                      {...getFieldProps('reasons')}
                    />
                  </FormControl>
                  <Stack></Stack>
                    {details.inquiryType != 'Vetting' && details.inquiryType != 'Background Check' &&<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Executive Summary"
                        multiline
                        rows={3}
                        {...getFieldProps('esummary')}
                      />
                    </Stack>}
                  {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Introduction"
                      multiline
                      rows={3}
                      {...getFieldProps('introduction')}
                    />
                  </Stack>
                  {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Objectives"
                      disabled="true"
                      multiline
                      rows={3}
                      {...getFieldProps('objectives')}
                    />
                  </Stack> */}

                                    {/* 
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Commissioner"
                                            {...getFieldProps('commissioner')}

                                        >
                                            {personType.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack> */}


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
                                            attachments ? <Typography>{attachments[0].name}</Typography> : <Typography>No attachment added</Typography>
                                        }
                                    </Stack>

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>


                                        <Button
                                            variant="contained"
                                            // sx={{ background: '#009900' }}
                                            onClick={() => handleSubmit()}
                                        >SAVE</Button>
                                    </Stack>

                                </Stack>

                            </CardContent>


                        </Card>
                    </Grid>

                </Grid>
            </Form>
        </FormikProvider>
    )

}