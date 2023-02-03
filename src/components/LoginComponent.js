import { styled } from '@mui/material/styles';
import { Card, Stack, Container, Typography } from '@mui/material';
import { Box } from '@mui/material';
import Page from '../components/Page';
import { LoginForm } from '../sections/authentication/login';
import { useContext } from 'react';
import { Circle } from '@react-pdf/renderer';

// ----------------------------------------------------------------------


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

export default function LoginDialog({ setValueX }) {

    return (

        <Container
            sx={
                {
                    position: 'absolute', background: '#ffffffcc', minWidth: '100%',
                    zIndex: 3000, top: 0, left: 0, right: 0, bottom: 0
                }
            }
        >
            <Card>


                <Container sx={{
                    display: 'flex', flexDirection: 'row', borderBottom: '30px solid red',
                    justifyContent: 'space-between', width: '150%', marginTop: 5
                }}>

                    <Box component="img"sx={{  height: 150 }} src="/vla/static/kra_logo_name.jpg" />
            
                    <Box component="img" sx={{height:150 , width:500 }} src="/vla/static/vla_logo.png" />


                </Container>

                <ContentStyle>
                    
                        <Typography variant="h4" gutterBottom>
                            Sign in to VLA
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
                    

                    <LoginForm setValueX={setValueX} />


                </ContentStyle>
            </Card>
        </Container>

    );
}
