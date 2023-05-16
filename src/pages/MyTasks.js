import { filter } from 'lodash';
import { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material

// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
//
import USERLIST from '../_mocks_/user';
import { FetchApi } from '../api/FetchApi';
import { GET_ALL_INQUIRY, GET_MY_TASKS } from '../api/Endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from 'src/context/UserContext';
import Label from '../components/Label';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  //{ id: 'Prfile', label: 'Profile Name', alignRight: false },
  { id: 'name', label: 'Subject name', alignRight: false },
  { id: 'type', label: 'Case Type', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'description', label: 'Remarks', alignRight: false }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.subject_Name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return stabilizedThis.map((el) => el[0]);
}

export default function MyTasks() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allData, setAllData] = useState([]);
  const { userData } = useContext(UserContext);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    const users = applySortFilter(allData, getComparator(order, orderBy), filterName);
    setFilteredUsers(users);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  useEffect(() => {
    const requestBody = {
      userID: userData.userID
    };

    FetchApi.post(GET_MY_TASKS, requestBody, (status, data) => {
      if (status) {
        console.log('TASKS request body::::', data);
        const task = applySortFilter(data, getComparator(order, orderBy), filterName);
        setFilteredUsers(task);
        console.log('TASKS::::', data);
      } else {
        //some error
      }
    });

    FetchApi.post(GET_ALL_INQUIRY, requestBody, (status, data) => {
      if (status) {
        //console.log('INQUIRIES (tasks) request body::::', requestBody);
        const inquiry = applySortFilter(data, getComparator(order, orderBy), filterName);
        setAllData(inquiry);
        console.log('INQUIRIES from tasks::::', data, status);
      } else {
        //some error
      }
    });
  }, []);

  const isUserNotFound = filteredUsers.length === 0;

  const mergedArr = filteredUsers.map((obj1) => {
    const obj2 = allData.find((obj2) => obj1.inquiryID === obj2.inquryID);
    if (obj2) {
      return { ...obj1, ...obj2 };
    } else {
      return obj1;
    }
  });

  //console.log(mergedArr);

  return (
    <Page title="KRA VLA - Tasks">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            My Tasks
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {mergedArr
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        subjectName,
                        status,
                        subjectIdNO,
                        inquiryID,
                        owner,
                        assignee,
                        taskID,
                        inquryType,
                        remarks,
                        description
                      } = row;
                      const isItemSelected = selected.indexOf(subjectName) !== -1;

                      let caseType = 'LA';

                      switch (inquryType) {
                        case 'Background Check':
                          caseType = 'BC';
                          break;
                        case 'Preliminary Investigation':
                          caseType = 'PI';
                          break;
                        case 'Vetting':
                          caseType = 'VT';
                          break;
                      }

                      let caseStatus = '2';
                      let caseLabelType = 'success';

                      switch (status) {
                        case '2':
                          caseStatus = 'In Progress';
                          caseLabelType = 'info';
                          break;
                        case '3':
                          caseStatus = 'In Review';
                          caseLabelType = 'primary';
                          break;
                        case '4':
                          caseStatus = 'Complete';
                          caseLabelType = 'error';
                          break;
                        case '5':
                          caseStatus = 'Re-Opened';
                          caseLabelType = 'info';
                          break;
                      }

                      return (
                        <TableRow
                          hover
                          key={taskID}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, description)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {subjectName}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{inquryType}</TableCell>
                          <TableCell align="left">{caseStatus}</TableCell>
                          <TableCell align="left">{remarks}</TableCell>

                          <TableCell>
                            <RouterLink
                              to={
                                '/dashboard/view-case/' +
                                caseType +
                                '/' +
                                subjectIdNO +
                                ':' +
                                inquiryID +
                                ':' +
                                owner +
                                ':' +
                                assignee +
                                ':' +
                                status
                              }
                            >
                              {/* <RouterLink
                              to={
                                '/dashboard/view-case/' +
                                inquiryID +
                                '/' +
                                subjectIdNO +
                                ':' +
                                owner +
                                ':' +
                                assignee +
                                ':' +
                                caseStatus
                              }
                            > */}
                              <FontAwesomeIcon icon={faEye} />
                            </RouterLink>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
