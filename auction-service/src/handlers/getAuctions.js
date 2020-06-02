import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleWare from '../lib/commonMiddleware';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions;

  try {
    const results = await dynamoDb
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME,
      })
      .promise();

    auctions = results.Items;
  } catch (error) {
    throw new createError.InternalServerError(500);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMiddleWare(getAuctions);