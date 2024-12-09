import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";



dotenv.config();
const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT; 

export const mailtrapClient = new MailtrapClient({token: process.env.MAILTRAP_TOKEN, endpoint: process.env.MAILTRAP_ENDPOINT});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Pasan",
};

