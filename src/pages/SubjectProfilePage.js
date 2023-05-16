import React, { useState, useEffect, useContext } from 'react';
// material
import {
  Box, Container, Tabs, Tab, Grid, Typography, FormControlLabel,
  Card, CardHeader, Stack, Checkbox, TextareaAutosize
} from '@mui/material';
import { useParams } from 'react-router-dom';

import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';

// components
import Page from '../components/Page';
import BioData from './subject_tabs/BioData';
import ResidentialProfile from './subject_tabs/ResidentialProfile';
import SecondaryInformation from './subject_tabs/SecondaryInformation';
import AssociatesProfiles from './subject_tabs/AssociatesProfiles';
import BusinessInterests from './subject_tabs/BusinessInterest';
// import Travels from './subject_tabs/Travels';
import Expenses from './subject_tabs/Expenses';
import Assets from './subject_tabs/Assets';
import Liabilities from './subject_tabs/Liabilities';
import IntegrityIssues from './subject_tabs/IntegrityIssues';
import Employment from './subject_tabs/Employment';
import TaxIssues from './subject_tabs/TaxIssues';
import { UserContext } from 'src/context/UserContext';
import { useAlert } from 'react-alert'
// import { useParams } from 'react-router-dom';
import { ProfileContextProvider } from '../context/ProfileContext';
import DeclarationsProfile from './subject_tabs/DeclarationsProfile';
import FinancesProf from './subject_tabs/FinancesProf';
import { FetchApi } from 'src/api/FetchApi';
import { GET_ALL_USERS, GET_CASE_DETAILS, GET_ONE_PROFILE, TRANSFER_CASE } from 'src/api/Endpoints';
import Closing from './subject_tabs/Closing';
import OtherAgencyInfo from './subject_tabs/OtherAgencyInfo';
import Label from '../components/Label';
import { BACKGROUND_CHECK_TYPE, PI_TYPE, LSA_TASKS, LSA_TYPE, VETTING_TASKS } from 'src/constants/Constants';
import { BC_TASKS, PI_TASKS, VETTING_TYPE } from '../constants/Constants';
import { CREATE_TASK, PRINT_CASE } from '../api/Endpoints';
import CaseMeta from './subject_tabs/CaseMeta';
import LSAExport from 'src/components/export/LSAExport';
import BcAndVtExPort from 'src/components/export/BcAndVtExport';

import { Document } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { ProfileContext } from 'src/context/ProfileContext';
import PIExport from 'src/components/export/PIExport';
import SubjectProfiles from './User';
import { render } from 'react-dom';



function TabPanel(props) {

  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ width: '100%' }}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


export default function SubjectProfilePage() {

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

  const [activeTab, setActiveTab] = useState(0);

  let { id, type } = useParams()

  const [users, setUsers] = useState([])

  const [selectedUser, setSelectedUser] = useState("")

  const [open, setOpen] = useState(false)

  const { userData } = useContext(UserContext)

  const pContext = useContext(ProfileContext)

  const subProfile = pContext.profile

 

  const radioGroupRef = React.useRef(null);

  const [profile, setProfile] = useState({})

  const [ammendDialogOpen, setAmmendDialogOpen] = useState(false)
  const [ thiscasedata, setthisData] = useState('')
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false)

  const [fieldsToAmment, setFieldsToAmment] = useState([])

  const [reRemark, setRevRemark] =  useState("")


  const [ammendDesc, setAmmendDesc] = useState("")

  const [exportData, setExportData] = useState({})


  const caseD = {};

  const [caseDetails, setCaseDetails] = useState({})

  let caseStatus = "Open"; let caseLabelType = "success";

  const officerdata = localStorage.getItem('userGroup');
  console.log(officerdata, 'choose')
  if (id) {

    const idSplit = id.split(":")


    if (idSplit.length > 1) {
      id = idSplit[0];
      caseD.inquryID = idSplit[1]
      caseD.owner = idSplit[2]
      caseD.assigneee = idSplit[3]
      caseD.status = idSplit[4]

      switch (caseD.status) {
        case "2": caseStatus = "In Progress"; caseLabelType = "info"; break;
        case "3": caseStatus = "In Review"; caseLabelType = "primary"; break;
        case "4": caseStatus = "Complete"; caseLabelType = "error"; break;
        case "5": caseStatus = "Re-Opened"; caseLabelType = "info"; break;
      }


    }
  }


  let tasks;

  if (type == LSA_TYPE) { tasks = LSA_TASKS }
  else if (type == BACKGROUND_CHECK_TYPE) { tasks = BC_TASKS }
  else if (type == PI_TYPE) { tasks = PI_TASKS }
  else { tasks = VETTING_TASKS }

  const [mCaseStatus, setMCaseStatus] = useState(caseStatus)
  const [mCaseLabel, setMCaseLabel] = useState(caseLabelType)


  const changeLabel = (status) => {
    switch (caseD.status) {
      case "2": setMCaseStatus("In Progress"); setMCaseLabel("info"); break;
      case "3": setMCaseStatus("In Review"); setMCaseLabel("primary"); break;
      case "4": setMCaseStatus("Complete"); setMCaseLabel("error"); break;
      case "5": setMCaseStatus("Re-Opened"); setMCaseLabel("info"); break;
    }

  }


  const [caseData, setCaseData] = useState(caseD)

  let subheader = "Profile View"




  useEffect(() => {

    updateProfileData()

  }, [])



  const updateProfileData = () => {

    const requestBody = {
      
      userID: userData.userID,
     
    }

    FetchApi.post(GET_ALL_USERS, requestBody, (status, data) => {

      console.log("User Data", data)
      console.log(requestBody,"Request Body")

      if (status) {

        setUsers(data)
        console.log("Lets see",  users)
      } else {
        //some error
      }
    })


    const requestBody1 = {
      subjectID: "",
      idNo: id
    }
    console.log("What I'm sending", requestBody1)

    FetchApi.post(GET_ONE_PROFILE, requestBody1, (status, data) => {
      if (status) {
        console.log("PROFILE DATA ::::", data)

        setProfile(data)
      } else {
        console.log("some error occured")
      }
    })



    const caseRequestBody = {
      inquiryID: caseData.inquryID
    }

    console.log("CASE REQ::", caseRequestBody)

    FetchApi.post(GET_CASE_DETAILS, caseRequestBody, (status, data) => {
      if (status) {
        console.log("CASE DATA RESP::::", data)

        setCaseDetails(data)

        //get export Data

        const exportBody = {
          subjectID: data.subjectID,
          inquiryID: caseData.inquryID,
          userID: userData.userID
        }

        console.log("EXP D REQ::", exportBody)

        FetchApi.post(PRINT_CASE, exportBody, (status, data) => {
          if (status) {
            console.log("EXPORT DATA RESP::::", data)
            console.log("EXPORT DATA RESP::::", data.caseDetails.inquiryType)
            setthisData(data.caseDetails.inquiryType)
            setExportData(data)
          } else {
            console.log("some error occured :: EXP D RESP")
          }
        })

      } else {
        console.log("some error occured :: CASE D RESP")
      }
    })


  }



  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }

  };


  const handleChange = (event) => {

    setSelectedUser(event.target.value)

  };


  const handleTabChange = (event, newTab) => {
    setActiveTab(newTab)
  }


  const assignSelectedUser = () => {

    setOpen(false)

    const postBody = {
      subjectID: profile.subjectID,
      recipientID: selectedUser,
      status: "2",
      inquiryID: Number.parseInt(caseD.inquryID),
      userID: userData.userID
    }

    console.log("BODY", postBody)

    tranferCase(postBody, true)

  }


  const requestAmmend = () => {

    setAmmendDialogOpen(false)

    const postBody = {
      subjectID: profile.subjectID,
      recipientID: caseD.assigneee,
      status: "2",
      inquiryID: Number.parseInt(caseD.inquryID),
      userID: userData.userID
    }

    console.log("BODY", postBody)

    requestAmmendment(postBody)


  }


  const sendReview = () => {

    setConfirmSubmitOpen(false)

    const postBody = {
      subjectID: profile.subjectID,
      recipientID: caseD.assigneee,
      status: "3",
      inquiryID: Number.parseInt(caseD.inquryID),
      userID: userData.userID
    }

    //console.log("BODY", postBody)

    tranferCase(postBody, false)


  }


  const tranferCase = (postBody, isNew) => {

    FetchApi.post(TRANSFER_CASE, postBody, (status, data) => {
      console.log(data)

      if (status && data.status) {
        showSuccessAlert("Case Assigned Successfully")
        postBody.inquryID = postBody.inquiryID
        setCaseData(postBody)
        changeLabel(postBody.status)


        if (isNew) {

          tasks.forEach(task => {

            task.assignee = postBody.recipientID
            task.creator = userData.userID
            task.inquiryID = postBody.inquiryID

            FetchApi.post(CREATE_TASK, task, (status, data) => {
              console.log("TASK RESP", data)
            })

          })
        }


      } else {
        showErrorAlert("Failed")
      }
    })

  }


  const requestAmmendment = (postBody) => {


    FetchApi.post(TRANSFER_CASE, postBody, (status, data) => {
      console.log(data)

      if (status && data.status) { 
        showSuccessAlert("Ammendment Request sent")
        postBody.inquryID = postBody.inquiryID
        setCaseData(postBody)
        changeLabel(postBody.status)
        console.log(fieldsToAmment, "Important")
        fieldsToAmment.forEach(task => {
          
          console.log(task, "Important 2")
          task.assignee = postBody.recipientID
          task.creator = userData.userID
          task.inquiryID = postBody.inquiryID
          task.remarks = reRemark
          FetchApi.post(CREATE_TASK, task, (status, data) => {
            console.log("TASK RESP", data)
          })

        })


      } else {
        showErrorAlert("Failed")
      }
    })
  }

  const [pdfViewOpen, setPdfViewOpen] = useState(false)
  const [pdfViewOpenBc, setPdfViewOpenBc] = useState(false)
  const [pdfViewOpenPI, setPdfViewOpenPI] = useState(false)


  const exportPDF = () => {
    console.log('Type to be opened::', type)
    if (type == 'BC' || type == 'VT' ) {

      setPdfViewOpenBc(true)
    } else if(type == 'PI') {
      setPdfViewOpenPI(true)
    }
    else
    {
      setPdfViewOpen(true)
    }
  }
  let caseTypes;
  if(thiscasedata == "Background Check" || thiscasedata == "Vetting")
  {
    caseTypes = 1
  }
  return (

    <Page title="Profile">
      <Container maxWidth='xl'>


        {/* Assign User Dialog */}

        <Dialog
          sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 535 } }}
          maxWidth="sm"
          TransitionProps={{ onEntering: handleEntering }}
          open={open}
        >
          <DialogTitle>Select User to Assign</DialogTitle>
          <DialogContent dividers>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={selectedUser}
              onChange={(event) => setSelectedUser(event.target.value)}
              name="radio-buttons-group"
            >
              {users.map((option) => (
                // <FormControlLabel value={option.userid} control={<Radio />}
                //   label={option.firstName + " " + option.lastName + " - " + option.department} />

                <UserItem user={option} checked={selectedUser == option.userid} setSelection={setSelectedUser} />

              ))}
            </RadioGroup>

          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => assignSelectedUser()}>Confirm</Button>
          </DialogActions>
        </Dialog>




        {/* Require Ammendment Dialog */}
        <Dialog
          sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 535 } }}
          maxWidth="sm"
          TransitionProps={{ onEntering: handleEntering }}
          open={ammendDialogOpen}
        >
          <DialogTitle>Request Ammendment</DialogTitle>
          <DialogContent dividers>

            <p>Select Fields requiring ammendment</p>

            {
              tasks.map((task, index) => {
                return (
                  <>
                    <FormControlLabel control={<Checkbox onChange={(event) => {
                      if (event.target.checked) {
                        const cp = fieldsToAmment
                        cp[index] = task;
                        setFieldsToAmment(cp)
                      }
                    }} />} label={task.description} />
                    <TextareaAutosize
                      minRows={2}
                      style={{ width: '100%', padding: 10 }}
                      placeholder='Recommendation'
                      onChange={(event) => {

                        //fieldsToAmment[index].description = event.target.value
                        setRevRemark(event.target.value)
                          {console.log(fieldsToAmment)}

                      }}
                    />
                  </>
                )

              })
            }



          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setAmmendDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => requestAmmend()}>Confirm</Button>
          </DialogActions>
        </Dialog>




        {/* Submit for review Dialog */}

        <Dialog
          sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 535 } }}
          maxWidth="sm"
          TransitionProps={{ onEntering: handleEntering }}
          open={confirmSubmitOpen}
        >
          <DialogTitle>Confirm Submit</DialogTitle>
          <DialogContent dividers>

            <h4>do you want to submit for review? This action cannot be reversed.</h4>

          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setConfirmSubmitOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => sendReview()}>Confirm</Button>
          </DialogActions>
        </Dialog>


        {/* Export PDF - LSA Dialog */}
        <Dialog
          sx={{ '& .MuiDialog-paper': { width: '80%', height: '100%' } }}
          maxWidth="xl"
          open={pdfViewOpen}>

          <DialogContent>

            <PDFViewer width='100%' height='100%'>
              <Document>

                <LSAExport data={exportData} />
                {type == 'BC' || type == 'VT' && <BcAndVtExPort data={subProfile.userData} caseData={exportData} />}

              </Document>
            </PDFViewer>

          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setPdfViewOpen(false)}>
              Cancel
            </Button>
          </DialogActions>

        </Dialog>


        {/* Export PDF - BC Dialog */}
        <Dialog
          sx={{ '& .MuiDialog-paper': { width: '80%', height: '100%' } }}
          maxWidth="xl"
          open={pdfViewOpenBc}>

          <DialogContent>

            <PDFViewer width='100%' height='100%'>
              <Document>

                <BcAndVtExPort data={exportData} caseData={exportData} />

              </Document>
            </PDFViewer>

          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setPdfViewOpenBc(false)}>
              Cancel
            </Button>
          </DialogActions>

        </Dialog>

        <Dialog
          sx={{ '& .MuiDialog-paper': { width: '80%', height: '100%' } }}
          maxWidth="xl"
          open={pdfViewOpenPI}>

          <DialogContent>

            <PDFViewer width='100%' height='100%'>
              <Document>

                <PIExport  data={exportData} caseData={subProfile.userData} />

              </Document>
            </PDFViewer>

          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setPdfViewOpenPI(false)}>
              Cancel
            </Button>
          </DialogActions>

        </Dialog>


        {
          caseData.inquryID && profile.subject_Name &&

          <Grid item md={12}>
            <Card sx={{ width: '100%', paddingBottom: 3, borderRadius: 1 }}>
              <CardHeader
                title={"VIEWING PROFILE FOR - " + profile.subject_Name + " - CASE NO : " + caseDetails.caseNo}
                subheader={
                  type == "SP" ? "Profile View" : <Label
                    variant="ghost"
                    color={mCaseLabel}
                  >
                    {mCaseStatus}
                  </Label>
                }
                action={
                  <>

                    {
                      caseData.status != "3" && officerdata != "I.O" &&
                      <Button variant="contained"
                        sx={{ background: '#303F9F' }}
                        onClick={() => setOpen(true)}
                      >Assign User</Button>

                    }


                    {

                      caseData.assigneee != userData.userID && caseD.status == "3" &&
                      <Button variant="contained"
                        sx={{ background: '#1e90ff', marginLeft: 2 }}
                        onClick={() => setAmmendDialogOpen(true)}
                      >Require Ammendment</Button>

                    }

                  {
                        // caseData.owner==userData.userID || caseData.assigneee==userData.userID && 
                        <Button variant="contained"
                        sx={{ marginRight: 1, background: '#c80815' }}
                        onClick={exportPDF}
                      >PDF</Button>

                  }
                

{/* 
                    {
                      caseData.status != "3" && caseData.assigneee == userData.userID &&
                      <Button variant="contained"
                        sx={{ marginLeft: 2, background: '#20b2aa' }}
                        onClick={() => setConfirmSubmitOpen(true)}
                      >Submit For Review</Button>
                    } */}


                  </>
                }
              />
            </Card>

          </Grid>

        }
     
         <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor='primary'
          variant="scrollable"
          sx={{ height: 50, marginTop: 2, background: '#ffffff' }}
        >


          <Tab value={0} label={"Bio\nData"} />
          {caseTypes != 1 && <Tab value={2} label="Residential Information" />}
          {caseTypes != 1 && <Tab value={3} label="Secondary Information" />}
          {caseTypes != 1 &&<Tab value={4} label="Associates Information" />}
          {caseTypes != 1 && <Tab value={5} label="Financial Information" />}
          {caseTypes != 1 && <Tab value={6} label={"Companies / \nBusinesses"} />}
          {caseTypes != 1 && <Tab value={7} label="Expenses" />}
          {caseTypes != 1 && <Tab value={8} label="Assets" />}
          {caseTypes != 1 && <Tab value={9} label="Liabilities" />}
          {caseTypes != 1 && <Tab value={10} label={"Integrity & \nEthics"} />}
          {caseTypes != 1 && <Tab value={11} label={"Employment"} />}
          {caseTypes != 1 && <Tab value={12} label={"Declarations"} />}
          {caseTypes != 1 && <Tab value={13} label="Other Agency Info" />}
          {caseTypes != 1 && <Tab value={14} label="Tax Issues" />}
          <Tab value={1} label={"Case Info"} />
          <Tab value={15} label="Closing" />

      
        </Tabs>

        <ProfileContextProvider>

          <TabPanel value={activeTab} index={1}>
            <CaseMeta details={caseDetails} setProfileAdded={setProfile}
              type={type} setCaseAdded={setCaseData} updateProfileData={updateProfileData} />
          </TabPanel>

          <TabPanel value={activeTab} index={0}>
            <BioData id={id} setProfileAdded={setProfile}
              type={type} setCaseAdded={setCaseData} updateProfileData={updateProfileData} details = {caseD}/>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <ResidentialProfile id={id} updateProfileData={updateProfileData} />
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <SecondaryInformation id={id} updateProfileData={updateProfileData} />
          </TabPanel>


          <TabPanel value={activeTab} index={4}>
            <AssociatesProfiles id={id} updateProfileData={updateProfileData} />
          </TabPanel>


          <TabPanel value={activeTab} index={5}>
            <FinancesProf id={id} updateProfileData={updateProfileData} />
          </TabPanel>

          <TabPanel value={activeTab} index={6}>
            <BusinessInterests id={id} updateProfileData={updateProfileData} />
          </TabPanel>

          <TabPanel value={activeTab} index={7}>
            <Expenses id={id} updateProfileData={updateProfileData} />
          </TabPanel>

          <TabPanel value={activeTab} index={8}>
            <Assets id={id} updateProfileData={updateProfileData} />
          </TabPanel>

          <TabPanel value={activeTab} index={9}>
            <Liabilities id={id} updateProfileData={updateProfileData} />
          </TabPanel>

          <TabPanel value={activeTab} index={10}>
            <IntegrityIssues id={id} updateProfileData={updateProfileData} />
          </TabPanel>
          <TabPanel value={activeTab} index={11}>
            <Employment id={id} updateProfileData={updateProfileData} />
          </TabPanel>

          <TabPanel value={activeTab} index={12}>
            <DeclarationsProfile id={id} updateProfileData={updateProfileData} />
          </TabPanel>

          <TabPanel value={activeTab} index={13}>
            <OtherAgencyInfo id={id} updateProfileData={updateProfileData} />
          </TabPanel>
          <TabPanel value={activeTab} index={14}>
            <TaxIssues id={id} updateProfileData={updateProfileData} />
          </TabPanel>

          <TabPanel value={activeTab} index={15}>
            <Closing id={id} details={caseDetails} updateProfileData={updateProfileData} />
          </TabPanel>

        </ProfileContextProvider>
      </Container>
    </Page>

  )

}


const UserItem = (props) => {

  const { firstName, lastName, staffNo, userGroup, department, userid } = props.user
  const setSelection = props.setSelection
  const checked = props.checked


  const handleClick = () => {

    setSelection(userid);

  }

  return (
    <Stack id={userid} direction="row"
      onClick={() => handleClick()}
      justifyContent="space-between"
      alignItems="center"

      sx={{
        height: 50, borderBottom: [0.5, 'solid', '#f0f8ff']
      }}
    >
      <Typography

      >{firstName + " " + lastName + " - " + department}</Typography>
      <Checkbox checked={checked} />
    </Stack>

  )
}



