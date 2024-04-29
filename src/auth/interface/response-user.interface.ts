import { UserImageType } from 'src/users/model/interface/user-image.interface';

export type ResponseUserType = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  images: UserImageType[];
};
