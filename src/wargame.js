import React, { Component } from 'react';
import './wargame.css';

import { images, cardback } from "./imagesImport.js";

//I did not see too great a need for making subcomponents - most of what I accomplished was in functionality in these functions.
class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            autoplay: false,
            gameActive: false,
            wins: 0,
            losses: 0,
            wars: 0,
            playerCards: [],
            computerCards: [],
            currentPlayerCard: null,
            currentComputerCard: null,
            playerDraws: [],
            computerDraws: [],
            inWar: false
        }

        this.SetUpGame();
    }

    //Fucntion to Create and distribute a New Deck
    SetUpGame = () => {
        //Define the entire card deck
        let CardDeck = []
        for (let i = 0; i < 52; i++) {
            console.log(this.GetCardRepresentation(i))
            CardDeck.push(i)
        }

        //Pull cards out randomly to add to the user's hand
        let userCards = [];
        for (let i = 0; i < 26; i++) {
            userCards = userCards.concat(
                CardDeck.splice(
                    Math.floor(Math.random() * CardDeck.length),
                    1
                )
            )
        }

        //Randomize computer's deck
        for (let i = 0; i < 26; i++) {
            const randID = Math.floor(Math.random() * 26)
            const temp = CardDeck[randID]
            CardDeck[randID] = CardDeck[i];
            CardDeck[i] = temp;
        }

        //Use the Decks in State
        this.setState({
            gameActive: true,
            playerCards: userCards,
            computerCards: CardDeck,
            currentPlayerCard: null,
            currentComputerCard: null,
            playerDraws: [],
            computerDraws: [],
            inWar: false
        })
    }

    FlipCard = () => {
        /*
            Function to Flip Cards:
            this button handles taking from the top of each deck,
            comparing the result,
            initiating a war if applicable,
            and using setState to save the changes
         */
        console.log(this.state);

        const playerCard = this.state.playerCards.shift();
        const computerCard = this.state.computerCards.shift();

        let war = false;
        let playerDraws = [];
        let computerDraws = [];

        const result = this.CompareCards(playerCard, computerCard);
        if (result === 0) {//computer wins draw
            if (this.state.playerCards.length === 0) {
                this.setState({
                    gameActive: false,
                    losses: this.state.losses + 1,
                    currentPlayerCard: null,
                    currentComputerCard: null,
                    playerDraws: [],
                    computerDraws: [],
                    inWar: false
                })
                return;
            }

            this.state.computerCards.push(computerCard);
            this.state.computerCards.push(playerCard);

            if (this.state.inWar) {
                this.state.playerDraws.forEach(card => {
                    this.state.computerCards.push(card);
                })
                this.state.computerDraws.forEach(card => {
                    this.state.computerCards.push(card);
                })
            }

        }
        else if (result === 1) {//players wins draw

            if (this.state.computerCards.length === 0) {
                this.setState({
                    gameActive: false,
                    wins: this.state.wins + 1,
                    currentPlayerCard: null,
                    currentComputerCard: null,
                    playerDraws: [],
                    computerDraws: [],
                    inWar: false
                })
                return;
            }

            this.state.playerCards.push(playerCard);
            this.state.playerCards.push(computerCard);

            if (this.state.inWar) {

                this.state.computerDraws.forEach(card => {
                    this.state.playerCards.push(card);
                })
                this.state.playerDraws.forEach(card => {
                    this.state.playerCards.push(card);
                })
            }
        }
        if (result === 2) {
            //War - take 3 more facedown cards
            war = true;
            playerDraws = this.state.playerDraws.concat([
                playerCard,
                this.state.playerCards.shift(),
                this.state.playerCards.shift(),
                this.state.playerCards.shift()
            ])
            computerDraws = this.state.computerDraws.concat([
                computerCard,
                this.state.computerCards.shift(),
                this.state.computerCards.shift(),
                this.state.computerCards.shift()
            ])
        }
        console.log(result);

        this.setState({
            inWar: war,
            wars: war ? this.state.wars + 1 : this.state.wars,
            playerCards: this.state.playerCards,
            computerCards: this.state.computerCards,
            currentPlayerCard: playerCard,
            currentComputerCard: computerCard,
            playerDraws: playerDraws,
            computerDraws: computerDraws
        })

        if (this.state.gameActive && this.state.autoplay)
            setTimeout(this.FlipCard, 500);
    }

    //Function to Retrieve the Text Identification of Each Card
    GetCardRepresentation(cardInt) {
        if (cardInt === null)
            return "Flip a Card!"


        let suit = Math.floor(cardInt / 13);
        let value = cardInt % 13;

        switch (suit) {
            case 0:
                suit = "Spades"
                break;
            case 1:
                suit = "Hearts"
                break;
            case 2:
                suit = "Diamonds"
                break;
            case 3:
                suit = "Clubs"
                break;
            default:
                console.log("Error: Suit out of Bounds");
        }

        if (value === 0)
            value = "Ace"
        else if (value < 10)
            value++
        else if (value === 10)
            value = "Jack"
        else if (value === 11)
            value = "Queen"
        else if (value === 12)
            value = "King"

        return `${value} of ${suit}`
    }

    //Function to compare the result of a draw
    CompareCards(card1, card2) {
        let a = Math.floor(card1 % 13);
        if (a === 0) a = 14;
        let b = Math.floor(card2 % 13);
        if (b === 0) b = 14;

        if (a < b)
            return 0 //card 2 wins
        else if (a > b)
            return 1 //card 1 wins
        else
            return 2 //War!
    }

    render() {
        return (
            <div className="CardGame-War">
                <button onClick={this.SetUpGame}>Start Game!</button>
                <button onClick={() => { this.setState({ autoplay: !this.state.autoplay }, this.FlipCard) }}>Toggle AutoPlay</button>

                <div className="FlexRow">
                    <h2>Games Won: {this.state.wins}</h2>

                    <h2>Total Wars: {this.state.wars}</h2>

                    <h2>Games Lost: {this.state.losses}</h2>
                </div>

                {this.state.gameActive &&
                    <div>
                        <div className="GameBoard FlexRow">
                            <div className="PlayerSide">
                                <div>
                                    <img src={images[this.state.currentPlayerCard]} alt="" />
                                    <div className="GameText">
                                        Player's Card: {this.GetCardRepresentation(this.state.currentPlayerCard)}
                                    </div>
                                </div>

                                <div className="User Card Deck">
                                    <div className="GameText">Cards Remaining: {this.state.playerCards.length}</div>
                                    {this.state.playerCards.length > 1 &&
                                        <img src={cardback} alt="User Card Deck" />}
                                    {this.state.playerCards.length > 20 &&
                                        <img src={cardback} alt="User Card Deck" />}
                                    {this.state.playerCards.length > 26 &&
                                        <img src={cardback} alt="User Card Deck" />}
                                    {this.state.playerCards.length > 34 &&
                                        <img src={cardback} alt="User Card Deck" />}
                                </div>
                            </div>

                            {this.state.inWar && <h1>WAR!</h1>}

                            <div className="ComputerSide">
                                <div>
                                    <img src={images[this.state.currentComputerCard]} alt="" />
                                    <div className="GameText">
                                        Computer's Card: {this.GetCardRepresentation(this.state.currentComputerCard)}
                                    </div>
                                </div>

                                <div className="Computer Card Deck">
                                    <div className="GameText">Cards Remaining: {this.state.computerCards.length}</div>
                                    {this.state.computerCards.length > 1 &&
                                        <img src={cardback} alt="Computer Card Deck" />}
                                    {this.state.computerCards.length > 20 &&
                                        <img src={cardback} alt="Computer Card Deck" />}
                                    {this.state.computerCards.length > 26 &&
                                        <img src={cardback} alt="Computer Card Deck" />}
                                    {this.state.computerCards.length > 34 &&
                                        <img src={cardback} alt="Computer Card Deck" />}
                                </div>
                            </div>
                        </div>
                        <div>
                            <button onClick={this.FlipCard}>Flip</button>
                        </div>
                    </div>}
            </div >
        );
    }

}

export default Game;
