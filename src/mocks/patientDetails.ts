export interface EmergencyContact {
  id: string
  fullName: string
  relationship: string
  phone: string
}

export interface InsuranceDetails {
  primaryHolder: string
  primaryHolderName: string
  provider: string
  policyNumber: string
  insuranceType: string
  groupNumber: string
  phone: string
  coverageStart: string
  coverageEnd: string
  status: 'active' | 'pending' | 'expired'
}

export interface PatientExtended {
  patientId: string
  email: string
  contactNumber: string
  parish: string
  postCode: string
  address1: string
  address2: string
  gender: string
  dob: string
  profileStatus: string
  createdBy: string
  requestSentBy: string
  requestSentOn: string
  emergencyContacts: EmergencyContact[]
  insurance: InsuranceDetails
}

export const mockPatientDetails: PatientExtended[] = [
  {
    patientId: 'pat-1',
    email: 'john.smith@email.com',
    contactNumber: '(312) 555-0911',
    parish: 'St. James Parish',
    postCode: '60601',
    address1: '342 W. Madison Street',
    address2: 'Apt 4B, Chicago, IL',
    gender: 'Male',
    dob: '04/12/1978',
    profileStatus: 'Active',
    createdBy: 'Sarah Johnson',
    requestSentBy: 'Dr. Marcus Rivera',
    requestSentOn: '01/15/2024 • 09:30 AM',
    emergencyContacts: [
      { id: 'ec-1', fullName: 'Jenny Watson', relationship: 'Sister', phone: '+1 (208) 555-0012' },
      { id: 'ec-2', fullName: 'Harris Watson', relationship: 'Brother', phone: '+1 (208) 555-0034' },
    ],
    insurance: {
      primaryHolder: 'Self',
      primaryHolderName: 'John Smith',
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BCB-2024-00245',
      insuranceType: 'PPO',
      groupNumber: 'GRP-8841023',
      phone: '1-800-555-2583',
      coverageStart: '01/01/2024',
      coverageEnd: '12/31/2026',
      status: 'active',
    },
  },
  {
    patientId: 'pat-2',
    email: 'mgonzalez@email.com',
    contactNumber: '(773) 555-0482',
    parish: 'St. Mary Parish',
    postCode: '60614',
    address1: '1200 N. Lake Shore Dr',
    address2: 'Unit 18C, Chicago, IL',
    gender: 'Female',
    dob: '08/23/1990',
    profileStatus: 'Active',
    createdBy: 'Michael Reed',
    requestSentBy: 'Dr. Elena Vasquez',
    requestSentOn: '02/10/2024 • 11:00 AM',
    emergencyContacts: [
      { id: 'ec-3', fullName: 'Carlos Gonzalez', relationship: 'Spouse', phone: '+1 (773) 555-0100' },
    ],
    insurance: {
      primaryHolder: 'Spouse',
      primaryHolderName: 'Carlos Gonzalez',
      provider: 'Aetna Health',
      policyNumber: 'AET-2024-10312',
      insuranceType: 'HMO',
      groupNumber: 'GRP-7720145',
      phone: '1-800-872-3862',
      coverageStart: '03/01/2024',
      coverageEnd: '02/28/2025',
      status: 'pending',
    },
  },
  {
    patientId: 'pat-3',
    email: 'david.nguyen@email.com',
    contactNumber: '(847) 555-0193',
    parish: 'Holy Trinity',
    postCode: '60201',
    address1: '845 Oak Ave',
    address2: 'Evanston, IL',
    gender: 'Male',
    dob: '11/30/1965',
    profileStatus: 'Active',
    createdBy: 'Sarah Johnson',
    requestSentBy: 'Dr. David Chen',
    requestSentOn: '03/05/2024 • 02:15 PM',
    emergencyContacts: [
      { id: 'ec-4', fullName: 'Linh Nguyen', relationship: 'Wife', phone: '+1 (847) 555-0210' },
      { id: 'ec-5', fullName: 'Kevin Nguyen', relationship: 'Son', phone: '+1 (847) 555-0311' },
    ],
    insurance: {
      primaryHolder: 'Self',
      primaryHolderName: 'David Nguyen',
      provider: 'UnitedHealthcare',
      policyNumber: 'UHC-2023-00398',
      insuranceType: 'EPO',
      groupNumber: 'GRP-5534109',
      phone: '1-866-557-3987',
      coverageStart: '06/01/2022',
      coverageEnd: '05/31/2023',
      status: 'expired',
    },
  },
]
