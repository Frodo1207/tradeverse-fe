import spwapi from './spwapiClient';

export const preauthService = {
  getMsg: async (authKey) => {
    const response = await spwapi.post('/preauth/get_msg', { auth_key: authKey });
    console.log('getMsg response:', response);
    return response.data;
  },
  verifyMsg: async ({ id, sign, ref }) => {
    const response = await spwapi.post('/preauth/verify_msg', { id, sign, ref });
    console.log('verifyMsg response:', response);
    return response.data;
  },
};

export default spwapi;
