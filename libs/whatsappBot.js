
import qrcode from 'qrcode-terminal';
import { Client } from 'whatsapp-web.js';

const whatsappBot = () => {
    
    const client = new Client();

    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    });

    client.on('ready', () => {
        console.log('Client is ready!');
    });

    // client.on('message', message => {
    // 	console.log(message.body);
    // });

    client.on('message', message => {

        console.log(message.from)

        if(message.body === 'dolar') {
            client.sendMessage(message.from, d);
        }
    });

    client.initialize();
    return client;
};

export {whatsappBot};