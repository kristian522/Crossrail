const axios = require('axios');

module.exports = async (request, response) => {
  try {
    const stationApiUrl = 'https://jegy-a.mav.hu/IK_API_PROD/api/OfferRequestApi/GetStationList';

    // A MÁV API-nak küldött fix kérés, a server.js fájlod logikája alapján
    const mavResponse = await axios.post(stationApiUrl, {
      "UAID": "2Juija1mabqr24Blkx1qkXxJ105j"
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    // Fontos: A válaszból csak a tényleges állomások listáját (`.stations`) küldjük vissza,
    // pont úgy, ahogy a szervered is tette.
    response.status(200).json(mavResponse.data.stations);
  } catch (error) {
    console.error('MÁV API Hiba (stations):', error.response?.status, error.response?.data);
    response.status(500).json({ message: 'Hiba az állomáslista lekérése közben.' });
  }
};