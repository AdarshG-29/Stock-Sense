
import axios from 'axios';

export const upstoxApiCalls = (apiEndPoint: string, callRequestType: string) => {
    const URL = `https://api.upstox.com/v3/${apiEndPoint}`;

    const headers = {
        'Authorization': `Bearer ${process.env.UPSTOX_ACCESS_TOKEN || ''}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    return axios({
        method: callRequestType,
        url: URL,
        headers: headers
    });

    // const resp = await upstoxApiCalls(`historical-candle/NSE_EQ%7CINE848E01016/minutes/1/2025-01-02/2025-01-01`, 'GET');
   // console.log(resp.data)
}