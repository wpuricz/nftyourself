import * as Web3 from 'web3'

//import { PortisProvider } from 'portis'

// export const OPENSEA_URL = "https://opensea.io"; // test
// export const COLLECTION_NAME = "Jersey Shore"
export const OPENSEA_URL = "https://rinkeby-api.opensea.io";  // prod
export const COLLECTION_NAME = "carbureted"
export const COLLECTION_LIST = [
  "carbureted",
  "nycmoments",
  "jersey-shore",
  "pixelmeows",
];

// owner is same for test and prod
export const OWNER = "0x8c059e23890ad6e2a423fb5235956e17c7c92d7f"


export let web3Provider = typeof web3 !== 'undefined'
  ? window.web3.currentProvider
  : new Web3.providers.HttpProvider('https://mainnet.infura.io')

// export async function promisify(inner) {
//   return new Promise((resolve, reject) =>
//     inner((err, res) => {
//       if (err) { reject(err) }
//       resolve(res)
//     })
//   )
// }

export const ORDER_ERROR_BID_NOT_VALID = 'The price you specified is not valid';
export const ORDER_ERROR_GENERAL = 'We were not able to process your bid';
export const ORDER_ERROR_HIGHER_BID = 'You already have a higher bid';



