import 'reflect-metadata';
import { container } from 'tsyringe';
import { StorageKey } from '../constants/storageKey';
import { StorageService } from '../framework/services/storageService';
import { LogggingService } from '../framework/services/loggingService';
import { AuthObject, AuthProfileObject } from '../types/authType';
import { ConstantValue } from '../constants/constantValue';
import { ObjectHelper } from '../functions/objectHelper';

export class AuthService {
    public loggingService = container.resolve(LogggingService);
    public storageService = container.resolve(StorageService);
    /**
     * Check authentication
     * @returns 
     */
    public isAuthenticated(): boolean {
        const me = this;
        try {
            const authObject = ObjectHelper.getCookie(StorageKey.authObject);
            if (authObject) {
                return true;
            }
        } catch (ex) {
            me.loggingService.logError(ex);
        }
        return false;
    }

    /**
     * Save user
     * @param email 
     * @param response 
     * @returns 
     */
    public saveUser(email: string, response: AuthProfileObject): boolean {
        const me = this;
        try {
            const value = {
                id: response.id,
                email,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                expiresIn: response.expiresIn,
                name: response.name
            } as AuthProfileObject;

            const now = new Date();
            now.setTime(now.getTime() + (response.expiresIn * 1000));
            const expires = 'expires=' + now.toUTCString();
            value.expiresUTCTime = now.toUTCString();
            document.cookie = StorageKey.authObject + '=' + JSON.stringify(value) + ';' + expires + ';path=/;SameSite=Lax';
            // save local storage for refreshToken
            value.avatar = response.avatar || ConstantValue.avatar;
            me.storageService.saveObject(StorageKey.authProfileObject, value);
            return true;
        } catch (ex) {
            me.loggingService.logError(ex);
        }
        return false;
    }

    /**
     * Get user infromation at local
     * @returns 
     */
    public async getUserInformationLocal(): Promise<AuthProfileObject | undefined> {
        const me = this;
        const authObjectJson = ObjectHelper.getCookie(StorageKey.authObject);
        let localAuthObject = me.storageService.getObject<AuthProfileObject>(StorageKey.authProfileObject);
        if (!authObjectJson) {
            await me.logout();
        }
        else {
            if (!localAuthObject) {
                // get User Info
                const authObject = JSON.parse(authObjectJson) as AuthObject;
                localAuthObject = {} as AuthProfileObject;
                localAuthObject.accessToken = authObject.accessToken;
                localAuthObject.refreshToken = authObject.refreshToken;
                localAuthObject.expiresIn = authObject.expiresIn;
                localAuthObject.email = authObject.email;
                localAuthObject.name = authObject.email || authObject.email.split('@')[0];

                if (me.saveUser(localAuthObject.email, localAuthObject)) {
                    return localAuthObject;
                }
            }
        }
        return localAuthObject;
    }

    /** Logout */
    public async logout(): Promise<boolean> {
        const me = this;
        try {
            // const headers = me.getHeader(true);
            // const requestOptions: RequestInit = {
            //     method: 'POST',
            //     headers: headers,
            //     redirect: 'follow'
            // };
            // const response: Response = await fetch(import.meta.env.VITE_API_HOST + me.urlRequest.logout, requestOptions);
            // if (response.status == 200) {
            //     me.storageService.clear();
            //     return true;
            // }
            me.storageService.clear();
            document.cookie = StorageKey.authObject + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            return true;
        } catch (ex) {
            me.loggingService.logError(ex);
        }
        return false;
    }
}