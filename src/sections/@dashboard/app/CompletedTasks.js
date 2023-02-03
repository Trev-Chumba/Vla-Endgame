import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare, faCoffee,faCheck,faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(1, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around'
}));


const DetailsWrapperStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column'

}));

const IconWrapperStyle = styled('div')(({ theme }) => ({

  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

// const TOTAL = 714000;

export default function CompletedTasks(props) {
  return (
    <RootStyle>
      <IconWrapperStyle>
      <FontAwesomeIcon icon={faCheck} width={24} height={24} />
      </IconWrapperStyle>
      <DetailsWrapperStyle>
      <Typography variant="h3">{fShortenNumber(props.total)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Completed Tasks
      </Typography>
      </DetailsWrapperStyle>
    </RootStyle>
  );
}
