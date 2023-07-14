import { StorageKey as FWStorageKey } from '../framework/constants/storageKey';

/**
 * For store local storage/ session storage/ cookies  key
 */
export class StorageKey extends FWStorageKey {
    public static authObject = 'ref_user_authenticate';
    public static authProfileObject = 'ref_user_profile';
}