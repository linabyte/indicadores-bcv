
import express from 'express';
import { getDataBCV } from './libs/infoBCV.js';
import { getDataPetro } from './libs/infoPetro.js';
import axios from 'axios';
import fs from 'fs';
import qrcode from 'qrcode-terminal';
import qr from 'qr-image';
import { Client } from 'whatsapp-web.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res) => {

    try {
        const dataValues = [
            await getDataBCV()
            // await getDataPetro()
        ];
        res.json(dataValues);
    } catch (error) {
        res.json({error});
    }   
});

const client = new Client();

client.on('qr', qr => generateImage(qr, () => {
    // qrcode.generate(qr, {small: true});
    console.log("qr is ready to scan!");

    const getQr = (req, res) => {
        res.writeHead(200, { 'content-type': 'image/svg+xml' });
        fs.createReadStream(__dirname + '/media/qrcode.svg').pipe(res);
    };

    app.route('/qr').get(getQr);
}));



client.on('ready', () => {
    console.log('Client is ready!');
});

// client.on('message', message => {
// 	console.log(message.body);
// });

client.on('message', async message => {

    // console.log(message.from)

    if(message.body.toLowerCase() === 'bcv') {

        try {
            const {data} = await axios.get('https://api-bcv-petro.onrender.com');
            // const {data} = await axios.get('http://localhost:5000/');
           
            // destructuring
            // const [{valuesBCV}, {valuesPetro}] = data;
            const [{valuesBCV}] = data;
            const {dolarRound, euroRound, datePost} = valuesBCV;

            let msg = '';
            msg += "- 💰 Indicadores BCV 💰 -" + '\n';
            msg += "📅 Fecha publicación: " + datePost + '\n';
            msg += `📍 $ Dolar: ${dolarRound}` + '\n';
            msg += `📍 € Euro : ${euroRound}`
            client.sendMessage(message.from, msg);

        } catch (error) {
            console.log("Error al conectarse con la api")
        }
    }
});

const generateImage = (base64, callback = () => {}) => {
    let qr_svg = qr.image(base64, { type: 'svg', margin: 4 });
    qr_svg.pipe(fs.createWriteStream('./media/qrcode.svg'));
    // qr_svg.pipe(require('fs').createWriteStream('./mediaSend/qr-code.svg'));
    console.log("visuzaliza el codigo QR en: https://api-bcv-petro.onrender.com/qr");
    console.log("Actualiza [F5] el navegador para mantener el QR actualizado");
    callback()
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("server on port: " + PORT));

client.initialize();

