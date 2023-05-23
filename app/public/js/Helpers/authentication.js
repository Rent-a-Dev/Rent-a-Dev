require('dotenv').config();

const getBearerToken = async (code) => {
  const body = new URLSearchParams();
  body.append('client_id', process.env.CLIENT_ID );
  body.append('client_secret', process.env.GIT_SECRET );
  body.append('code', code);
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body:body
    });

    const json = await response.json();
    return json.access_token;
  } catch (error) {
    console.log(error);
  }
};

const getUserInfo = async (access_token) => {
  try {
    const response = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${access_token}`
      },
    });

    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUserInfo,
  getBearerToken  
};