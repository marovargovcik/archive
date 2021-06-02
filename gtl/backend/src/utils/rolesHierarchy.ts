type TRolesHierarchy = {
  [key: string]: string[];
};

export enum ROLES {
  chiefLibrarian = 'chief librarian',
  departmentalAssociateLibrarian = 'departmental associate librarian',
  checkOutStaff = 'check-out staff',
  referenceLibrarian = 'reference librarian',
}

export const ROLES_HIERARCHY: TRolesHierarchy = {
  'check-out staff': [ROLES.checkOutStaff],
  'chief librarian': [
    ROLES.chiefLibrarian,
    ROLES.departmentalAssociateLibrarian,
    ROLES.checkOutStaff,
    ROLES.referenceLibrarian,
  ],
  'departmental associate librarian': [
    ROLES.departmentalAssociateLibrarian,
    ROLES.checkOutStaff,
    ROLES.referenceLibrarian,
  ],
  'reference librarian': [ROLES.checkOutStaff, ROLES.referenceLibrarian],
};
