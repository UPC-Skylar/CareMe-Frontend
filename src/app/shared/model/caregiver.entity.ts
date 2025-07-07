export interface Caregiver {
  caregiverId: string;
  name: string;
  age: number;
  specialty: string;
  yearsOfExperience: number;
  location: string;
  phoneNumber: string;
  professionalTitle: string;
  rating?: number;
  completedServices?: number;
  profileImage?: string;
  verified?: boolean;
  user: {
    id: string;
    email: string;
  };
}
