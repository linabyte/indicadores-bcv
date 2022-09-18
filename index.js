
import express from 'express';
import { getDataBCV } from './libs/infoBCV.js';
import { getDataPetro } from './libs/infoPetro.js';
import axios from 'axios';
import qrcode from 'qrcode-terminal';
import { Client } from 'whatsapp-web.js';

const app = express();

// var data = [];

app.get('/', async (req, res) => {

    try {
        const dataValues = [
            await getDataBCV(),
            await getDataPetro()
        ];

        // // destructuring
        // const [{valuesBCV}, {valuesPetro}] = dataValues;
        // const {dolarRound, euroRound} = valuesBCV;
        // // showValues(dolarRound, euroRound);

        res.json(dataValues);

    } catch (error) {
        res.json({error})
    }   
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("server on port: " + PORT));


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

    // console.log(message.from)

    if(message.body === 'BCV') {

        axios.get('https://api-bcv-petro.onrender.com/')
        .then(response => {
            const data = response.data;

            // destructuring
            const [{valuesBCV}, {valuesPetro}] = data;
            const {dolarRound, euroRound} = valuesBCV;

            const msg = `$: ${dolarRound}  -  €: ${euroRound}`;

            client.sendMessage(message.from, msg);
        })
        .catch(e => {
            // Podemos mostrar los errores en la consola
            console.log(e);
        });

      
    }
});

client.initialize();

