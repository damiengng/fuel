const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const fs = require('fs');


app.get('/api/explore', async (req, res) => {
    try {
        const response = await axios.get('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets', {
            params: {
                limit: 5,
                offset: 0,
                timezone: 'UTC',
                include_links: false,
                include_app_metas: false
            }
        });
        res.json(response.data);
        const data = JSON.stringify(response.data);
        fs.writeFile('data.txt', data, (err) => {
            if (err) {
                console.error('Erreur lors de l\'écriture du fichier :', err);
            } else {
                console.log('Les données ont été écrites dans le fichier avec succès');
            }
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error.message);
        res.status(500).send("Erreur lors de la récupération des données de l'API");
    }
});


app.post('/api/post', async (req, res) => {
    try {
        const { type } = req.body;
        const response = await axios.get(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/prix-des-carburants-j-1/records?limit=5&refine=com_arm_name%3A%22${type}%22`);

        // formatage des prix
        const formatPrice = (price) => {
            if (price === null) {
                return '';
            }
            // convertir le prix en décimal et le formater avec deux décimales
            let formattedPrice = parseFloat(price) * 1000;
            if (formattedPrice > 100) {
                formattedPrice /= 1000;
            }
            return formattedPrice.toFixed(2);
        };

        // uniquement les prix des carburants, les formater et inclure l'adresse
        const fuelPrices = response.data.results.reduce((uniqueStations, station) => {
            const existingStation = uniqueStations.find(s => s.address === station.address);
            // si n'existe pas on ajoute à uniqueStations
            if (!existingStation) {
                uniqueStations.push({
                    name: station.name,
                    address: station.address,
                    price_gazole: formatPrice(station.price_gazole),
                    price_sp95: formatPrice(station.price_sp95),
                    price_sp98: formatPrice(station.price_sp98),
                    price_gplc: formatPrice(station.price_gplc),
                    price_e10: formatPrice(station.price_e10),
                    price_e85: formatPrice(station.price_e85)
                });
            }
            return uniqueStations;
        }, []);
        res.json(fuelPrices);
    } catch (error) {
        if (req.status)
            console.error("Erreur lors de la récupération des données:", error.message);
        res.status(500).send("Erreur lors de la récupération des données de l'API");
    }
});




// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur Node.js écoutant sur le port ${port}`);
});



// 3) une requête qui va appeler une API et faire du traitement sur fichier récupérer les données d'une API les ecrire sur un fichier en local et les afficher
