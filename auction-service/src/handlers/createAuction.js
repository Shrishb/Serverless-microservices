import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleWare from "../lib/commonMiddleware";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const {
    body: { title },
  } = event;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  const newAuction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
  };

  try {
    await dynamoDb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: newAuction,
      })
      .promise();
  } catch (error) {
    throw new createError.InternalServerError(500);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(newAuction),
  };
}

export const handler = commonMiddleWare(createAuction);