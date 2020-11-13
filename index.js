/**
 * Background Cloud Function to be triggered by PubSub.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} callback The callback function.
 */
exports.subscribe = function (event, callback) {
    const BigQuery = require('@google-cloud/bigquery');
    const projectId = "zippelin-7b813"; //Enter your project ID here
    const datasetId = "streamingIoTSensorData1"; //Enter your BigQuery dataset name here
    const tableId = "sensorDataFunctionNew"; //Enter your BigQuery table name here -- make sure it is setup correctly
    const PubSubMessage = event.data;
    // Incoming data is in JSON format
    const incomingData = PubSubMessage ? Buffer.from(PubSubMessage, 'base64').toString() : "{'t':'-273','h':'-1','p':'0','ti':'1/1/1970 00:00:00','id':'na'}";
  
    const jsonData = JSON.parse(incomingData);
    var rows = [jsonData];
  
    console.log(`Uploading data: ${JSON.stringify(rows)}`);
  
    // Instantiates a client
    const bigquery = BigQuery({
      projectId: projectId
    });
  
    // Inserts data into a table
    bigquery
      .dataset(datasetId)
      .table(tableId)
      .insert(rows)
      .then((foundErrors) => {
        rows.forEach((row) => console.log('Inserted: ', row));
  
        if (foundErrors && foundErrors.insertErrors != undefined) {
          foundErrors.forEach((err) => {
              console.log('Error: ', err);
          })
        }
      })
      .catch((err) => {
        console.error('ERROR:', err);
      });
    // [END bigquery_insert_stream]
  
  
    // callback();
  };
  
  
  
  