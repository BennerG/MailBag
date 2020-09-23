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
            this.setState({pleaseWaitVisible: inVisible})
        }.bind(inParentComponent),

        addMailboxToList: function(inMailbox: IMAP.Mailbox): void {
            const cl: IMAP.IMailbox[] = this.state.mailboxes.slice(0);
            cl.push(inMailbox);
            this.setState({ mailboxes: cl });
        }.bind(inParentComponent),

        addContactToList: function(inContact: Contacts.IContact): void {
            const cl = this.state.contacts.slice(0);
            cl.push({ 
                _id: inContact._id,
                name: inContact.name,
                email: inContact.email
            });
            this.setState({ contacts: cl });
        }.bind(inParentComponent),

        
    }
}