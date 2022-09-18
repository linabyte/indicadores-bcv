
import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();


app.get('/', async (req, res) => {

    try {
        const { data } = await axios.get('http://bcv.org.ve');

        const $ = cheerio.load(data)
        const selectorDolar = "#dolar > div > div > div.col-sm-6.col-xs-6.centrado > strong"
        const selectorEuro = "#euro > div > div > div.col-sm-6.col-xs-6.centrado > strong";
        const selectorFecha = "#block-views-612b6aaa739877c430ffe6a2079ce5a8 > div > div.view-content > div > div.pull-right.dinpro.center > span"

        const fecha = $(selectorFecha).text().trim();
        const dolar = $(selectorDolar).text().trim().replace(",", ".");
        const euro = $(selectorEuro).text().trim().replace(",", ".");

        function round(num) {
            var m = Number((Math.abs(num) * 100).toPrecision(15));
            return Math.round(m) / 100 * Math.sign(num);
        };

        const valuesBCV = {
            fecha: fecha || new Date().toLocaleDateString(),
            dolar: dolar || "no disponible",
            euro: euro || "no disponible",
            dolarRound: round(parseFloat(dolar)),
            euroRound: round(parseFloat(euro))
        };

         res.json(valuesBCV);

        // res.json({data})
    } catch (error) {
        res.json({error})
    }   
});

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => console.log("server on port: " + PORT));


