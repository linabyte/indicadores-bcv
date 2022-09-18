
import axios from 'axios';
import * as cheerio from 'cheerio';

// const url = 'https://www.petro.gob.ve/es/';
const apiCoins = 'https://petroapp-price.petro.gob.ve/price/PTR/';
const apiFiats = 'https://petroapp-price.petro.gob.ve/price/';

const getDataPetro = async () => {
    try {
        // const { data } = await axios.post(apiCoins,{coins:["BTC","DASH","LTC","ETH"]});
        const { data } = await axios.post(apiFiats,{coins:["PTR"], fiats:["Bs","COP","USD","EUR"]});

        const bsPetro = data.data.PTR.BS;
        const copPetro = data.data.PTR.COP;
        const usdPetro = data.data.PTR.USD;
        const eurPetro = data.data.PTR.EUR;
    
        const valuesPetro = {
            dateQuery: new Date().toLocaleString(),
            bsPetro: bsPetro || "no disponible",
            copPetro: copPetro || "no disponible",
            usdPetro: usdPetro || "no disponible",
            eurPetro: eurPetro || "no disponible"    
        };

        return {valuesPetro};

    } catch (error) {
        // return {error}
        return {"error": "error al obtener datos desde el servidor"}
    }
};

export {getDataPetro};