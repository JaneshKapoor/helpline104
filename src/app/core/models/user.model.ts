export interface User {
  userId: number;
  userName: string;
  userRole: string;
  serviceName: string;
  serviceId: number;
  stateId: number;
  stateName: string;
  token: string;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  data: User;
  status: number;
  statusCode: string;
}

export interface Role {
  RoleID: number;
  RoleName: string;
  ServiceID: number;
  ServiceName: string;
}
