export interface ICreateSession {
    kind?: string;
    localId?: string;
    email?: string;
    displayName?: string;
    idToken?: string;
    registered?: boolean;
    refreshToken?: string;
    expiresIn?: string;
}
export interface IDeleteAccount {
    kind?: string;
}
export interface IAccountInfo {
    kind?: string;
    localId?: string;
    email?: string;
    displayName?: string;
    providerUserInfo?: IProviderUserInfo[];
    photoUrl?: string;
    passwordHash?: string;
    emailVerified?: boolean;
}
export interface IProviderUserInfo {
    providerId?: string;
    displayName?: string;
    photoUrl?: string;
    federatedId?: string;
    email?: string;
    rawId?: string;
}
