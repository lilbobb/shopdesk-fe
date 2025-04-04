import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserPermissions {
  canManageOrders: boolean;
  canViewReports: boolean;
  canEditStore: boolean;
  canChangeBilling: boolean;
  canDeleteStore: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Suspended';
  permissions?: UserPermissions;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
  isSystemRole: boolean;
}

interface UsersState {
  users: User[];
  roles: Role[];
  permissions: Permission[];
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  auditLog: AuditLogEntry[];
}

interface AuditLogEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: Date;
  performedBy: string;
  changes: Record<string, any>;
}

const systemPermissions: Permission[] = [
  { id: 'user:create', name: 'Create Users', description: 'Create new user accounts', category: 'Users' },
  { id: 'user:read', name: 'View Users', description: 'View user accounts', category: 'Users' },
  { id: 'user:update', name: 'Edit Users', description: 'Modify user accounts', category: 'Users' },
  { id: 'user:delete', name: 'Delete Users', description: 'Remove user accounts', category: 'Users' },
  { id: 'role:create', name: 'Create Roles', description: 'Create new roles', category: 'Roles' },
  { id: 'role:read', name: 'View Roles', description: 'View role definitions', category: 'Roles' },
  { id: 'role:update', name: 'Edit Roles', description: 'Modify role permissions', category: 'Roles' },
  { id: 'role:delete', name: 'Delete Roles', description: 'Remove roles', category: 'Roles' },
];

const systemRoles: Role[] = [
  {
    id: 'admin',
    name: 'Admin',
    permissions: systemPermissions.map(p => p.id),
    isSystemRole: true
  },
  {
    id: 'editor',
    name: 'Editor',
    permissions: systemPermissions
      .filter(p => !p.id.startsWith('role:') && !p.id.endsWith(':delete'))
      .map(p => p.id),
    isSystemRole: true
  },
  {
    id: 'viewer',
    name: 'Viewer',
    permissions: ['user:read', 'role:read'],
    isSystemRole: true
  }
];

const initialState: UsersState = {
  users: [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'Active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'editor', status: 'Active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'viewer', status: 'Suspended' },
    { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'editor', status: 'Suspended' },
    { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'viewer', status: 'Active' },
  ],
  roles: systemRoles,
  permissions: systemPermissions,
  searchTerm: '',
  currentPage: 1,
  totalPages: 1,
  auditLog: []
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
      state.totalPages = Math.ceil(state.users.length / 10);
      state.auditLog.push({
        id: Date.now().toString(),
        action: 'CREATE',
        entity: 'User',
        entityId: action.payload.id,
        timestamp: new Date(),
        performedBy: 'current-user-id',
        changes: action.payload
      });
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        const oldUser = state.users[index];
        state.users[index] = action.payload;

        const changes: Record<string, any> = {};
        (Object.keys(action.payload) as Array<keyof User>).forEach(key => {
          if (oldUser[key] !== action.payload[key]) {
            changes[key] = {
              old: oldUser[key],
              new: action.payload[key]
            };
          }
        });

        state.auditLog.push({
          id: Date.now().toString(),
          action: 'UPDATE',
          entity: 'User',
          entityId: action.payload.id,
          timestamp: new Date(),
          performedBy: 'current-user-id',
          changes
        });
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      const user = state.users.find(u => u.id === action.payload);
      if (user) {
        state.users = state.users.filter(user => user.id !== action.payload);
        state.totalPages = Math.ceil(state.users.length / 10);
        state.auditLog.push({
          id: Date.now().toString(),
          action: 'DELETE',
          entity: 'User',
          entityId: action.payload, 
          timestamp: new Date(),   
          performedBy: 'current-user-id',
          changes: user
        });
      }
    },
    addRole: (state, action: PayloadAction<Omit<Role, 'id' | 'isSystemRole'>>) => {
      const newRole = {
        ...action.payload,
        id: Date.now().toString(),
        isSystemRole: false
      };
      state.roles.push(newRole);
      state.auditLog.push({
        id: Date.now().toString(),
        action: 'CREATE',
        entity: 'Role',
        entityId: newRole.id,
        timestamp: new Date(),
        performedBy: 'current-user-id',
        changes: newRole
      });
    },
    updateRole: (state, action: PayloadAction<Role>) => {
      const index = state.roles.findIndex(role => role.id === action.payload.id);
      if (index !== -1 && !state.roles[index].isSystemRole) {
        const oldRole = state.roles[index];
        state.roles[index] = action.payload;

        const changes: Record<string, any> = {};
        if (oldRole.name !== action.payload.name) {
          changes.name = {
            old: oldRole.name,
            new: action.payload.name
          };
        }

        const added = action.payload.permissions.filter(p => !oldRole.permissions.includes(p));
        const removed = oldRole.permissions.filter(p => !action.payload.permissions.includes(p));

        if (added.length > 0 || removed.length > 0) {
          changes.permissions = {
            added,
            removed
          };
        }

        state.auditLog.push({
          id: Date.now().toString(),
          action: 'UPDATE',
          entity: 'Role',
          entityId: action.payload.id,
          timestamp: new Date(),
          performedBy: 'current-user-id',
          changes
        });
      }
    },
    deleteRole: (state, action: PayloadAction<string>) => {
      const role = state.roles.find(r => r.id === action.payload);
      if (role && !role.isSystemRole) {
        const usersWithRole = state.users.filter(u => u.role === action.payload);
        if (usersWithRole.length === 0) {
          state.roles = state.roles.filter(role => role.id !== action.payload);
          state.auditLog.push({
            id: Date.now().toString(),
            action: 'DELETE',
            entity: 'Role',
            entityId: action.payload,
            timestamp: new Date(),
            performedBy: 'current-user-id',
            changes: role
          });
        }
      }
    },
    clearAuditLog: (state) => {
      state.auditLog = [];
    }
  },
});

export const {
  setSearchTerm,
  setCurrentPage,
  addUser,
  updateUser,
  deleteUser,
  addRole,
  updateRole,
  deleteRole,
  clearAuditLog
} = usersSlice.actions;

export default usersSlice.reducer;