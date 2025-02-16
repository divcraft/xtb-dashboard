const getEnv = (key: string): string => {
  const value = process.env[key];

  if (value === undefined || value === '') {
    console.error(`Environment variable ${key} is not set`);
    throw Error;
  }

  return value;
};

export interface ConfigType {
  xtb: {
    hostUrl: string;
    userId: string;
    password: string;
  };
}

export const getConfig = (): ConfigType => {
  return {
    xtb: {
      hostUrl: getEnv('XTB_HOST_URL'),
      userId: getEnv('XTB_USER_ID'),
      password: getEnv('XTB_PASSWORD'),
    },
  };
};
