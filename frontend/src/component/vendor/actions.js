import { useVendorAuth } from "../../hooks/useVendorAuthContext";

export const VendorId = () => {
    const {vendor} = useVendorAuth()
    return vendor.vendor_id;
}