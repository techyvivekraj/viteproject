import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import orgSlice from './slices/orgSlice';
import networkSlice from './slices/networkSlice';
import rolesSlice from './slices/rolesSlice';
import assetsSlice from './slices/assetsSlice';
import shiftSlice from './slices/shiftSlice';
import themeSlice from './slices/themeSlice';
import employeesSlice from './slices/employeesSlice';
import attendanceReducer from './slices/attendanceSlice';
import overtimeReducer from './slices/overtimeSlice';
import advanceSlice from './slices/advanceSlice';
import finesSlice from './slices/finesSlice';
import remarkSlice from './slices/remarkSlice';
import expensesSlice from './slices/expensesSlice';
import dashboardReducer from './slices/dashboardSlice';
import holidayReducer from './slices/holidaySlice';
import leavesSlice from './slices/leavesSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        theme: themeSlice,
        organization: orgSlice,
        network: networkSlice,
        roles: rolesSlice,
        assets: assetsSlice,
        shifts: shiftSlice,
        employees: employeesSlice,
        attendance: attendanceReducer,
        overtime: overtimeReducer,
        advance: advanceSlice,
        fines: finesSlice,
        remark: remarkSlice,
        expenses:expensesSlice,
        dashboard: dashboardReducer,
        holidays: holidayReducer,
        leaves: leavesSlice,
    },
});

export default store;