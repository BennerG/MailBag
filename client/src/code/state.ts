import * as Contacts from "./Contacts";
import { config } from "./config";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";

export function createState(inParentComponent) {
    return {
        pleaseWaitVisible : false,
        contacts : [ ],
        mailboxes : [ ],
        messages : [ ],
        currentView : "welcome",
        currentMailbox : null,
        messageID : null,
        messageDate : null,
        messageFrom : null,
        messageTo : null,
        messageSubject : null,
        messageBody : null,
        contactID : null,
        contactName : null,
        contactEmail : null,

        showHidePleaseWait: function(inVisible: boolean): void {
            inParentComponent.setState({pleaseWaitVisible: inVisible})
        }.bind(inParentComponent),

        addMailboxToList: function(inMailbox: IMAP.IMailbox): void {
            const cl: IMAP.IMailbox[] = inParentComponent.state.mailboxes.slice(0);
            cl.push(inMailbox);
            inParentComponent.setState({ mailboxes: cl });
        }.bind(inParentComponent),

        addContactToList: function(inContact: Contacts.IContact): void {
            const cl = inParentComponent.state.contacts.slice(0);
            cl.push({ 
                _id: inContact._id,
                name: inContact.name,
                email: inContact.email
            });
            inParentComponent.setState({ contacts: cl });
        }.bind(inParentComponent),

        showComposeMessage: function(inType: string): void {
            switch (inType) {
                case "new":
                    inParentComponent.setState({ currentView: "compose",
                        messageTo: "", messageSubject: "", messageBody: "",
                        messageFrom: config.userEmail
                    });
                    break;
                case "reply":
                    inParentComponent.setState({ currentView: "compose",
                        messageTo: inParentComponent.state.messageFrom,
                        messageSubject: `Re: ${inParentComponent.state.messageSubject}`,
                        messageBody: `\n\n---- Original Message ---- \n\n${ inParentComponent.state.messageBody }`,
                        messageFrom: config.userEmail
                    });
                    break;
                case "contact":
                    inParentComponent.setState({ currentView: "compose",
                        messageTo: inParentComponent.state.contactEmail,
                        messageSubject: "", messageBody: "",
                        messageFrom: config.userEmail
                    });
                    break;
            }
        }.bind(inParentComponent),

        showAddContact: function(): void {
            inParentComponent.setState({ currentView: "contactAdd",
                contactID: null, contactName: "", contactEmail: ""
            });
        }.bind(inParentComponent),

        setCurrentMailbox: function(inPath: string): void {
            inParentComponent.setState({ currentView: "welcome", currentMailbox: inPath});
            inParentComponent.state.getMessages(inPath);
        }.bind(inParentComponent),

        getMessages: async function(inPath: string): Promise<void> {
            inParentComponent.state.showHidePleaseWait(true);
            const imapWorker: IMAP.Worker = new IMAP.Worker();
            const messages: IMAP.IMessage[] = await imapWorker.listMessages(inPath);
            inParentComponent.state.showHidePleaseWait(false);
            inParentComponent.state.clearMessages();
            messages.forEach((inMessage: IMAP.IMessage) => {
                inParentComponent.state.addMessageToList(inMessage);
            });
        }.bind(inParentComponent),

        clearMessages: function(): void {
            inParentComponent.setState({ messages: [] });
        }.bind(inParentComponent),

        addMessageToList: function(inMessage: IMAP.IMessage): void {
            const cl = inParentComponent.state.messages.slice(0);
            cl.push({id: inMessage.id, date: inMessage.date, 
                from: inMessage.from, subject: inMessage.subject });
            inParentComponent.setState({ messages: cl });
        }.bind(inParentComponent),

        showContact: function(inID: string, inName: string, inEmail: string): void {
            inParentComponent.setState({ currentView: "contact", contactID: inID, 
                contactName: inName, contactEmail: inEmail});
        }.bind(inParentComponent),

        fieldChangeHandler: function(inEvent: any): void {
            if (inEvent.target.id === "contactName" && 
                inEvent.target.value.length > 16) { return; }
            inParentComponent.setState({ [inEvent.target.id]: inEvent.target.value });;
        }.bind(inParentComponent),

        saveContact: async function(): Promise<void> {
            const cl = inParentComponent.state.contacts.slice(0);
            inParentComponent.state.showHidePleaseWait(true);
            const contactWorker: Contacts.Worker = new Contacts.Worker();
            const contact: Contacts.IContact = await contactWorker.addContact({
                name: inParentComponent.state.contactName, email: inParentComponent.state.contactEmail });
            inParentComponent.state.showHidePleaseWait(false);
            cl.push(contact);
            inParentComponent.setState({ contacts: cl, contactID: null,
                contactName: "", contactEmail: "" });
        }.bind(inParentComponent),

        deleteContact: async function(): Promise<void> {
            inParentComponent.state.showHidePleaseWait(true);
            const contactWorker: Contacts.Worker = new Contacts.Worker();
            await contactWorker.deleteContact(inParentComponent.state.contactID);
            inParentComponent.state.showHidePleaseWait(false);
            const cl = inParentComponent.state.contacts.filter(
                inElement => inElement._id != inParentComponent.state.contactID
            );
            inParentComponent.setState({ contacts: cl, contactID: null, contactName: "",
                contactEmail: "" });
        }.bind(inParentComponent),

        showMessage:  async function(inMessage: IMAP.IMessage): Promise<void> {
            inParentComponent.state.showHidePleaseWait(true);
            const imapWorker: IMAP.Worker = new IMAP.Worker();
            const mb: string =  await imapWorker.getMessageBody(
                inMessage.id, inParentComponent.state.currentMailbox
            );
            // console.log('message body:');
            // console.log(mb);
            inParentComponent.state.showHidePleaseWait(false);
            inParentComponent.setState({ currentView: "message", messageID: inMessage.id,
                messageDate: inMessage.date, messageFrom: inMessage.from,
                messageTo: "", messageSubject: inMessage.subject,
                messageBody: mb
            });
        }.bind(inParentComponent),

        sendMessage:  async function(): Promise<void> {
            inParentComponent.state.showHidePleaseWait(true);
            const smtpWorker: SMTP.Worker = new SMTP.Worker();
            await smtpWorker.sendMessage(inParentComponent.state.messageTo, 
                inParentComponent.state.messageFrom, inParentComponent.state.messageSubject,
                inParentComponent.state.messageBody
            ); 
            inParentComponent.state.showHidePleaseWait(false);
            inParentComponent.setState({ currentView: "welcome" });
        }.bind(inParentComponent),

        deleteMessage: async function():Promise<void> {
            inParentComponent.state.showHidePleaseWait(true);
            const imapWorker: IMAP.Worker = new IMAP.Worker();
            await imapWorker.deleteMessage(inParentComponent.state.messageID, inParentComponent.state.currentMailbox);
            inParentComponent.state.showHidePleaseWait(false);
            const cl = inParentComponent.state.messages.filter((inElement) => inElement.id != inParentComponent.state.messageID);
            inParentComponent.setState({ messages: cl, currentView: "welcome" });
        }.bind(inParentComponent)
    }
}
