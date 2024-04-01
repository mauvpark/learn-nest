import { UserImageType } from 'src/users/model/interface/user-image.interface';

export interface UserType {
  firstName: string;
  lastName: string;
  isActive: boolean;
  images: UserImageType[];
}
