export interface AuthObject {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    expiresUTCTime: string;
}

export interface AuthProfileObject extends AuthObject {
    name: string;
    avatar: string;
}