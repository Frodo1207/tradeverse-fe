import spwapi from './spwapiClient';

export const authUserService = {
  getProfile: async () => {
    const response = await spwapi.get('/auth/user/profile');
    return response.data;
  },
  sendEmailBindCode: async (email) => {
    const response = await spwapi.post('/auth/user/profile/email/send', { email });
    console.log("send", response)
    return response.data;
  },
  verifyEmailBindCode: async ({ email, code }) => {
    const response = await spwapi.post('/auth/user/profile/email/verify', { email, code });
    console.log("verify", response)
    return response.data;
  },
};
