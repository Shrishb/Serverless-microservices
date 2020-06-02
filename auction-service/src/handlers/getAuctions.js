import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleWare from '../lib/commonMiddleware';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions;
  const {status } = event.queryStringParameters;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: "statusEndDate",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeValues: {
      ":status": status,
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  try {
    const results = await dynamoDb
      .query(params)
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