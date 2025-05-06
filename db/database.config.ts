import Dexie, { Table } from "dexie";
import { IItem } from "./types/item";
import { IFormTemplate } from "./types/formTemplate";
import { IFormResponse } from "./types/formResponse";

export class DB extends Dexie {
    items!: Table<IItem>;
    formTemplates!: Table<IFormTemplate>;
    formResponses!: Table<IFormResponse>;

    constructor() {
        super("iswFormsDb");
        this.version(1).stores({
            items: "++id, name, cat",
            formTemplates: "++id, name, createdAt, updatedAt",
            formResponses: "++id, formTemplateId, status, createdAt, updatedAt, syncedAt, offlineCreated",
        });
    }
}

export const db = new DB();
export const itemTable = db.table("items");
export const formTemplateTable = db.table("formTemplates");
export const formResponseTable = db.table("formResponses");
