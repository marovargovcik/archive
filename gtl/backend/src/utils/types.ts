type TPerson = {
  fname: string;
  lname: string;
  ssn: string;
};

type TPersonAddress = {
  address1: string;
  address2?: string;
  address3?: string;
  city: string;
  zipCode: string;
};

type TPersonPhoneNumber = {
  phoneNumber: string;
};

export { TPerson, TPersonAddress, TPersonPhoneNumber };
