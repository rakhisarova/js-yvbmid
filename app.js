const axios = require('axios');
const cheerio=require('cheerio');
const{MongoClient}= require('mongodb');

const url='https://www.shoppersstop.com/store-finder';
const databaseUrl='mongodb://localhost:27017';
const databaseName='store_finder';
const collectionName='stories';

async function scrapWebsite() {
  try{
    const rsponse=await axios.get(url);
    const $=cheerio.load(response.data);

    const stores =[];
    $ ('.storeFinderList li').each((index,element)=> {
      const name =$(element).find('.sfhContent h4').text().trim();
      const address = $(element).find('.sfhContent.sf1Addr').text().trim();

      stores.push({name,address});
    });
    return stores;

  }catch(error) {
    console.error('Error scrapping the website',error);
    return[];
  }
}
async function saveToDatabase(stores) {
  try{
    const client=await MongoClient.connect(databaseUrl);
    const db=client.db(databaseName);
    const collection = db.collection(collectionName);

    await collection.insertMany(stores);
    console.log('Data saved to the database.');

  } catch(error) {
    console.error('Error saving data to the database: ', error);
  } finally {
    client.close();
  }
}

async function main() {
  const stores =await scrapWebsite();
  if(stores.length>0) {
    await saveToDatabase(stores);
  }
  else {
    console.log('No stores found.');

  }
  }
main();