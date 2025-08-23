const axios = require('axios');

// A Vercel minden fájlt egyetlen exportált függvénnyé alakít
module.exports = async (request, response) => {
  try {
    const timetableApiUrl = 'https://jegy-a.mav.hu/IK_API_PROD/api/InformationApi/GetTimetable';
    
    // A 'request.body' tartalmazza az Angular által küldött adatokat
    const mavResponse = await axios.post(timetableApiUrl, request.body, {
      headers: { 'Content-Type': 'application/json' },
    });

    // Visszaküldjük a MÁV válaszát a frontendnek
    response.status(200).json(mavResponse.data);
  } catch (error) {
    // Részletesebb hibakezelés a Vercel logokhoz
    console.error('MÁV API Hiba (station-info):', error.response?.status, error.response?.data);
    response.status(500).json({ message: 'Hiba a MÁV API hívása közben.' });
  }
};