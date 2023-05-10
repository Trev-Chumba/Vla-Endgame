import * as Yup from 'yup';
import { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { useAlert } from 'react-alert'
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import { UserContext } from '../../../context/UserContext';
import { FetchApi } from '../../../api/FetchApi';
import { LOGIN_USER } from 'src/api/Endpoints';

// ----------------------------------------------------------------------

export default function LoginForm({ setValueX }) {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const LoginSchema = Yup.object().shape({
    staffNO: Yup.string().required('Staff Number is required'),
    password: Yup.string().required('Password is required')
  });

  const {userData, setUserData} = useContext(UserContext)


  const { setLoginStatus } = useContext(UserContext)

  const formik = useFormik({
    initialValues: {
      staffNO: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      setIsSubmitting(true);
      console.log("sending ....", values)
      FetchApi.post(LOGIN_USER, values, (status, data) => {
        setIsSubmitting(false);
        if(status && data.status == "1" || data.status == 1 || data.status == undefined)
        {
          console.log('data status', status, data.status)
          setLoginStatus(true);
          console.log('data status', data)
          setUserData(data);
          console.log(data, 'Login Data');

          localStorage.setItem('userData', data);
          console.log('data status', status, data.groupName);
          localStorage.setItem('userGroup', data.groupName);
          console.log(localStorage.getItem('userGroup'))
          showSuccessAlert('Login Success');

        setValueX(true)

        // setTimeout(() => {
        //    setUserData({})
        // }, 1000*60*5)

          if (data.reports = 1 || data.reports == '1') {
            //console.log('I AM COMM');
            navigate('/dashboard/comm');
            localStorage.setItem('userType', 'comm');
          } else {
            localStorage.setItem('userType', 'user');
            navigate('/dashboard/app');
          }
        } else {
          console.log('data status', status, data.status)
          //console.log('data status', data)
          showErrorAlert('Incorrect Username or Password');
        }


      }else{

        showErrorAlert("Incorrect Username or Password")

      }



     })
   




    }
  });

  const { errors, touched, values, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit} spacing= {3}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="staffNO"
            label="Username"
            {...getFieldProps('staffNO')}
            error={Boolean(touched.staffNO && errors.staffNO)}
            helperText={touched.staffNO && errors.staffNO}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
            Forgot password?
          </Link>
        </Stack> */}
      <Stack spacing={3} marginTop={3}>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
        </Stack>
        {/* <Stack bottom={0}>
          <Text>
            Version 1
          </Text>
        </Stack> */}
      </Form>
    </FormikProvider>
  );
}
