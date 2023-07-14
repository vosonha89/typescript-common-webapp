import { ConstantValue } from '../constants/constantValue';
import { ObjectHelper } from '../functions/objectHelper';
import { BaseModel } from './baseModel';

/**
 * Abstract for model paging listing
 */
export abstract class BaseModelList<T> extends BaseModel {
    public dataList: PagingModel<T>;
    public maxPageList: number;
    public pagingList: number[];

    /**
     * Constructor
     */
    constructor(maxPageList = 5) {
        super();
        this.maxPageList = maxPageList;
        this.pagingList = [];
        for (let i = 1; i <= maxPageList; i++) {
            this.pagingList.push(i);
        }
        this.dataList = {
            data: [],
            pageIndex: ConstantValue.pageIndex,
            pageSize: ConstantValue.pageSize,
            totalPages: 0
        } as PagingModel<T>;
    }

    /**
     * Get current page
     * @returns 
     */
    public getCurrentPage(): number {
        const pageParam = ObjectHelper.getURLParam('page');
        if (pageParam != null) {
            return parseInt(pageParam);
        }
        return 0;
    }

    /**
     * Update paging after loading data
     * @param pageIndex 
     * @param isNext 
     */
    public updatePaging(pageIndex: number, isNext = false): void {
        const me = this;
        if (isNext) {
            let lastPage = me.pagingList[me.maxPageList - 1];
            if (pageIndex >= lastPage && lastPage < me.dataList.totalPages - 1) {
                if (pageIndex > lastPage + 3) {
                    lastPage = pageIndex;
                    if (lastPage >= me.dataList.totalPages - 1) {
                        lastPage = me.dataList.totalPages - me.maxPageList;
                    }
                }
                me.addValuesToPageList(lastPage, true);
            }
        }
        else {
            const lastPage = me.pagingList[0];
            if (pageIndex < lastPage - 1 && pageIndex > 0) {
                me.addValuesToPageList(lastPage, false);
            }
        }

        if (me.dataList.pageIndex == 0) {
            me.addValuesToPageList(0, true);
        }
        ObjectHelper.setURLParam('page', pageIndex.toString());
    }

    /**
     * Update paging list
     * @param lastPage 
     * @param isNext 
     */
    public addValuesToPageList(lastPage: number, isNext: boolean): void {
        const me = this;
        me.pagingList = [];
        if (isNext) {
            for (let i = 1; i <= me.maxPageList; i++) {
                me.pagingList.push(lastPage + i);
            }
        } else {
            for (let i = me.maxPageList; i >= 1; i--) {
                me.pagingList.push(lastPage - i);
            }
        }
    }
}

/**
 * Abstract paging model data
 */
export abstract class PagingModel<T> {
    public data: T[] = [];
    public totalPages = 0;
    public pageSize = ConstantValue.pageSize;
    public pageIndex = 0;
}