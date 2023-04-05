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
  TextareaAutosize
} from '@mui/material';
import React, { useState, useContext } from 'react';
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
const findings = [
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

  const { userData } = useContext(UserContext);

  const handleChangeRec = (event) => {
    const {
      target: { value }
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
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

  const [showPassword, setShowPassword] = useState(false);
  const alert = useAlert();

  const showAlert = () => {
    alert.success('SAVED SUCCESSFULLY');
  };

  const RegisterSchema = Yup.object().shape({
    remarks: Yup.string(),
    cFindings: Yup.string(),
    findings: Yup.string(),
    forward: Yup.string(),
    introduction: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      remarks: '',
      cFindings: '',
      findings: ''
    },
    enableReinitialize: true,
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      (values.recomentation = personName.join('\n')), (values.cFindings = findingName.join('\n'));

      updateCaseData(values);
    }
  });

  const updateCaseData = (values) => {
    details.recomentation = values.recomentation;
    details.findings = values.findings;
    details.remarks = values.remarks;
    details.userID = userData.userID;
    details.status = 4;
    details.inquiryID = details.iquiryid;
    details.cFindings = values.cFindings;
    details.rto = details.rto;
    details.rfrom = details.rfrom;

    console.log('SENDING', details);

    FetchApi.post(UPDATE_CASE, details, (status, data) => {
      if (status) {
        console.log('TRFR RESP', data);
        showAlert();
        updateProfileData();
      }
    });
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid item md={12}>
            <Card sx={{ width: '100%', paddingBottom: 3 }}>
              <CardHeader
                title="Close This Case"
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
                  {details.inquiryType == 'Preliminary Investigation' && (
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
                        select
                        label="Type of Vetting"
                        {...getFieldProps('type')}
                      >
                        {vettingTypes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>

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
                          {findings.map((name) => (
                            <MenuItem key={name} value={name}>
                              <Checkbox checked={findingName.indexOf(name) > -1} />
                              <ListItemText primary={name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
                        {findings.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={findingName.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack> */}
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
                  {details.inquiryType == 'Vetting' && (
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Way Forward"
                        multiline
                        rows={3}
                        {...getFieldProps('forward')}
                      />
                    </Stack>
                  )}
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
                    <Button variant="contained" style={{ height: 50 }} onClick={handleSubmit}>
                      CLOSE
                    </Button>
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
