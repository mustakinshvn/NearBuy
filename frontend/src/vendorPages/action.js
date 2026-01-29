import { useVendorOrder } from "../hooks/useVendorOrder";
import { orderAPI } from "../services/api";

export const GetVendorId = () => {
    const {vendor} = useVendorOrder()
    return vendor.vendor_id;
}

export const getAllVendorOrders = async () => {
    const orders = await orderAPI.getByVendor(GetVendorId());
    return orders;
}