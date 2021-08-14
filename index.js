/*
const handlers = require("./handlers");
const { uploadHanabom, putHanabom } = require("./hanabomAPI");
const { dbAction, dbEnd } = require("./db");

exports.handler = async (event) => {
  console.log("event:", event);
  const shopifyObj = JSON.parse(event.body);
  // TODO: vendor title
  // const vendor = event.headers.x-shopify-shop-domain;

  // Initial product setup
  let product = await handlers.basicProperties(shopifyObj);

  // Each Complex Properties setup
  product.type = await handlers.typeProperty(shopifyObj);
  product.short_description = await handlers.shortDescProperty(shopifyObj);
  product.attributes = await handlers.attProperty(shopifyObj);
  product.categories = await handlers.categoryProperty(shopifyObj);
  product.variations = await handlers.variProperty(shopifyObj);

  product = await handlers.stockProperties(product, shopifyObj);

  console.log("product:", product);

  // Store on db
  const hanaID = "19175";
  const shopifyID = "70354430199655";
  const prodName = product.name;
  const sql =
    'INSERT INTO products (hanaId, wixId, name) VALUES ("' +
    hanaID +
    '", "' +
    shopifyID +
    '", "' +
    prodName +
    '");';
  console.log("sql:", sql);

  dbAction(sql, (results) => {
    console.log("inside db action");
    return results;
  });
  dbEnd();


  // Find from db
  const shopifyID = shopifyObj.id;
  const sql = `SELECT * FROM products WHERE wixId = "${shopifyID}";`;
  console.log("sql:", sql);

  // // Update Image of uploaded product -- it takes long (20 seconds)
  // const pImages = await handlers.imageProperty(shopifyObj);
  // const newProduct = await putHanabom(uploadRes.id, {images: pImages});

  // // Update Description with S3 Image URI
  // const pDesc = await handlers.descProperty(newProduct.images);

  dbAction(sql, (results) => {
    let sqlData = results;
    console.log("sql data:", sqlData);

    const dataShape = { ...product, description: "pDesc" };
    console.log("dataShape:", dataShape);
    // putHanabom(uploadRes.id, {description: pDesc});
    putHanabom(sqlData[0].hanaId, objectResult[0]);
    return sqlData;
  });
  dbEnd();
  

  // Response
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};

*/

const handlers = require("./handlers");
const { uploadHanabom } = require("./hanabomAPI");
const { dbAction, dbEnd } = require("./db");

exports.handler = async (event) => {
  console.log("event:", event);
  // const shopifyObj = event.body;
  const shopifyObj = JSON.parse(event.body);
  // const vendor = event.headers.x-shopify-shop-domain;

  // Initial product setup
  let product = await handlers.basicProperties(shopifyObj);

  // Upload product to Hanabom
  const uploadRes = await uploadHanabom(product);

  // Store on db
  const hanaID = uploadRes.id;
  const shopifyID = shopifyObj.id;
  const prodName = product.name;
  const sql = helpers.sql(hanaID, shopifyID, prodName);
  console.log("sql:", sql);

  dbAction(sql, (results) => {
    console.log("inside db action");
    return results;
  });
  dbEnd();

  console.log("after db end");

  // Response
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};
