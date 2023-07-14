import { ObjectHelper as FWObjectHelper } from '../framework/functions/objectHelper';
/**
 * ObjectHelper 
 */
export class ObjectHelper extends FWObjectHelper {
    /**
     * Get cookie
     * @param name Cookie name
     * @returns 
     */
    public static getCookie(name: string): string {
        const cookieName = name + '=';
        const cookies = document.cookie.split(';');
        for (const element of cookies) {
            let cookie = element;
            while (cookie.startsWith(' ')) {
                cookie = cookie.substring(1);
            }
            if (cookie.startsWith(cookieName)) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return '';
    }

    /**
     * Format number
     * @param value 
     * @returns 
     */
    public static formatNumber(value: number): string {
        return new Intl.NumberFormat('en-us').format(value);
    }

    /**
     * Get URL Param
     * @param name 
     * @returns 
     */
    public static getURLParam(name: string): string | null {
        const url = new URL(window.location.href);
        return url.searchParams.get(name);
    }

    /**
     * Set URL Param
     * @param name 
     * @param value 
     * @param isSilent 
     */
    public static setURLParam(name: string, value: string, isSilent = true): void {
        const url = new URL(window.location.href);
        url.searchParams.set(name, value);
        if (isSilent) {
            history.pushState({}, '', url.toString());
        }
        else {
            window.location.href = url.toString();
        }
    }
}