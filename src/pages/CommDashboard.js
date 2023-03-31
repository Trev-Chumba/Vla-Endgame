import { filter } from 'lodash';
import 'chart.js/auto';
import { sentenceCase } from 'change-case';
import { useState, useContext, useEffect } from 'react';

import { Link as RouterLink } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { FetchApi } from 'src/api/FetchApi';
import { GET_ALL_INQUIRY, GET_MY_TASKS, GET_USER_STATS, GET_COMM_STATS } from 'src/api/Endpoints';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { faEye } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from 'src/context/UserContext';

// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Box,
  Grid,
  CardHeader
} from '@mui/material';

//Chart componenets
import Chart from 'react-apexcharts';

import { Doughnut } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';

// components

import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import {
  AppTasks,
  IncompleteTasks,
  Inquiries,
  Cases,
  CompletedTasks
} from '../sections/@dashboard/app';

// material

//
import USERLIST from '../_mocks_/user';

const TABLE_HEAD = [
  { id: 'name', label: 'Subject Name', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'status', label: 'status', alignRight: false }
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
export default function CommDashboard() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { userData } = useContext(UserContext);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [recommendationsData, setRecommendationsData] = useState({});
  const [recommendationsOptions, setRecommendationsOptions] = useState({});
  const [findingsData, setFindingsData] = useState({});
  const [findingsOptions, setFindingsOptions] = useState({});
  const [allCasesTotal, setCaseTotal] = useState([]);
  const [completedTotal, setCompletedTotal] = useState([]);
  const [inProgressTotal, setInProgressTotal] = useState([]);
  const [expiredTotal, setExpiredTotal] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [allData, setAllData] = useState([]);

  const [userTasks, setTasks] = useState([]);

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
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  // const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;
  // const findings_data = {
  //   labels: ['InProgress', 'In review', 'escalated', 'expired', 'completed', 'Open'],
  //   datasets: [
  //     {
  //       label: '# of Votes',
  //       data: [12, 49, 3, 5, 2, 3],
  //       backgroundColor: [
  //         'rgba(255, 99, 132, 0.2)',
  //         'rgba(54, 162, 235, 0.2)',
  //         'rgba(255, 206, 86, 0.2)',
  //         'rgba(75, 192, 192, 0.2)',
  //         'rgba(153, 102, 255, 0.2)',
  //         'rgba(255, 159, 64, 0.2)',
  //       ],
  //       borderColor: [
  //         'rgba(255, 99, 132, 1)',
  //         'rgba(54, 162, 235, 1)',
  //         'rgba(255, 206, 86, 1)',
  //         'rgba(75, 192, 192, 1)',
  //         'rgba(153, 102, 255, 1)',
  //         'rgba(255, 159, 64, 1)',
  //       ],
  //       borderWidth: 1,
  //     },
  //   ],
  // };
  // recommendationsData = {
  //   labels: ['InProgress', 'In review', 'escalated', 'expired', 'completed', 'Open'],
  //   datasets: [
  //     {
  //       label: '# of Votes',
  //       data: [12, 19, 3, 5, 2, 3],
  //       backgroundColor: [
  //         'rgba(255, 99, 132, 0.2)',
  //         'rgba(54, 162, 235, 0.2)',
  //         'rgba(255, 206, 86, 0.2)',
  //         'rgba(75, 192, 192, 0.2)',
  //         'rgba(153, 102, 255, 0.2)',
  //         'rgba(255, 159, 64, 0.2)',
  //       ],
  //       borderColor: [
  //         'rgba(255, 99, 132, 1)',
  //         'rgba(54, 162, 235, 1)',
  //         'rgba(255, 206, 86, 1)',
  //         'rgba(75, 192, 192, 1)',
  //         'rgba(153, 102, 255, 1)',
  //         'rgba(255, 159, 64, 1)',
  //       ],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // console.log(Object.keys(pieData.statusCount),"PIE DATA")
  // console.log(Object.values(pieData.statusCount),"PIE DATA")

  useEffect(() => {
    const requestBody = {
      userID: userData.userID
    };

    //get inquiry
    FetchApi.post(GET_COMM_STATS, requestBody, (status, data) => {
      if (status) {
        console.log('Comm stats :::', data);
        setRecommendationsData(
          //data on the y-axi
          Object.values(data.statusCount)
        );
        console.log(' Recommendations DATA ::', recommendationsData);
        setRecommendationsOptions({
          labels: Object.keys(data.statusCount),

          chart: {
            type: 'pie'
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  show: false,
                  position: 'bottom'
                }
              }
            }
          ] //data
        });

        setFindingsData(
          //data
          Object.values(data.totalCount)
        );
        console.log(recommendationsData);
        setFindingsOptions({
          labels: Object.keys(data.totalCount),

          chart: {
            type: 'donut'
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  show: false,
                  position: 'bottom'
                }
              }
            }
          ] //data
        });
        const bgTotal = data.totalCount.Background;
        const vettingTotal = data.totalCount.vetting;
        const lsaTotal = data.totalCount.lsa;
        const piTotal = data.totalCount.pi;
        const allCases = bgTotal + vettingTotal + lsaTotal + piTotal;
        const incomplete =
          data.statusCount.inProgress + data.statusCount.inReview + data.statusCount.open;
        console.log('All Cases is ', allCases);
        setCaseTotal([allCases]);
        //setCaseTotal([data.totalCount.allCasess]);
        setCompletedTotal([data.statusCount.complete]);
        setInProgressTotal([incomplete]);
        setExpiredTotal([data.statusCount.Expired]);
      } else {
        //some error
      }
    });

    //get Tasks
    // FetchApi.post(GET_COMM_STATS, requestBody, (status, data) => {
    //   if (status) {
    //     //
    //   }
    // })
  }, []);

  return (
    <Page title="KRA - VLS | Home">
      <Container maxWidth="xl">
        <Box sx={{ pb: 3 }}>
          <Typography variant="h4">Hi {userData.firstName}, Welcome</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <CompletedTasks total={completedTotal} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <IncompleteTasks total={inProgressTotal} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Inquiries total={expiredTotal} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Cases total={allCasesTotal} />
          </Grid>
          {/* <Grid item xs={12} sm={6} md={6}>
          <Doughnut data={findings_data} />
          </Grid> */}
          <Grid item xs={12} sm={6} md={6}>
            <Card>
              <CardHeader title="Cases by Status" />
              {
                <Chart
                  options={recommendationsOptions}
                  series={recommendationsData}
                  type="pie"
                  width="450"
                />
              }
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Card>
              <CardHeader title="Cases by Type" />
              {<Chart options={findingsOptions} series={findingsData} type="donut" width="450" />}
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            {totalData.labels && <Doughnut data={totalData} />}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
