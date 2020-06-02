import { getExpiredAuctions } from "../lib/getExpiredAuctions";
import { closeAuction } from "../lib/getExpiredAuctions";
import createError from "http-errors";

async function processAuctions(event, context) {
  try {
    const expiredAuctions = await getExpiredAuctions();

    const closePromises = expiredAuctions.map((auction) =>
      closeAuction(auction)
    );
    await Promise.all(closePromises);

    return { closedBids: closePromises.length };
  } catch (error) {
    throw new createError.InternalServerError(500);
  }
}

export const handler = processAuctions;