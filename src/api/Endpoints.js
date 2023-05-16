const DEV_API = 'http://10.153.1.65:8099';
const PROD_API = 'http://10.160.8.92:8099';
const LOCAL_API = 'http://localhost:8099';
const IP = 'http://192.168.22.41:8099';
const LOCAL_API2 = 'http://192.168.0.108:8099';

export const BASE_URL = PROD_API;

export const GET_ALL_PROFILE = '/profileMgt/allProfile';
export const GET_ONE_PROFILE = '/profileMgt/getProfile';

export const SET_PROFILE = '/inquiryMgt/get';
export const UPDATE_PROFILE = '/profileMgt/updateProfile';

export const SET_RESIDENTIAL = '/residentialMgt/set';
export const GET_RESIDENTIAL = '/residentialMgt/get';
export const UPDATE_RESIDENTIAL = '/residentialMgt/update';

export const SET_EMPLOYMENT_PROFILE = '/employmentHistory/setProfile';
export const GET_EMPLOYMENT_PROFILE = '/employmentHistory/getProfile';
export const UPDATE_EMPLOYMENT_PROFILE = '/employmentHistory/updateProfile';

export const SET_FIN_ACCOUNT = '/accountsMgt/set';
export const UPDATE_FIN_ACCOUNT = '/accountsMgt/update';
export const GET_FIN_ACCOUNT = '/accountsMgt/get';
export const SET_SECONDARY_INFORMATION = '/secInfo/set';
export const GET_SECONDARY_INFORMATION = '/secInfo/get';
export const UPDATE_SECONDARY_INFORMATION = '/secInfo/update';

export const SET_ASSOCIATE_PROFILE = '/associateMgt/set';
export const GET_ASSOCIATE_PROFILE = '/associateMgt/get';

export const UPDATE_ASSOCIATE_PROFILE = '/associateMgt/update';

export const FIND_USER_ID = '/userMgt/find';
export const CREATE_USER = '/userMgt/set';
export const LOGIN_USER = '/userMgt/login';
export const SET_USER_GROUP = '/userMgt/setGroups';
export const GET_ALL_USER_GROUPS = '/userMgt/allGroups';
export const GET_ALL_USERS = '/userMgt/allUsers';
export const GET_PRIVILEDGES = '/userMgt/allPrev';
export const GIVE_PRIVILEDGES = '/userMgt/givRights';
export const GET_PRIVILEDGES_GROUP = '/userMgt/getRights';
export const CREATE_INQUIRY = '/inquiryMgt/create';
//export const GET_ALL_INQUIRY="/inquiryMgt/all"
export const FIND_SUBJECT_ID = '/searchMgt/find';

export const GET_ALL_INQUIRY = '/inquiryMgt/myInquries';
export const GET_CASE_DETAILS = '/inquiryMgt/get';

export const PRINT_CASE = '/printSubject/report';
export const PRINT_BATCH = '/printSubject/mreport'

export const TRANSFER_CASE = '/inquiryMgt/transfer';
export const UPDATE_CASE = '/inquiryMgt/update';
export const SET_PROPERTY = '/propertyMgt/set';
export const GET_PROPERTY = '/propertyMgt/get';
export const UPDATE_PROPERTY = '/propertyMgt/update';

export const CREATE_TASK = '/taskMgt/create';
export const GET_MY_TASKS = '/taskMgt/myTasks';
export const EXPORT_PROFILE = '/searchMgt/export';

export const SET_COMPANY = '/propertyMgt/setCompany';
export const GET_COMPANY = '/propertyMgt/getCompany';
export const UPDATE_COMPANY = '/propertyMgt/updateCompany';

export const SET_INTEGRITY = '/integrity/setInteg';
export const GET_INTEGRITY = '/integrity/getInteg';
export const UPDATE_INTEGRITY = '/integrity/updateInteg';

export const SET_AGENCY = '/integrity/setAgency';
export const GET_AGENCY = '/integrity/getAgency';
export const UPDATE_AGENCY = '/integrity/updateAgency';

export const GET_USER_STATS = '/stats/user';
export const GET_COMM_STATS = '/stats/global';

export const SET_TRAVEL = '/propertyMgt/setTravel';
export const GET_TRAVEL = '/propertyMgt/getTravel';
export const UPDATE_TRAVEL = '/propertyMgt/updateTravel';

export const SET_TAXES = '/taxInfo/set';
export const GET_TAXES = '/taxInfo/get';
export const UPDATE_TAXES = '/taxInfo/update';

export const SET_DECLARATIONS = '/propertyMgt/setDeclarations';
export const GET_DECLARATIONS = '/propertyMgt/getDeclarations';
export const UPDATE_DECLARATIONS = '/propertyMgt/updateDeclarations';

export const SEARCH_BATCH = '/searchMgt/batch';
export const MY_BATCH = '/searchMgt/myBatch';
export const ASSIGN_BATCH = '/searchMgt/assignBatch';
export const BATCH_LIST = '/searchMgt/batchList';
export const OPEN_INDIVIDUAL_CASES = '/searchMgt/bulkAssign'
export const MY_COMPLETED_CASES ='/inquiryMgt/myClosed'
export const AUDIT_TRAIL = '/userMgt/alltrail'