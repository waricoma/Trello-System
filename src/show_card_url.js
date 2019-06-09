'use strict';


require('dotenv').config();
const Trello = require('trello');
const args = process.argv[2];
const axios = require('axios');

const trello = new Trello(
  process.env.API_KEY, // first argument: application key
  process.env.TOKEN // second arguemtn: user token
);

/**
 * Member ID
 * argument: id of member of the board
 * @type {string}
 */

const BOARD_NAME = process.env.BOARD_NAME;

const urlAllBoards = `https://api.trello.com/1/members/me/boards?key=${process.env.API_KEY}&token=${process.env.TOKEN}`;


let storeCardUrls = [];

const resUrl = async function () {
  try {
    const getAllBoards = await axios(urlAllBoards);

    const board = getAllBoards.data.filter((board) => board.name === BOARD_NAME)[0]

    const listOnBoard = await trello.getListsOnBoard(board.id);

    const cards = await trello.getCardsOnList(listOnBoard[0].id);

    for (let ele in cards) {
      for (let i in cards[ele].labels) {
        if (cards[ele].labels[i].name === args) {
          storeCardUrls.push(cards[ele].shortUrl);
        }
      }
    }
    if (storeCardUrls.length === 0) {
      console.log("Can't not the find the card with this label");
    } else {
      console.log(storeCardUrls);
      return storeCardUrls;
    }

  } catch (error) {
    console.log(error);
  }
};
resUrl();



