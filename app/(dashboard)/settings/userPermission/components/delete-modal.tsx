import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Suspended';
  permissions?: {
    canManageOrders: boolean;
    canViewReports: boolean;
    canEditStore: boolean;
    canChangeBilling: boolean;
    canDeleteStore: boolean;
  };
}

interface DeleteUserModalProps {
  user: User;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteUserModal = ({ user, onClose, onConfirm }: DeleteUserModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-[611px] h-[316px] rounded-[14px] border border-gray-200 flex flex-col overflow-hidden shadow-xl">
        <div className="relative p-6 flex flex-col items-center mt-4">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-lg bg-red-50 flex items-center justify-center p-2">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <h2 className="font-medium text-2xl leading-9 mt-2 text-gray-900">
              Remove User
            </h2>
          </div>
          <button
            className="absolute top-4 right-6 w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="px-6 flex-1 flex items-center justify-center text-center">
          <p className="font-medium text-2xl leading-9 text-gray-600 px-4">
            Are you sure you want to remove this User?
          </p>
        </div>

        <div className="w-full flex justify-center gap-3 p-6  mt-3 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            className="w-[272px] h-12 rounded-xl border-gray-300 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="w-[272px] h-12 rounded-xl hover:bg-red-600"
            onClick={onConfirm}
          >
            Deactivate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;