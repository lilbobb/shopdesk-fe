"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from "react";

import { GoTrash } from "react-icons/go";
import { FaXmark } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useDeleteAccountMutation } from "@/redux/features/auth/auth.api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeactivateModal({
  children,
}: {
  children: React.ReactElement;
}) {
  const [deleteAccount, { isLoading: deleteLoading }] =
    useDeleteAccountMutation();
  const router = useRouter();
  async function handleDelete() {
    try {
      await deleteAccount("delete").unwrap();
      toast.success("User account successfully deactivated!");
      router.push("/");
    } catch (err) {
      toast.success("Failed to deactivate user!");
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="p-0">
        <AlertDialogHeader className="flex items-center justify-center relative pt-6">
          <AlertDialogCancel className="absolute left-[90%] bottom-[70%] w-fit rounded-[9px] border border-[#1B1B1B] text-[#2A2A2A]  !p-[9px] ">
            <FaXmark />
          </AlertDialogCancel>
          <AlertDialogTitle className="flex flex-col items-center gap-1 px-4">
            <div className="bg-[#FEF6F6] rounded-[8px] p-2 w-fit">
              <GoTrash className="text-[#FF1925] text-2xl" />
            </div>
            <p className="text-2xl font-[500] text-[#1B1B1B] text-center">
              Are you sure you want to deactivate your account?
            </p>
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-1 text-center px-4">
            <p className="text-[#717171] text-lg font-[300] text-center">
              Once deactivated you won&apos;t be able to access your data. You can
              reactivate by logging in again. Do you still want to proceed?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="w-full flex items-center rounded-b-2xl justify-center py-6 border border-[#DEE5ED] bg-[#F6F8FA]">
          <AlertDialogFooter className=" w-[95%] flex items-center  justify-center">
            <AlertDialogCancel className="w-[50%] border border-[#1B1B1B] text-[#2A2A2A] rounded-[12px] py-3 px-6">
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="w-[50%] bg-[#FF1925] hover:bg-[#FF1925] border-[#B20000] border rounded-[12px] py-3 px-6"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                  Deactivating...
                </>
              ) : (
                <>Deactivate</>
              )}
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
