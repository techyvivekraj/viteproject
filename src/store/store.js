import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import deptSlice from './slices/organisation/deptSlice';
// import networkSlice from './slices/networkSlice';
import assetsSlice from './slices/organisation/assetsSlice';
// import shiftSlice from './slices/shiftSlice';
// import themeSlice from './slices/themeSlice';
import employeesSlice from './slices/employeesSlice';
import holidaySlice from './slices/organisation/holidaySlice';
import rolesSlice from './slices/organisation/rolesSlice';
import shiftSlice from './slices/organisation/shiftSlice';
// import attendanceReducer from './slices/attendanceSlice';
// import overtimeReducer from './slices/overtimeSlice';
// import advanceSlice from './slices/advanceSlice';
// import finesSlice from './slices/finesSlice';
// import remarkSlice from './slices/remarkSlice';
// import expensesSlice from './slices/expensesSlice';
// import dashboardReducer from './slices/dashboardSlice';
// import holidaySlice from './slices/holidaySlice';
// import leavesSlice from './slices/leavesSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        departments: deptSlice,
        assets: assetsSlice,
        employees: employeesSlice,
        holidays: holidaySlice,
        roles: rolesSlice,
        shifts: shiftSlice,
        // theme: themeSlice,
        // network: networkSlice,
        // attendance: attendanceReducer,
        // overtime: overtimeReducer,
        // advance: advanceSlice,
        // fines: finesSlice,
        // remark: remarkSlice,
        // expenses:expensesSlice,
        // dashboard: dashboardReducer,
        // leaves: leavesSlice,
    },
});

export default store;