const ROLES = {
  CHECK_OUT_STAFF: 'check-out staff',
  CHIEF_LIBRARIAN: 'chief librarian',
  DEPARTMENTAL_ASSOCIATE_LIBRARIAN: 'departmental associate librarian',
  REFERENCE_LIBRARIAN: 'reference librarian',
};

const ROLES_HIERARCHY = {
  'check-out staff': [ROLES.CHECK_OUT_STAFF],
  'chief librarian': [
    ROLES.CHIEF_LIBRARIAN,
    ROLES.DEPARTMENTAL_ASSOCIATE_LIBRARIAN,
    ROLES.REFERENCE_LIBRARIAN,
    ROLES.CHECK_OUT_STAFF,
  ],
  'departmental associate librarian': [
    ROLES.DEPARTMENTAL_ASSOCIATE_LIBRARIAN,
    ROLES.REFERENCE_LIBRARIAN,
    ROLES.CHECK_OUT_STAFF,
  ],
  'reference librarian': [ROLES.REFERENCE_LIBRARIAN, ROLES.CHECK_OUT_STAFF],
};

const isPermitted = (requiredRole, role) =>
  ROLES_HIERARCHY[role].includes(requiredRole);

export { isPermitted, ROLES, ROLES_HIERARCHY };
