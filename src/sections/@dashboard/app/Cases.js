import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'
// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
//
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------
const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(1, 0),
  color: theme.palette.error.darker,
  backgroundColor: theme.palette.error.lighter,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around'
}));

const DetailsWrapperStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: theme.spacing(4),
  height: theme.spacing(4)

}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.error.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.error.dark, 0)} 0%, ${alpha(
    theme.palette.error.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

// const TOTAL = 234;

export default function Cases(props) {
  return (
    <RootStyle>
      <IconWrapperStyle>
      <FontAwesomeIcon icon={faFolder} width={24} height={24} />
      </IconWrapperStyle>
      <DetailsWrapperStyle>
      <Typography variant="h3">{fShortenNumber(props.total)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Cases
      </Typography>
      </DetailsWrapperStyle>
    </RootStyle>
  );
}
