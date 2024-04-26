import { UserImageType } from 'src/users/model/interface/user-image.interface';

export interface UserType {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  images: UserImageType[];
  iv: string;
}
