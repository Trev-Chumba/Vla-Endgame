import * as Yup from 'yup';
import {
  CardHeader,
  Grid,
  Card,
  Button,
  CardContent,
  Typography,
  Stack,
  TextField,
  Avatar,
  CardActions,
  TextareaAutosize,
  Step
} from '@mui/material';
import React, { useState, useContext, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useAlert } from 'react-alert';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { FetchApi } from 'src/api/FetchApi';
import { BASE_URL, UPDATE_CASE } from 'src/api/Endpoints';
import { UserContext } from 'src/context/UserContext';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import {TRANSFER_CASE } from 'src/api/Endpoints';
import { values } from 'lodash';
import { useNavigate } from 'react-router-dom';
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import "../../../../vla-test/node_modules/suneditor/dist/css/suneditor.min.css";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const recomentation = [
  'The case be referred to EACC/ARA for further investigations/recovery of unexplained wealth and possible criminal prosecution, if any',
  'Recommended for tax profiling',
  'Commissioner; DTD to institute an in-depth tax fraud investigation on the subject with a view of recovering the taxes due',
  'Commissioner; C&BC to institute an in-depth tax fraud investigation on the subject with a view of recovering the taxes due',
  'Commissioner; Investigation & Enforcement to institute an in-depth tax fraud investigation on the subject’s company with a view of recovering the taxes due',
  'Commissioner; Investigation & Enforcement to institute an in-depth tax fraud investigation on the subject’s associates with a view of recovering the taxes due',
  'Commissioner; Investigation & Enforcement to institute an in-depth tax fraud investigation on the subject with a view of recovering the taxes due',
  'IIU to carry out investigations on possible breaches of the Authority’s Code of Conduct by the subject',
  'The report is submitted for closure , unless new evidence emerges',
  'The report is submitted for consideration in the recruitment process',
  'The report is submitted for consideration in the deployment process',
  'Other Recommendations (Describe below)'
];
const findings2 = [
  'No adverse report',
  'Adverse report',
  'Adverse report-Pending tax issues',
  'Adverse report-Listed in CRB as non compliant',
  'Adverse report- Negative response from previous employer',
  'Adverse report- Non disclosure of information',
  'Adverse report- Disciplinary Issue',
  'Adverse report- Performance issue',
  'Inconclusive report due to ongoing inquiry',
  'Inconclusive report due to missing Personnel file',
  'Inconclusive report due to non-commissioned Background check authorization form',
  'Inconclusive report due to missing Background check authorization form'
];

const vettingTypes = [
  
  {
    label: 'Promotion',
    value: 'Promotion'
  },
  {
    value: 'Deployment',
    label: 'Deployment'
  },
  {
    value: 'Contract Renewal',
    label: 'Contract Renewal'
  },
  {
    value: 'Resignation',
    label: 'Resignation'
  },
  {
    value: 'Retirement',
    label: 'Retirement'
  },
  {
    value: 'Appointment',
    label: 'Appointment'
  },
  {
    value: 'Conversions',
    label: 'Conversions'
  }
];

export default function Closing({ details, updateProfileData }) {
  //Multiselect checkbox
 
  const [personName, setPersonName] = React.useState([]);
  const [findingName, setFindingName] = React.useState([]);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = React.useState(false)
  const caseD = {}
  const [caseData, setCaseData] = React.useState(caseD)
 // const [caseT, setCaseT] = React.useState(false)
  const { userData } = useContext(UserContext);
  const radioGroupRef = React.useRef(null);
  const [save, setSave] = useState(false)
  const [rev, setRev] = useState(false)
  const [findings, setFindings] = useState('')
  
 console.log('Ne case det', details,userData.userID, details.status, details.assignee, details.recomentation,)

  const handleChangeRec = (event) => {
    const {
      target: { value }
    } = event;

    details.recomentation = event.target.value    
    setPersonName(
      // On autofill we get a stringified value.
       typeof value === 'string' ? value.split(',') : value
    
    );

    console.log(details.recomentation, "Tax profile")
  };
  const handleChangeFind = (event) => {
    const {
      target: { value }
    } = event;

    setFindingName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const changeLabel = (status) => {
    switch (caseD.status) {
      case "2": setMCaseStatus("In Progress"); setMCaseLabel("info"); break;
      case "3": setMCaseStatus("In Review"); setMCaseLabel("primary"); break;
      case "4": setMCaseStatus("Complete"); setMCaseLabel("error"); break;
      case "5": setMCaseStatus("Re-Opened"); setMCaseLabel("info"); break;
    }

  }


  const [showPassword, setShowPassword] = useState(false);
  const alert = useAlert();

  const showInfoAlert = (message) => {
    alert.info(message)
  }
  const showAlert = () => {
    alert.success('SAVED SUCCESSFULLY');
  };
  const showErrorAlert = () => {
    alert.success('Did not save');
  };
  const RegisterSchema = Yup.object().shape({
    remarks: Yup.string(),
    cFindings: Yup.string(),
    findings: Yup.string(),
    forward: Yup.string(),
    narration: Yup.string(),
    introduction: Yup.string()
  });


const [val, setVal] = React.useState()
  const formik = useFormik({
    initialValues: {
      remarks:  values.remarks || '',
      cFindings: '' ,
      findings:  '' || findings
    },
    enableReinitialize: true,
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      (values.recomentation = personName.join('\n')), (values.cFindings = findingName.join('\n'));

      console.log(save, "save state", rev, "rev state")
    //   if(save)
    //   {
    //     if(rev)
    //     { 
    //       console.log("send review", values)
    //       sendReview(values);
    //     }
    //    else{ 
    //     console.log("send save", values)
    //     handleSave(values);
    //   }
    //   }else
    //  { 
    //   console.log("send close", values)
    //   updateCaseData(values);
    //  }
    }
    
  });
  
  const updateCaseData = (values) => {
    details.recomentation = values.recomentation;
    details.findings = findings; 
    details.remarks = values.remarks;
    details.userID = userData.userID;
    details.status = 4;
    details.inquiryID = details.iquiryid;
    details.cFindings = personName;
    details.narration = values.narration;
    details.rto = details.rto;
    details.rfrom = details.rfrom;

    console.log('SENDING', details);

    FetchApi.post(UPDATE_CASE, details, (status, data) => {
      if (status) {
        console.log('TRFR RESP', data);
        showInfoAlert('Closed Succefully');
        navigate('/dashboard/my-inquiries/')
        updateProfileData();
      }
    });
  };

  const handleSave = (values) =>
  {
    console.log("heree", personName)
    details.recomentation = values.recomentation;
    details.findings = findings;
    details.remarks = values.remarks;
    details.userID = userData.userID;
    details.status = 2;
    details.inquiryID = details.iquiryid;
    details.cFindings = personName;
    details.rto = details.rto;
    details.narration = values.narration;
    details.rfrom = details.rfrom;

    console.log('SENDING', details);

    FetchApi.post(UPDATE_CASE, details, (status, data) => {
      if (status) {
        console.log('TRFR RESP', data, status);
        showAlert();
        updateProfileData();
        
      }
    });
  }
  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }

  };
  const navigate = useNavigate()
  const tranferCase = (postBody, isNew) => {

    FetchApi.post(UPDATE_CASE, postBody, (status, data) => {
      console.log(data)

      if (status && data.status) {
        showInfoAlert("Case Assigned Successfully")
        console.log("treee::", data, status)
        postBody.inquryID = postBody.inquiryID
        setCaseData(postBody)
        changeLabel(postBody.status)
        navigate('/dashboard/my-inquiries/')

      } else
       {
        showInfoAlert("Failed")
      }
    })

  }
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

console.log('Ne case det', details,userData.userID, details.status, details.assignee, details.recomentation, formik.values)
  const sendReview = (values) => {
    console.log("heree", personName)
    details.recomentation = values.recomentation;
    details.findings = findings;
    // details.remarks = values.remarks;
    details.userID = userData.userID;
    details.status = 3;
    details.inquiryID = details.iquiryid;
    details.cFindings = personName;
    details.rto = details.rto;
    // details.narration = values.narration;
    details.rfrom = details.rfrom;

    setConfirmSubmitOpen(false)

    const postBody = {
      subjectID: details.subjectID,
      recipientID: details.assigneee,
      status: "3",
      inquiryID: Number.parseInt(details.inquryID),
      userID: userData.userID
    }
    tranferCase(details, true)
  }
  
  const halex=()=>{
     useEffect(()=>{
      setSave(true)
  }, [])
      
  }
  const halex2 = () =>
  {
    useEffect(()=>{
    setSave(false)
    }, [])
  }

  const handlesun = (content) => {
    
    console.log(content, 'sun log content');

    setFindings(content);
    
  };

  return (
    <FormikProvider value={formik}>
       <Dialog
          sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 535 } }}
          maxWidth="sm"
          TransitionProps={{ onEntering: handleEntering }}
          open={confirmSubmitOpen}
        >
          <DialogTitle>Confirm Submit</DialogTitle>
          <DialogContent dividers>

            <h4>do you want to submit for review? This action cannot be reversed.
              Make sure you have saved first!!!
            </h4>
            
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setConfirmSubmitOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {sendReview(formik.values);setConfirmSubmitOpen(false)}}>Confirm</Button>
          </DialogActions>
        </Dialog>

      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid item md={12}>
            <Card sx={{ width: '100%', paddingBottom: 3 }}>
              <CardHeader
                title="Findings"
                // action={
                //     <>
                //         <Button variant="contained"
                //             sx={{ marginRight: 2, background: '#0090B2' }}
                //         >Add New</Button>
                //         <Button variant="contained"
                //             sx={{ background: '#00B23A' }}
                //         >Create Task</Button>
                //     </>
                // }
              />

              <CardContent>
                <Stack spacing={3}>
                  {details.inquiryType == 'Vetting' && (
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Introduction"
                        multiline
                        rows={3}
                        {...getFieldProps('introduction')}
                      />
                    </Stack>
                  )}
                  {details.inquiryType == 'Vetting' && (
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        defaultValue= "Choose"
                        select
                        label="Type of Vetting"
                        {...getFieldProps('type')}
                      >
                        <MenuItem disabled value = "Choose">Choose Vetting type</MenuItem>
                        {vettingTypes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>

                      {/* <FormControl sx={{ m: 1, width: 1000 }}>
                        <InputLabel id="findings-multiple-checkbox-label">
                          Summary of Findings
                        </InputLabel>
                        <Select
                          labelId="findings-multiple-checkbox-label"
                          id="findings-multiple-checkbox"
                          multiple
                          value={findingName}
                          onChange={handleChangeFind}
                          input={<OutlinedInput label="findings" />}
                          renderValue={(selected) => selected.join(', ')}
                          MenuProps={MenuProps}
                        >
                          {findings.map((name) => (
                            <MenuItem key={name} value={name}>
                              <Checkbox checked={findingName.indexOf(name) > -1} />
                              <ListItemText primary={name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl> */}
                    </Stack>
                  )}

                  {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <FormControl sx={{ m: 1, width: 1000 }}>
                      <InputLabel id="findings-multiple-checkbox-label">
                        Summary of Findings
                      </InputLabel>
                      <Select
                        labelId="findings-multiple-checkbox-label"
                        id="findings-multiple-checkbox"
                        multiple
                        value={findingName}
                        onChange={handleChangeFind}
                        input={<OutlinedInput label="findings" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                      >
                        {findings2.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={findingName.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack> */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    {/* <TextField
                      fullWidth
                      label="Findings"
                      multiline
                      rows={3}
                      {...getFieldProps('findings')}
                    /> */}
                      {/* <SunEditor
                setOptions={{
                 
                  buttonList: [
                    ["font", "fontSize", "formatBlock"],
                    [
                      "bold",
                      "underline",
                      "italic",
                      "strike",
                      "subscript",
                      "superscript",
                    ],
                    ["align", "horizontalRule", "list", "table"],
                    ["fontColor", "hiliteColor"],
                    ["outdent", "indent"],
                    ["undo", "redo"],
                    ["removeFormat"],
                    ["outdent", "indent"],
                    ["link"]],
      
                    attributesWhitelist: {
                      table: "style",
                      tbody: "style",
                      thead: "style",
                      tr: "style",
                      td: "style"
                    }
                  
                  }
                  
                }
                
                onChange = {handlesun}
                onDrop={e => {e.preventDefault()}}
                setContents= {details.findings}
                /> */}
                  </Stack>
                { details.inquiryType == 'Lifestyle Audit' && (
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Narration"
                      multiline
                      rows={3}
                      {...getFieldProps('narration')}
                    />
                  </Stack>
                )}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <FormControl sx={{ m: 1, width: 1000 }}>
                      <InputLabel id="recomentation-multiple-checkbox-label">
                        Recommendations
                      </InputLabel>
                      <Select
                        labelId="recomentation-multiple-checkbox-label"
                        id="recommendations-multiple-checkbox"
                        multiple
                        value={personName}
                        onChange={handleChangeRec}
                        input={<OutlinedInput label="recommendations" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                      >
                        {recomentation.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={personName.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>

                  {details.inquiryType =="Vetting" || details.inquiryType == "Preliminary Investigation" && <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Way Forward"
                      multiline
                      rows={3}
                      {...getFieldProps('forward')}
                    />
                  </Stack>}


                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Remarks"
                      multiline
                      rows={3}
                      {...getFieldProps('remarks')}
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant="contained" style={{ height: 50 }} 
                 
                  onClick={() => handleSave(formik.values)}>
                      Save
                    </Button>
                    { details.owner == userData.userID &&
                      <Button variant="contained"  style={{ height: 50 }}  onClick={() => updateCaseData(formik.values)}>
                      CLOSE
                    </Button>}
                    {
                      details.status != "3" && details.assignee == userData.userID &&
                      <Button variant="contained"
                       
                        sx={{ marginLeft: 2, background: '#20b2aa' }}
                        onClick={() => setConfirmSubmitOpen(true)}
                      > Submit For Review
                      </Button>
                    }

                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
