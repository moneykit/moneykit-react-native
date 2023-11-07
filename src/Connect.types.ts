export type ConnectConfiguration = {
  linkSessionToken: string;
  onSuccess: (payload: SuccessPayload) => void;
  onExit: () => void;
};

export type SuccessPayload = {
  institution: Institution;
  accounts: Account[];
  token: ExchangeableToken | null;
  trackedScreens: TrackedScreen[];
};

export type ExchangeableToken = {
  value: string;
};

export type TrackedScreen = {
  name: string;
  duration: number;
  requestTime: number | null;
};

export type Account = {
  id: string;
  name: string;
  type: string;
  mask: string | null;
};

export type Institution = {
  id: string;
  name: string;
  country: string;
  domain: string | null;
  color: string;
  colorDark: string | null;
  avatar: string;
  avatarDark: string | null;
  logo: string | null;
  logoDark: string | null;
};
