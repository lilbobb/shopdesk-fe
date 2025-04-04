import { Button } from "@/components/ui/button";
import { User, X, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Suspended';
  permissions: {
    canManageOrders: boolean;
    canViewReports: boolean;
    canEditStore: boolean;
    canChangeBilling: boolean;
    canDeleteStore: boolean;
  };
}

interface AddUserModalProps {
  onClose: () => void;
  onSave: (newUser: User) => void;
}

const AddUserModal = ({ onClose, onSave }: AddUserModalProps) => {
  const [newUser, setNewUser] = useState<User>({
    id: crypto.randomUUID(), 
    name: '',
    email: '',
    role: 'Admin', 
    status: 'Active',
    permissions: {
      canManageOrders: false,
      canViewReports: false,
      canEditStore: false,
      canChangeBilling: false,
      canDeleteStore: false,
    },
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFieldChange = (field: keyof User, value: string) => {
    setNewUser({ ...newUser, [field]: value });
  };

  const handlePermissionChange = (permission: keyof User['permissions']) => {
    setNewUser({
      ...newUser,
      permissions: {
        ...newUser.permissions,
        [permission]: !newUser.permissions[permission],
      },
    });
  };

  const handleRoleSelect = (role: string) => {
    handleFieldChange('role', role);
    setIsDropdownOpen(false);
  };

  const handleAddNewUser = () => {
    onSave(newUser);
    onClose(); 
  };

  const roles = ['Admin', 'Staff', 'Manager'];

  return (
    <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center">
      <div className="bg-white w-full max-w-[611px] max-h-[90vh] overflow-y-auto border border-gray-300 rounded-[14px] flex flex-col">
        <div className="flex items-center justify-between p-6 border-gray-300">
          <div className="flex items-center gap-[10px]">
            <div className="w-[56px] h-[56px] rounded-lg p-2 bg-[#E5F5ED] flex items-center justify-center">
              <User className="h-6 w-6 text-[#009A49]" />
            </div>
            <h2 className="font-medium text-2xl leading-9 tracking-normal">
              Add New User
            </h2>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="w-[563px] h-[68px] flex flex-col gap-[20px]">
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="Name"
              className="w-full border border-gray-300 rounded px-3 py-3 bg-[#F8FAFB]"
            />
          </div>
          <div className="w-[563px] h-[68px] flex flex-col gap-[20px]">
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder="Email"
              className="w-full border border-gray-300 rounded px-3 py-3 bg-[#F8FAFB]"
            />
          </div>
          <div className="w-[563px] h-[68px] flex flex-col gap-[20px]">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full h-full border border-gray-300 rounded px-3 py-3 bg-[#F8FAFB] flex items-center justify-between"
              >
                <span>{newUser.role}</span>
                {isDropdownOpen ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 right-0 mt-1 w-[255px] h-[172px] bg-white border border-gray-300 rounded-[12px] shadow-lg overflow-hidden">
                  {roles.map((role) => (
                    <div
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className={`px-3 py-2 cursor-pointer hover:bg-[#E9EEF3] ${
                        newUser.role === role ? 'bg-[#E9EEF3]' : ''
                      }`}
                    >
                      {role}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium mb-3 text-[#414651]">Permissions</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="manage-orders"
                  checked={newUser.permissions.canManageOrders}
                  onCheckedChange={() => handlePermissionChange('canManageOrders')}
                  className="h-5 w-5 data-[state=checked]:bg-[#009A49]"
                />
                <label htmlFor="manage-orders" className="text-sm text-[#2A2A2A] cursor-pointer">Can Manage Orders</label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="view-reports"
                  checked={newUser.permissions.canViewReports}
                  onCheckedChange={() => handlePermissionChange('canViewReports')}
                  className="h-5 w-5 data-[state=checked]:bg-[#009A49]"
                />
                <label htmlFor="view-reports" className="text-sm text-[#2A2A2A] cursor-pointer">Can View Reports</label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="edit-store"
                  checked={newUser.permissions.canEditStore}
                  onCheckedChange={() => handlePermissionChange('canEditStore')}
                  className="h-5 w-5 data-[state=checked]:bg-[#009A49]"
                />
                <label htmlFor="edit-store" className="text-sm text-[#2A2A2A] cursor-pointer">Can Edit Store</label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="change-billing"
                  checked={newUser.permissions.canChangeBilling}
                  onCheckedChange={() => handlePermissionChange('canChangeBilling')}
                  className="h-5 w-5 data-[state=checked]:bg-[#009A49]"
                />
                <label htmlFor="change-billing" className="text-sm text-[#2A2A2A] cursor-pointer">Change Billing Details</label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="delete-store"
                  checked={newUser.permissions.canDeleteStore}
                  onCheckedChange={() => handlePermissionChange('canDeleteStore')}
                  className="h-5 w-5 data-[state=checked]:bg-[#009A49]"
                />
                <label htmlFor="delete-store" className="text-sm text-[#2A2A2A] cursor-pointer">Delete Store</label>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end gap-5 p-6 border-t border-gray-300 bg-[#F8FAFB]">
          <Button
            variant="outline"
            className="w-[272px] h-[48px] border border-[#2A2A2A] rounded-[12px] pt-3 pr-6 pb-3 pl-6"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="w-[272px] h-[48px] rounded-[12px] pt-3 pr-6 pb-3 pl-6 bg-primary text-white hover:bg-primary-dark"
            onClick={handleAddNewUser}
          >
            Add New User
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;