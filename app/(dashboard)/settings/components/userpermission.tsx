"use client"

import { Button } from "@/components/ui/button";
import { Search, Pencil, Trash2, ChevronDown, ChevronUp, ListFilter } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from "@/redux/store";
import { setSearchTerm, setCurrentPage, deleteUser, updateUser, addUser } from '@/redux/userpermissionslice';
import { useState, useRef, useEffect } from 'react';
import EditUserModal from '@/app/(dashboard)/settings/userPermission/components/edit-modal';
import DeleteUserModal from '@/app/(dashboard)/settings/userPermission/components/delete-modal';
import AddUserModal from '@/app/(dashboard)/settings/userPermission/components/add-new-user';
import { Checkbox } from '@/components/ui/checkbox';

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
  permissions: UserPermissions;
}

const UserPermission = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, searchTerm, currentPage, totalPages } = useSelector((state: RootState) => state.users);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const withPermissions = (user: any): User => ({
    ...user,
    permissions: user.permissions || {
      canManageOrders: false,
      canViewReports: false,
      canEditStore: false,
      canChangeBilling: false,
      canDeleteStore: false
    }
  });

  const filteredUsers = users
    .filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map(withPermissions);

  const usersPerPage = 10;
  const totalFilteredPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalFilteredPages) {
      dispatch(setCurrentPage(newPage));
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser(withPermissions(user));
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: any) => {
    setSelectedUser(withPermissions(user));
    setIsDeleteModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const closeAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };

  const handleSaveChanges = (updatedUser: User) => {
    dispatch(updateUser({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status
    }));
    closeEditModal();
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      dispatch(deleteUser(selectedUser.id));
    }
    closeDeleteModal();
  };

  const handleAddUser = (newUser: User) => {
    dispatch(addUser(newUser));
    closeAddUserModal();
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setIsDropdownOpen(false);
  };

  const roles = ['Admin', 'Editor', 'Viewer'];

  return (
    <div className="container mx-auto px-4 ">
      <div className="flex flex-row w-full justify-between items-center gap-4 md:border-b border-[#e9eaeb] pb-6">
        <div className="w-full flex flex-col gap-1 text-[#181d27]">
          <p className="text-xl font-medium leading-7">User Permission Settings</p>
          <p className="text-[#535862] font-light leading-5 text-base">
            Control team access by assigning roles and managing permissions
          </p>
        </div>
        <div className="flex flex-row gap-3 mt-4 md:mt-0">
          <Button
            className="w-[170px] h-[48px] rounded-[12px] border border-primary bg-primary text-white hover:bg-primary-dark"
            onClick={() => setIsAddUserModalOpen(true)}
          >
            + Add New User
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center max-w-[1315px] w-full h-[31px] mb-5">
          <h2 className="text-lg text-[#414651]">User Management</h2>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-[314px] h-[48px] rounded-[9px] border border-gray-300 flex items-center px-3">
              <Search className="text-gray-400 mr-2 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users..."
                className="flex-1 outline-none text-sm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <button className="w-[94px] h-[48px] rounded-[10px] border border-gray-300 flex items-center justify-center gap-[10px] px-3">
              <ListFilter className="text-gray-600 h-4 w-4" />
              <span className="text-sm text-[#667085]">Filter</span>
            </button>
          </div>
        </div>

        <div className="w-full rounded-lg border border-gray-300 shadow-[0_1px_2px_0_rgba(10,13,18,0.06),0_1px_3px_0_rgba(10,13,18,0.1)] flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="h-11 text-[#414651] bg-gray-50 border-b border-gray-200 w-[25%]">
                    <span className="pr-46 md:pl-16">  Name</span>
                  </th>
                  <th className="h-11 text-[#414651] bg-gray-50 border-b border-gray-200 py-3 text-left w-[30%]">
                    <span className="pl-6">  Email</span>
                  </th>
                  <th className="h-11 text-[#414651] bg-gray-50 border-b border-gray-200 py-3 text-left w-[15%]">
                    Role
                  </th>
                  <th className="h-11 text-[#414651] bg-gray-50 border-b border-gray-200 py-3 text-left w-[15%]">
                    Status
                  </th>
                  <th className="h-11 text-[#414651] bg-gray-50 border-b border-gray-200 py-3 text-left w-[15%]"><span className="pl-6">
                    Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200 h-[56px] hover:bg-gray-50">
                    <td className="py-4 align-middle text-sm text-[#49495A] text-left"><span className="px-2 pl-16 rounded-full text-xs font-medium text-[#49495A]">
                      {user.name}</span>
                    </td>
                    <td className="py-4 align-middle text-sm text-[#49495A] text-left"><span className="px-2 pl-6">
                      {user.email}</span>
                    </td>
                    <td className="py-4 align-middle text-sm text-[#49495A] text-left">
                      {user.role}
                    </td>
                    <td className="py-4 align-middle text-left">
                      <span className="px-2 py-1 rounded-full text-xs font-medium text-[#49495A]">
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 pl-6 align-middle text-left">
                      <div className="flex pl-6 gap-6">
                        <button
                          className="text-gray-500 transition-colors"
                          onClick={() => openDeleteModal(user)}
                        >
                          <Trash2 className="h-4 w-4 cursor-pointer" />
                        </button>
                        <button
                          className="text-gray-500 transition-colors"
                          onClick={() => openEditModal(user)}
                        >
                          <Pencil className="h-4 w-4 cursor-pointer" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center px-16 py-4  border-t border-gray-200">
            <button
              className="w-[87px] h-9 rounded-lg border border-gray-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <span>Previous</span>
            </button>
            <div className="text-sm text-gray-600">Page {currentPage} of {totalFilteredPages}</div>
            <button
              className="w-[60px] h-9 rounded-lg border border-gray-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              disabled={currentPage === totalFilteredPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <span>Next</span>
            </button>
          </div>
        </div>
      </div>

      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={closeEditModal}
          onSave={handleSaveChanges}
        />
      )}

      {isDeleteModalOpen && selectedUser && (
        <DeleteUserModal
          user={selectedUser}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {isAddUserModalOpen && (
        <AddUserModal
          onClose={closeAddUserModal}
          onSave={handleAddUser}
        />
      )}

      {!isEditModalOpen && !isAddUserModalOpen && (
        <div className="mt-8 max-w-[1315px] w-full flex flex-col gap-5">
          <h2 className="text-lg text-[#414651]">Role Assignment</h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-40 items-center">
              <h3 className="text-md font-medium text-[#2A2A2A]">User Role</h3>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-[255px] h-[48px] border border-gray-300 rounded px-3 py-3 bg-[#F8FAFB] flex items-center justify-between cursor-pointer"
                >
                  <span>{selectedRole}</span>
                  {isDropdownOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 right-0 mt-1 w-[200px] h-[172px] bg-white border border-gray-300 rounded-[12px] shadow-lg overflow-hidden">
                    {roles.map((role) => (
                      <div
                        key={role}
                        onClick={() => handleRoleSelect(role)}
                        className={`px-3 py-2 cursor-pointer hover:bg-[#E9EEF3] ${selectedRole === role ? 'bg-[#E9EEF3]' : ''}`}
                      >
                        {role}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-16">
              <h3 className="text-md font-medium mb-3 text-[#2A2A2A]">Customer Permissions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="manage-orders"
                      className="data-[state=checked]:bg-[#009A49]"
                    />
                    <label htmlFor="manage-orders" className="text-sm text-[#2A2A2A]">Can Manage Orders</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="view-reports"
                      className="data-[state=checked]:bg-[#009A49]"
                    />
                    <label htmlFor="view-reports" className="text-sm text-[#2A2A2A]">Can View Reports</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="edit-store"
                      className="data-[state=checked]:bg-[#009A49]"
                    />
                    <label htmlFor="edit-store" className="text-sm text-[#2A2A2A]">Can Edit Store</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="change-billing"
                      className="data-[state=checked]:bg-[#009A49]"
                    />
                    <label htmlFor="change-billing" className="text-sm text-[#2A2A2A]">Change Billing Details</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="delete-store"
                      className="data-[state=checked]:bg-[#009A49]"
                    />
                    <label htmlFor="delete-store" className="text-sm text-[#2A2A2A]">Delete Store</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPermission;