export interface CreateVendorParams {
  vendor_name: string;
  user_info: {
    id?: string;
    email?: string;
  };
}


export interface UpdateVendorParams extends CreateVendorParams {
  id: number;
}
export interface CreateLifecycleParams {
  name: string;
  description?: string;
  user_info: {
    id?: string;
    email?: string;
  };
}

export interface UpdateLifecycleParams extends CreateLifecycleParams {
  id: number;
}