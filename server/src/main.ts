import path from "path";
import express,
    { Express, NextFunction, Request, Response } from "express";
import { serverInfo } from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./contacts";
import { IContact } from "./contacts";
var cors = require('cors');

const app: Express = express();

app.use(express.json());
app.use("/", express.static(path.join(__dirname, "../../client/dist")));
// for some reason, I had an issue with this, but the cors middleware from
// express worked fine
// -------------------------------------
// app.use((req: Request, res: Response, next: NextFunction) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", 
//         "GET,POST,DELETE,OPTIONS"
//     );
//     res.header("Allow-Control-Allow-Headers", 
//         "Origin,X-Requested-With,Content-Type,Accept"
//     );
//     next();
// });
app.use(cors());

app.get("/mailboxes",
    async (req: Request, res: Response) => {
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
            res.status(200).json(mailboxes);
        } catch (error) {
            res.status(500).send("error");
        }
    }
);

app.get("/mailboxes/:mailbox", 
    async (req: Request, res: Response) => {
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const messages: IMAP.IMessage[] = await imapWorker.listMessages({
                mailbox: req.params.mailbox
            });
            res.status(200).json(messages);
        } catch (error) {
            res.status(500).send("error");
        }
    }
);

app.get("/messages/:mailbox/:id", 
    async (req: Request, res: Response) => {
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const messageBody: string|undefined = await imapWorker.getMessageBody({
                mailbox: req.params.mailbox,
                id: parseInt(req.params.id, 10)
            });
            res.status(200).send(messageBody);
        } catch (error) {
            res.status(500).send("error");
        }
    }
);

app.delete("/messages/:mailbox/:id", 
    async (req: Request, res: Response) => {
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            await imapWorker.deleteMessage({
                mailbox: req.params.mailbox,
                id: parseInt(req.params.id, 10)
            });
            res.status(200).send("ok");
        } catch (error) {
            res.status(500).send("error");
        }
    }
);

app.post("/messages", 
    async (req: Request, res: Response) => {
        try {
            const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
            await smtpWorker.sendMessage(req.body);
            res.status(201).send("ok");
        } catch (error) {
            res.status(500).send("error");
        }
    }
);

app.get("/contacts",
    async (req: Request, res: Response) => {
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contacts: IContact[] = await contactsWorker.listContacts();
            res.status(200).json(contacts);
        } catch (error) {
            res.status(500).send("error");
        }
    }
);

app.post("/contacts", 
    async (req: Request, res: Response) => {
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contact: IContact = await contactsWorker.addContact(req.body);
            res.status(201).json(contact);
        } catch (error) {
            res.status(500).send("error");
        }
    }
);

app.put("/contacts/:id", 
    async (req: Request, res: Response) => {
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const updated: string = await contactsWorker.updateContact(req.params.id, req.body);
            res.status(200).json(updated);
        } catch (error) {
            res.status(500).send("error");
        }
    }
);

app.delete("/contacts/:id", 
    async (req: Request, res: Response) => {
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            await contactsWorker.deleteContact(req.params.id);
            res.status(200).send("ok");
        } catch (error) {
            res.status(500).send("error");
        }
    }
);

app.listen(8080);
console.log('listening on port 8080');