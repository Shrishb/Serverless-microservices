import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleWare from "../lib/commonMiddleware";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id) {
  let auction;

  try {
    const results = await dynamoDb
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
      })
      .promise();

    auction = results.Item;
  } catch (error) {
    throw new createError.InternalServerError(500);
  }

  if (!auction) {
    throw new createError.NotFound(`Action with id "${id}" not found `);
  }

  return auction;
}

async function getAuction(event, context) {
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleWare(getAuction);