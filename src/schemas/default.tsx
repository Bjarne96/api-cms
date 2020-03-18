import * as mongoose from 'mongoose'

//Interface for route object
export interface IDefaultSchema {
    tableTitle: string;
    formTitle: string;
    fields: Array<IDefaultFieldObjectSchema>;
}

//fields object
export interface IDefaultFieldObjectSchema {
    id: string;
    name: string;
    type: "text" | "number" | "checkbox" | "tinymce" | "select" | "pictures" | "upload" | "properties";
    required: boolean;
    error: string;
    hideInForm?: boolean;
    hideInTable?: boolean;
    checkErr: (field: string) => boolean;
    
}
export default IDefaultSchema;