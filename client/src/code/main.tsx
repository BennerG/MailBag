import "normalize.css";
import "../css/main.css";

import React from "react";
import ReactDOM from "react-dom";
import BaseLayout from "./components/BaseLayout";

import * as IMAP from "./IMAP";
import { ImagePalette } from "material-ui/svg-icons";

const baseComponent = ReactDOM.render(
    <BaseLayout />, document.body
);

baseComponent.state.showHidePleaseWait(true);

async function getMailboxes() {
    const imapWorker: IMAP.Worker = new IMAP.Worker();
    const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
    mailboxes.forEach(inMailbox => {
        baseComponent.state.addMailBoxToList(inMailbox);
    })
}