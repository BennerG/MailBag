import Mail from "nodemailer/lib/mailer";
import * as nodemailer from "nodemailer";
import { SendMailOptions, SentMessageInfo } from "nodemailer";
import { IServerInfo } from "./ServerInfo";
// const nodemailer = require("nodemailer");

export class Worker {
    private static serverInfo: IServerInfo;
    constructor(inServerInfo: IServerInfo) {
        Worker.serverInfo = inServerInfo;
    }
    public sendMessage(inOptions: SendMailOptions): Promise<string> {
        return new Promise((resolve, reject) => {
            const transport: Mail = nodemailer.createTransport(Worker.serverInfo.smtp);
            transport.sendMail(inOptions,  
                (err: Error | null, inInfo: SentMessageInfo) => {
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