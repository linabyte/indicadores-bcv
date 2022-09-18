
import axios from 'axios';
import * as cheerio from 'cheerio';
import { round } from './round.js';

const url = 'http://bcv.org.ve';

const getDataBCV = async () => {
    try {
        const { data } = await axios.get(url);

        const $ = cheerio.load(data);

        const selectDolarBCV = "#dolar > div > div > div.col-sm-6.col-xs-6.centrado > strong";
        const selectEuroBCV = "#euro > div > div > div.col-sm-6.col-xs-6.centrado > strong";
        const selectFechaBCV = "#block-views-612b6aaa739877c430ffe6a2079ce5a8 > div > div.view-content > div > div.pull-right.dinpro.center > span";

        const dateBCV = $(selectFechaBCV).text().trim();
        const dolarBCV = $(selectDolarBCV).text().trim().replace(",", ".");
        const euroBCV = $(selectEuroBCV).text().trim().replace(",", ".");

        var valuesBCV = {
            dateQuery: new Date().toLocaleString(),
            datePost: dateBCV || new Date().toLocaleDateString(),
            dolar: dolarBCV || "no disponible",
            euro: euroBCV || "no disponible",
            dolarRound: round(parseFloat(dolarBCV)),
            euroRound: round(parseFloat(euroBCV))
        };

        return {valuesBCV};
        
    } catch (error) {
        // return {error}
        return {"error": "error al obtener datos desde el servidor"}
    }
};

export {getDataBCV};