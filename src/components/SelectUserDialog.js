import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';


function ConfirmationDialogRaw(props) {

  const { users, setSelectedUser} = props;

  const [value, setValue] = React.useState(valueProp);
  const [open, setOpen ] = useState(false)
  const radioGroupRef = React.useRef(null);


  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }


  };


  const handleChange = (event) => {
    setValue(event.target.value);
  };


  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '90%', maxHeight: 435 } }}
      maxWidth="xl"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
    >
      <DialogTitle>Select User to Assign</DialogTitle>
      <DialogContent dividers>

      <RadioGroup
          ref={radioGroupRef}
          aria-label="ringtone"
          name="ringtone"
          value={value}
          onChange={handleChange}
        >
          {users.map((option) => (
            <FormControlLabel
              value={option}
              key={option.userid}
              control={<Radio />}
              label={option.fullName}
            />
          ))}
        </RadioGroup>

      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={()=> setOpen(false)}>
          Cancel
        </Button>
        <Button onClick={() => setSelectedUser(value)}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}

