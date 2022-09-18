
import express from 'express';
import { getDataBCV } from './libs/infoBCV.js';
import { getDataPetro } from './libs/infoPetro.js';

const app = express();

app.get('/', async (req, res) => {

    try {
        const dataValues = [
            await getDataBCV(),
            await getDataPetro()
        ];

        // destructuring
        const [{valuesBCV}, {valuesPetro}] = dataValues;
        const {dolarRound, euroRound} = valuesBCV;
        // showValues(dolarRound, euroRound);

        res.json(dataValues);

    } catch (error) {
        res.json({error})
    }   
});

const showValues = (d,e) => {
    console.log("Bs x USD: " + d);
    console.log("Bs x EUR: " + e);
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("server on port: " + PORT));