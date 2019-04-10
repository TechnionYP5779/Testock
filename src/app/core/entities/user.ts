export interface Roles {
  admin?: boolean;
  faculty_admin?: string[];
  user?: boolean;
}

export interface UserData {
  uid: string;
  email: string;
  name: string;
  microsoftId: string;
  roles: Roles;
  points: number;
}
