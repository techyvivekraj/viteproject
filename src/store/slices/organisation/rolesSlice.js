import { createSlice } from '@reduxjs/toolkit';
import {
  fetchRoles,
  addRoles,
  updateRole,
  deleteRole,
  fetchRolePermissions,
  updateRolePermissions
} from '../../actions/organisation/roles';

const initialState = {
  roles: [],
  permissions: {},
  loading: false,
  error: null,
  lastFetch: null,
  addRoleStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  addRoleError: null,
  updateStatus: 'idle',
  updateError: null,
  permissionsLoading: false,
  permissionsError: null
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    resetAddRoleStatus: (state) => {
      state.addRoleStatus = 'idle';
      state.addRoleError = null;
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
      state.updateError = null;
    },
    clearPermissions: (state) => {
      state.permissions = {};
      state.permissionsError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
        state.loading = false;
        state.lastFetch = Date.now();
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Role
      .addCase(addRoles.pending, (state) => {
        state.addRoleStatus = 'loading';
        state.addRoleError = null;
      })
      .addCase(addRoles.fulfilled, (state, action) => {
        state.roles.push(action.payload);
        state.addRoleStatus = 'succeeded';
      })
      .addCase(addRoles.rejected, (state, action) => {
        state.addRoleStatus = 'failed';
        state.addRoleError = action.payload;
      })

      // Update Role
      .addCase(updateRole.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex(role => role.roleId === action.payload.roleId);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        state.updateStatus = 'succeeded';
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
      })

      // Delete Role
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter(role => role.roleId !== action.payload.roleId);
        // Also clear permissions if they were loaded for this role
        if (state.permissions[action.payload.roleId]) {
          delete state.permissions[action.payload.roleId];
        }
      })

      // Fetch Role Permissions
      .addCase(fetchRolePermissions.pending, (state) => {
        state.permissionsLoading = true;
        state.permissionsError = null;
      })
      .addCase(fetchRolePermissions.fulfilled, (state, action) => {
        state.permissions[action.meta.arg] = action.payload; // Store permissions by roleId
        state.permissionsLoading = false;
      })
      .addCase(fetchRolePermissions.rejected, (state, action) => {
        state.permissionsLoading = false;
        state.permissionsError = action.payload;
      })

      // Update Role Permissions
      .addCase(updateRolePermissions.fulfilled, (state, action) => {
        const { roleId } = action.meta.arg;
        state.permissions[roleId] = action.payload;
      });
  }
});

// Export actions
export const {
  resetAddRoleStatus,
  resetUpdateStatus,
  clearPermissions
} = rolesSlice.actions;

// Export selectors
export const selectRoles = (state) => state.roles.roles;
export const selectLoading = (state) => state.roles.loading;
export const selectError = (state) => state.roles.error;
export const selectLastFetch = (state) => state.roles.lastFetch;
export const selectAddRoleStatus = (state) => state.roles.addRoleStatus;
export const selectAddRoleError = (state) => state.roles.addRoleError;
export const selectUpdateStatus = (state) => state.roles.updateStatus;
export const selectUpdateError = (state) => state.roles.updateError;
export const selectPermissions = (roleId) => (state) => state.roles.permissions[roleId];
export const selectPermissionsLoading = (state) => state.roles.permissionsLoading;
export const selectPermissionsError = (state) => state.roles.permissionsError;

// Export reducer
export default rolesSlice.reducer; 