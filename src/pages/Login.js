// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Container, Typography } from '@mui/material';
// layouts
// components
import Page from '../components/Page';
import { LoginForm } from '../sections/authentication/login';
import * as Yup from 'yup';
import { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { useAlert } from 'react-alert';
// material
import {
  Link,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../components/Iconify';
import { UserContext } from '../context/UserContext';
import { FetchApi } from '../api/FetchApi';
import { LOGIN_USER } from 'src/api/Endpoints';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login({setValueX}) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const alert = useAlert();

  const showInfoAlert = (message) => {
    alert.info(message);
  };

  const showErrorAlert = (message) => {
    alert.error(message);
  };

  const showSuccessAlert = (message) => {
    alert.success(message);
  };

  const LoginSchema = Yup.object().shape({
    staffNO: Yup.string().required('Staff Number is required'),
    password: Yup.string().required('Password is required')
  });

  const { userData, setUserData } = useContext(UserContext);

  const { setLoginStatus } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      staffNO: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      setIsSubmitting(true);

      FetchApi.post(LOGIN_USER, values, (status, data) => {
        setIsSubmitting(false);

        if ((!status && data.status != '0') || (!status && data.status != '500' ||status && data.status != 500)) {
          console.log('data status', status, data.status)
          setLoginStatus(true);
          console.log('data status', status)
          setUserData(data);
          console.log(data, 'Login Data');

          localStorage.setItem('userData', data);

          showSuccessAlert('Login Success');
          console.log(data.reports, 'Data reports')
          //setValueX(true);

          // setTimeout(() => {
          //    setUserData({})
          // }, 1000*60*5)

          if (data.reports == '1' || data.reports == 1) {
            console.log('I AM COMM');
            navigate('/dashboard/comm');
            localStorage.setItem('userType', 'comm');
          } else {
            localStorage.setItem('userType', 'user');
            navigate('/dashboard/app');
          }
        } else {
          showErrorAlert('Incorrect Username or Password');
        }
      });
    }
  });

  const { errors, touched, values, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  return (
    <RootStyle title="Login | VLA">


      {/* <SectionStyle sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Typography variant="h3" sx={{ px: 5, mt: 5, mb: 5 }}>
          Hi, Welcome Back
        </Typography>
        <img src="/static/illustrations/illustration_login.png" alt="login" />
      </SectionStyle> */}

      <Container maxWidth="sm">
       
       
            <Typography variant="h4" gutterBottom>
              Sign in to VLA
            </Typography>
            {/* <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography> */}
         

            <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
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

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>


      </Container>
    </RootStyle>
  );
}
