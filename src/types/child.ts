// types/child.ts
export interface ChildData {
  id: string;
  childName: string;
  dateOfBirth: string;
  gender: string;
  birthWeight: string;
  bloodGroup: string;
  vaccinationStatus: string;
  allergies?: string;
  medicalConditions?: string;
  currentMedications?: string;
  placeOfBirth: string;
  deliveryType: string;
  parentUid: string;
  parentName?: string;
  photoURL?: string;
  dateAdded?: string;
}
