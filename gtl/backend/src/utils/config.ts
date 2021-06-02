import rc from 'rc';

type TDatabaseConfig = {
  name: string;
  password: string;
  server: string;
  user: string;
};

type TRedisConfig = {
  host?: string;
  url?: string;
  port?: number;
};

type TSecurityConfig = {
  accessTokenPrivateKeyFilename: string;
  accessTokenPublicKeyFilename: string;
  refreshTokenPrivateKeyFilename: string;
  refreshTokenPublicKeyFilename: string;
};

type TTestConfig = {
  chiefLibrarianSsn: string;
  chiefLibrarianPassword: string;
  checkOutStaffSsn: string;
  checkOutStaffPassword: string;
};

type TConfig = {
  database: TDatabaseConfig;
  port: number;
  redis: TRedisConfig;
  security: TSecurityConfig;
  test: TTestConfig;
};

export type {
  TDatabaseConfig,
  TRedisConfig,
  TSecurityConfig,
  TTestConfig,
  TConfig,
};
export default rc('config') as TConfig;
