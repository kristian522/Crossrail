const axios = require('axios');

module.exports = async (request, response) => {
  try {
    const timetableApiUrl = 'https://jegy-a.mav.hu/IK_API_PROD/api/InformationApi/GetTimetable';
    
    const mavResponse = await axios.post(timetableApiUrl, request.body, {
      headers: { 
        'Content-Type': 'application/json',
        'UserSessionId': '"\'\'"'
      },
    });

    response.status(200).json(mavResponse.data);
  } catch (error) {
    console.error('MÁV API Hiba (train-info):', error.response?.status, error.response?.data);
    response.status(500).json({ message: 'Hiba a MÁV API hívása közben.' });
  }
};