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
    }
}