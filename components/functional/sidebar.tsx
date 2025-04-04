import type React from "react";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  closeEditModal,
  openEditQuantity,
  closeEditQuantity,
  openEditPrice,
  closeEditPrice,
  openSuccessModal,
  closeSuccessModal,
  openImageUploader,
  closeImageUploader,
  openEditImageModal,
  closeEditImageModal,
  saveItem,
  openEditName
} from "@/redux/features/sidebar";
import ImageUploader from "@/components/modal/add-image";
import { Button } from "@/components/ui/button";
import EditStockV3Modal from "../modal/modalV3/edit-stock";
import EditPriceModal from "../modal/modalV3/edit-price";
import EditStockName from "../modal/modalV3/edit-name";
import EditQuantityModal from "../modal/modalV3/edit-quantity";
import EditSuccessModal from "../modal/modalV3/edit-success";
import EditImage from "../modal/edit-image";
import Logo from "./logo";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface SidebarProps {
  selectedItem: any;
  setSelectedItem: React.Dispatch<React.SetStateAction<any>>;
  onItemUpdate: (updatedItem: any) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedItem, 
  setSelectedItem, 
  onItemUpdate,
  onClose 
}) => {
  const dispatch = useAppDispatch();
  const {
    isEditModalOpen,
    isEditQuantityOpen,
    isEditPriceOpen,
    isSuccessModalOpen,
    isImageUploaderOpen,
    isEditImageModalOpen,
  } = useAppSelector((state) => state.sidebar);
  const productImages = useSelector(
    (state: RootState) => state.productImages.images
  );

  const handleSaveImages = (images: { filename: string; url: string }[]) => {
    const updatedItem = {
      ...selectedItem,
      images: images,
      image: images.length > 0 ? images[0] : null,
    };
    
    setSelectedItem(updatedItem);
    onItemUpdate(updatedItem);
    
    dispatch(
      saveItem({
        ...updatedItem,
        supplier: updatedItem.supplier || { id: "", name: "Unknown Supplier" },
      })
    );
    
    const closeModal = () => {
      if (isImageUploaderOpen) {
        dispatch(closeImageUploader());
      } else {
        dispatch(closeEditImageModal());
      }
    };
    closeModal();
  };

  const handleSavePrice = (updatedPrice: number) => {
    const updatedItem = { 
      ...selectedItem, 
      buying_price: updatedPrice 
    };
    
    setSelectedItem(updatedItem);
    onItemUpdate(updatedItem);
    
    dispatch(
      saveItem({
        ...updatedItem,
        supplier: typeof updatedItem.supplier === 'string' ? updatedItem.supplier : null,
      })
    );
    
    dispatch(closeEditPrice());
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
        onKeyDown={onClose}
      />

      {/* Main sidebar container */}
      <div className='fixed inset-y-0 right-0 z-40 w-full h-full max-w-[100vw] bg-white lg:relative lg:w-[356px] lg:border lg:border-[#DEE5ED] flex flex-col overflow-y-auto rounded-lg'>
        {/* Desktop header */}
        <div className='hidden lg:flex px-4 py-6 items-center justify-between border-b border-[#DEE5ED]'>
          <h2 className='text-2xl font-semibold'>{selectedItem.name}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* Mobile header */}
        <div className='lg:hidden flex items-center justify-between px-4 py-6 border-b border-[#DEE5ED] sticky top-0 bg-white z-10'>
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className='flex-1 overflow-y-auto p-4 flex flex-col justify-evenly'>
          <div className="flex justify-between items-center p-3 mb-3 rounded-md bg-[#F8FAFB]">
            <div>
              <p className="text-[#717171] text-sm">Product name</p>
              <p className="text-[#2A2A2A] font-medium">
                {selectedItem?.name || selectedItem?.productName || "No name"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dispatch(openEditName())}
              className="text-sm font-medium px-4 py-2 border border-[#A0A0A0] rounded-xl lg:border-none lg:text-[#009A49]"
            >
              Edit
            </button>
          </div>

          {/* Other fields */}
          {[
            {
              label: "Cost Price",
              value:
                selectedItem?.buying_price || selectedItem?.cost_price || "N/A",
              editable: true,
            },
            {
              label: "Sell Price",
              value:
                selectedItem?.buying_price || selectedItem?.sell_price || "N/A",
              editable: true,
            },
            {
              label: 'Discount',
              value: selectedItem?.discount || 'Not Set',
              editable: true,
              showAdd: !selectedItem?.discount,
            },
            {
              label: "Available",
              value: selectedItem?.stock || selectedItem?.quantity || "N/A",
              editable: true,
            },
            {
              label: "Quantity Sold",
              value:
                selectedItem?.original_quantity ||
                selectedItem?.sold ||
                "Not Set",
              editable: false,
            },
            {
              label: "Image",
              value: productImages?.length ? "Image Set" : "Not Set",
              editable: true,
            },
          ].map((item) => (
            <div
              key={Math.random()}
              className="flex justify-between items-center p-3 mb-3 rounded-md bg-[#F8FAFB]"
            >
              <div>
                <p className='text-gray-500 text-lg'>{item.label}</p>
                <p className='text-gray-900 font-medium text-xl'>{item.value}</p>
              </div>
              {item.editable && (
                <button
                  type="button"
                  onClick={() => {
                    if (item.label === "Image") {
                      if (productImages?.length) {
                        dispatch(openEditImageModal());
                      } else {
                        dispatch(openImageUploader());
                      }
                    } else if (item.label.includes("Price")) {
                      dispatch(openEditPrice());
                    } else if (item.label === "Available") {
                      dispatch(openEditQuantity());
                    } else if (item.label === 'Discount') console.log('Discount clicked');
                  }}
                  className='hover:cursor-pointer text-lg font-medium px-6 py-2 border border-[#A0A0A0] rounded-xl lg:border-none lg:text-[#009A49]'
                >
                  {(item.label === 'Image' || item.label === 'Discount') && item.showAdd ? 'Add' : 'Edit'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Mobile buttons */}
        <div className='lg:hidden p-6 border-t border-[#E9EEF3] sticky bottom-0 bg-white'>
          <Button className='w-full mb-3 bg-gray-200 text-gray-800 hover:bg-gray-300 h-16 text-lg'>
            Save
          </Button>
          <Button className='w-full bg-white text-red-600 border border-red-600 hover:bg-red-50 h-16 text-lg'>
            Delete Stock
          </Button>
        </div>
      </div>

      <div className="fixed z-60">
        {isEditImageModalOpen && (
          <EditImage
            isOpen={isEditImageModalOpen}
            itemName={selectedItem.name}
            onCancel={() => dispatch(closeEditImageModal())}
            onSave={handleSaveImages}
            onDeleteImage={() => void 0}
            product_id={selectedItem.product_id}
          />
        )}

        {isEditModalOpen && (
          <EditStockV3Modal
            isOpen={isEditModalOpen}
            item={selectedItem}
            onClose={() => dispatch(closeEditModal())}
            onSave={(updatedItem) => {
              dispatch(saveItem(updatedItem));
              dispatch(closeEditModal());
            }}
            openSuccessModal={() => dispatch(openSuccessModal())}
          />
        )}

        {isEditQuantityOpen && (
          <EditQuantityModal
            isOpen={isEditQuantityOpen}
            item={selectedItem}
            onClose={() => dispatch(closeEditQuantity())}
            onSave={(updatedItem) => {
              setSelectedItem(updatedItem);
              onItemUpdate(updatedItem);
              dispatch(saveItem({
                ...updatedItem,
                supplier: typeof updatedItem.supplier === 'string' ? updatedItem.supplier : null,
              }));
              dispatch(closeEditQuantity());
            }}
            openSuccessModal={() => dispatch(openSuccessModal())}
          />
        )}

        {isSuccessModalOpen && (
          <EditSuccessModal
            isOpen={isSuccessModalOpen}
            onClose={() => {
              dispatch(closeSuccessModal())
            }}
          />
        )}

        {isEditPriceOpen && (
          <EditPriceModal
            isOpen={isEditPriceOpen}
            onClose={() => dispatch(closeEditPrice())}
            item={selectedItem}
            openSuccessModal={() => dispatch(openSuccessModal())}
            onSave={handleSavePrice}
          />
        )}

        <ImageUploader
          isOpen={isImageUploaderOpen}
          itemName={selectedItem.name}
          onSave={handleSaveImages}
          onCancel={() => dispatch(closeImageUploader())}
          product_id={selectedItem.product_id}
        />
      </div>
    </>
  );
};

export default Sidebar;