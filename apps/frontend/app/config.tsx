import 'dotenv/config';



const FE_URL = process.env.NEXT_PUBLIC_FE_URL
const WS_URL = process.env.NEXT_PUBLIC_WS_URL
console.log(FE_URL);
export {FE_URL, WS_URL};