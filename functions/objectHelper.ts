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
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) == 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return '';
    }
}