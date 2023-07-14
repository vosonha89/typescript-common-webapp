import { AbstractModel, ErrorModel as FWErrorModel } from '../framework/types/abstractModel';

/**
 * Model for showing error
 */
export interface ErrorModel extends FWErrorModel {
    property: string;
    error: string;
}

export abstract class BaseModel extends AbstractModel<ErrorModel>{
    public abstract language: any;

    [key: string]: number | string | any;
    public errors: ErrorModel[] = [];

    /** To validate model valid */
    public abstract isValid(): boolean;

    public checkError(prop: string): boolean {
        const me = this;
        if (me.errors.findIndex(a => a.property === prop) != -1) {
            return true;
        }
        return false;
    }

    public getErrorList(prop: string): string[] {
        const me = this;
        const errorList: string[] = [];
        if (me.errors.length > 0) {
            for (const error of me.errors) {
                if (error.property === prop) {
                    errorList.push(error.error);
                }
            }
        }
        return errorList;
    }
}