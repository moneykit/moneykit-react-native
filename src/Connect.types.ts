export type ConnectConfiguration = {
  linkSessionToken: string;
  onSuccess: (payload: SuccessPayload) => void;
  onExit: (error: LinkError | null) => void;
  onEvent?: (event: LinkEvent) => void;
};

export type SuccessPayload = {
  institution: Institution;
  accounts: Account[];
  token: ExchangeableToken | null;
  linkIdentifier: LinkIdentifier | null;
  trackedScreens: TrackedScreen[];
};

export type ExchangeableToken = {
  value: string;
};

export type LinkIdentifier = {
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

export type LinkEvent = {
  name: string;
  sessionId: string;
  properties: Record<string, unknown>;
};

export type LinkError = {
  identifier: string;
  displayedMessage: string;
  requestId: string | null;
};
