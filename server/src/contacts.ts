import * as path from "path";
const Datastore = require("nedb");

export interface IContact {
    _id?:  number, name: string, email: string
}

export class Worker {
    private db: Nedb;
    constructor() {
        this.db = new Datastore({
            filename: path.join(__dirname, "contacts.db"),
            autoload: true
        });
    }
    public listContacts(): Promise<IContact[]> {
        return new Promise((resolve, reject) => {
            this.db.find({},
                (err: Error, inDocs: IContact[]) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(inDocs);
                    }
                }
            );
        });
    }
    public addContact(inContact: IContact): Promise<IContact> {
        return new Promise((resolve, reject) => {
            this.db.insert(inContact,
                (err: Error | null, inNewDoc: IContact) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(inNewDoc);
                    }
                }
            );
        });
    }
    public deleteContact(inID: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.db.remove({_id : inID }, {}, 
                (err: Error | null, inNumRemoved: number) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }
}