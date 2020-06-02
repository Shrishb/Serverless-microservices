import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleWare from "../lib/commonMiddleware";
import { getAuctionById } from "./getAuction";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const auction = await getAuctionById(id);

  const{highestBid:{amount: bidAmount}} = auction;

  if(auction.status !== "OPEN"){
    throw new createError.Forbidden("You cannot bid on closed auctions!!");
  }

  if(amount <= bidAmount){
    throw new createError.Forbidden(`Your bid must be higher than ${bidAmount}`);
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set highestBid.amount = :amount",
    ExpressionAttributeValues: {
      ":amount": amount,
    },
    ReturnValues: "ALL_NEW",
  };

  let updatedAuction;

  try {
    const result = await dynamoDb.update(params).promise();
    updatedAuction = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(500);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleWare(placeBid);