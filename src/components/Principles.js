import React, { Component } from 'react';
import Card from './Card.js';
import principles from '../principles.json';
import categories from '../categories.json';
import Button from './Button.js';
import CardModal from './CardModal';
import CategoryFilterButton from './CategoryFilterButton';

function compareStrings(a, b) {
    return (a < b) ? -1 : (a > b) ? 1 : 0;
}

function findCategory(categoryId) {
    return categories.find(cat => cat.id === categoryId) || {};
}

export default class Principles extends Component {

    constructor() {
        super();
        this.state = {
            cards: [],
            allFlipped: false,
            showModal: false,
            cardInModal: principles[0],
            hiddenCategoryIds: []
        };

        this.toggleCategory = this.toggleCategory.bind(this);
        this.flipAll = this.flipAll.bind(this);
        this.sortAZ = this.sortAZ.bind(this);
        this.sortNumerical = this.sortNumerical.bind(this);
        this.resetCards = this.resetCards.bind(this);
        this.shuffleCards = this.shuffleCards.bind(this);
        this.draw5Cards = this.draw5Cards.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.modalNavToNext = this.modalNavToNext.bind(this);
        this.modalNavToPrev = this.modalNavToPrev.bind(this);
        this.modalOpenRelated = this.modalOpenRelated.bind(this);
        this.openRandomCard = this.openRandomCard.bind(this);
    }

    handleClose() {
        this.setState({ showModal: false });
    }

    handleShow() {
        this.setState({ showModal: true });
    }

    componentDidMount() {
        this.setState({cards: principles});
    }

    //utility
    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    //category actions
    toggleCategory(catId) {
        let hidden = this.state.hiddenCategoryIds;
        if (hidden.includes(catId)) {
            hidden = hidden.filter(id => id !== catId);
        } else {
            hidden = [...hidden, catId];
        }
        this.setState({hiddenCategoryIds: hidden});
    }

    isCategoryHidden(catId) {

        //if every category is hidden, show all (as opposed to nothing)
        if (this.state.hiddenCategoryIds.length >= categories.length) {
            return false;
        }

        return this.state.hiddenCategoryIds.includes(catId);
    }

    //toolbar actions
    flipAll() {
        let items = this.state.cards;
        for (let card of items) {
            card.flipped = !this.state.allFlipped;
        }
        this.setState({cards: items});
        this.setState({allFlipped: !this.state.allFlipped});

        console.log(this.state);
    }

    sortNumerical() {
        let items = this.state.cards;
        items.sort(function(a, b){return (a.id - b.id);});
        this.setState({cards: items});
    }

    sortAZ() {
        let items = this.state.cards;
        items.sort(function(a, b) {
            return compareStrings(a.principle, b.principle);
        });
        this.setState({cards: items});
    }

    //card flip actions, etc
    resetCards() {
        let items = principles;
        items.sort(function(a, b){return (a.id - b.id);});
        for (let card of items) {
            card.flipped = false;
        }
        this.setState({cards: items});
        this.setState({hiddenCategoryIds: []});
    }

    flipToBack(flipcard) {
        if(!flipcard.id) {
            flipcard = this.state.cardInModal;
        }
        let items = this.state.cards;
        for (let card of items) {
            if (card.id === flipcard.id) {
                card.flipped = false;
            }
        }
        this.setState({cards: items});
    }

    flipToFront(flipcard) {
        if(!flipcard.id) {
            flipcard = this.state.cardInModal;
        }
        let items = this.state.cards;
        for (let card of items) {
            if (card.id === flipcard.id) {
                card.flipped = true;
            }
        }
        this.setState({cards: items});
    }

    shuffleCards() {
        let shuffled = this.shuffle(this.state.cards);
        this.setState({cards: shuffled});
    }

    draw5Cards() {
        this.setState({hiddenCategoryIds: []});

        let cards = this.shuffle(principles);
        let hand = cards.slice(0, 5);
        this.setState({cards: hand});
    }

    //modal actions
    renderModal(card) {
        this.setState({cardInModal: card});
        this.setState({showModal: true});
    }

    modalNavToNext() {
        let currentCardIndex = this.state.cards.indexOf(this.state.cards.find(card => card.id === (this.state.cardInModal.id)));
        //if you are on the last card, go to the first one. If not, go to the next one.
        let nextCardIndex = ((currentCardIndex + 1) < this.state.cards.length) ? (currentCardIndex + 1) : 0;
        let nextCard = this.state.cards[nextCardIndex];

        this.setState({cardInModal: (nextCard)});
    }

    modalNavToPrev() {
        let currentCardIndex = this.state.cards.indexOf(this.state.cards.find(card => card.id === (this.state.cardInModal.id)));
        //If you are already on the first card, do nothing
        let prevCardIndex = (currentCardIndex == 0) ? currentCardIndex : (currentCardIndex - 1);
        let prevCard = this.state.cards[prevCardIndex];

        this.setState({cardInModal: (prevCard)});
    }

    modalOpenRelated(id) {
        let card = principles.filter(function(item) { return item.id == id; })[0];
        this.setState({cardInModal: card});
    }

    openRandomCard() {
        let min =1;
        let max = principles.length;
        let random = Math.floor(Math.random() * (+max - +min)) + +min;
        let card = principles[random];
        this.renderModal(card);
    }

    render() {
        const modalCategory = findCategory(this.state.cardInModal.categoryId);

        return (
            <div className='cards'>
                <div className={'main-tools'}>
                    <div className={'row'}>
                        <div className={'col-12'}>
                            <h3 className={'main-label'}>Filter by Category:</h3>
                            <div className={'category-filters'}>
                                {categories.map(cat => (
                                    <CategoryFilterButton
                                        key={cat.id}
                                        name={cat.name}
                                        color={cat.color}
                                        active={!this.isCategoryHidden(cat.id)}
                                        onPress={() => this.toggleCategory(cat.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={'row'}>
                        <div className={'col-12'}>
                            <div className={'toolbar'}>
                                <h3 className={'main-label'}>Actions:</h3>
                                <Button onClick={this.resetCards} text={'Reset'} icon={'undo-alt'}></Button>
                                <Button onClick={this.flipAll} text={'Flip All'} icon={'exchange-alt'}></Button>
                                <Button onClick={this.sortAZ} text={'Sort A-Z'} icon={'sort-alpha-down'}></Button>
                                <Button onClick={this.sortNumerical} text={'Sort Numeric'} icon={'sort-numeric-down'}></Button>
                                <Button onClick={this.shuffleCards} text={'Shuffle'} icon={'random'}></Button>
                                <Button onClick={this.openRandomCard} text={'Random Card'} icon={'question'}></Button>
                                <Button onClick={this.draw5Cards} text={'Draw 5'} icon={'hand-paper'}></Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={'row'}>

                    {this.state.cards.map( card => (
                        <div key={card.id} className={'col-xs-12 col-sm-12 card-container ' + (this.isCategoryHidden(card.categoryId) ? 'hide' : '')}>
                            <Card
                                flipped={card.flipped}
                                id={card.id}
                                image={card.id}
                                categoryId={card.categoryId}
                                categoryName={findCategory(card.categoryId).name}
                                categoryColor={findCategory(card.categoryId).color}
                                principle={card.principle}
                                description={card.description}
                                subtitle={card.subtitle}
                                examples={card.examples}
                                onOpen={() => this.renderModal(card)}
                                onFlipToFront={() => this.flipToFront(card)}
                                onFlipToBack={() => this.flipToBack(card)}
                            />
                        </div>
                    ))}

                </div>

                <CardModal
                    show={this.state.showModal}
                    onClose={this.handleClose}
                    onNext={this.modalNavToNext}
                    onPrev={this.modalNavToPrev}
                    onOpenRelated={this.modalOpenRelated}
                    id={this.state.cardInModal.id}
                    categoryId={this.state.cardInModal.categoryId}
                    categoryName={modalCategory.name}
                    categoryColor={modalCategory.color}
                    principle={this.state.cardInModal.principle}
                    questions={this.state.cardInModal.questions}
                    description={this.state.cardInModal.description}
                    subtitle={this.state.cardInModal.subtitle}
                    examples={this.state.cardInModal.examples}
                    exampleGame={this.state.cardInModal.exampleGame}
                    exampleGameUrl={this.state.cardInModal.exampleGameUrl}
                    exampleGameDesc={this.state.cardInModal.exampleGameDesc}
                    related={this.state.cardInModal.related}
                    cited={this.state.cardInModal.cited}

                />

            </div>
        );
    }
}
