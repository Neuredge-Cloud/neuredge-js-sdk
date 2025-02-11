import colors from 'colors';

const apiKey = process.env.NEUREDGE_API_KEY || 'nrkey_239f055f1a3acc1b576e91e6489b7a6c';
const baseUrl = process.env.NEUREDGE_API_URL || 'http://127.0.0.1:8787';

console.log(colors.gray('Using config:'));
console.log(colors.gray(`  API Key: ${apiKey.slice(0, 8)}...`));
console.log(colors.gray(`  Base URL: ${baseUrl}`));

export const config = {
  apiKey,
  baseUrl
};
