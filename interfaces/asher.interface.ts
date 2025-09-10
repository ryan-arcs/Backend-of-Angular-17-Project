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

export interface AddApplicationPayload {
  app_name: string;
  business_owner: number[];
  system_owner: number[];
  life_cycle: string;
  aliases: string;
  hosting_location: string;
  vendor_id: number;
  app_desc: string;
  it_contact?: number[];
  product_owner?: number[];
  product_manager?: number[];
  approver1?: number;
  sponsor?: number;
  version?: string;
  is_gxp?: boolean;
  is_sox?: boolean;
  user_info: {
    id?: string;
    email?: string;
  };
  record_status?: string;
}

export interface UpdateApplicationPayload extends AddApplicationPayload {
  id: number;
}