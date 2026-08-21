import React from 'react';
import PropTypes from 'prop-types';
import Img from './Img';
import Comparison from './Comparison';
import { getCategoryColors } from '../utils/categoryColors';

class Card extends React.Component {
    constructor(props) {
        super(props);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            showModal: false,
        };
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    renderComparison(comparison) {
        if (comparison) {
            return(
                <Comparison comparison={comparison}/>
            );
        }

    }

    renderDefenition(text) {
        let items = text.split('.');
        return (items[0] + '.');
    }

    renderCard() {
        return (
            (this.props.flipped) ?
                <div className={'card__face card__face--front animated flipInY'}>
                    <div onClick={this.props.onOpen}>
                        <div className={'card__face--front__header'}>
                            <div className={'principle-number'}>
                                {this.props.id}
                            </div>
                            <div className={'principle-title'}>
                                {this.props.principle}
                            </div>
                        </div>
                        <div className={'card__face--front__category'}>
                            <div className={'card__face--front__category__text'}>{this.props.categoryName}</div>
                        </div>
                        <div className={'card__face--front__body'}>
                            <div className={'card__face--front__body__desc'}>
                                {this.renderDefenition(this.props.description)}
                            </div>
                            <Img id={this.props.id} classes={'card__face--front__body__image'}/>
                            <div className={'card__face--front__body__example'}>
                                {this.renderComparison(this.props.subtitle)}
                            </div>
                        </div>
                    </div>
                    <div className={'card__face--front__flipicon'} onClick={this.props.onFlipToBack}>
                        <i className='fas fa-exchange-alt'></i>
                    </div>
                </div>
                :
                <div className={'card__face card__face--back animated'} onClick={this.props.onFlipToFront}>
                    <div className={'card__face--back__content'}>
                        <div className={'principle-number'}>
                            {this.props.id}
                        </div>
                        <Img id={this.props.id}/>
                        <div className={'principle-title'}>
                            {this.props.principle}
                        </div>
                    </div>
                    <div className={'card__face--back__category'}>
                        {this.props.categoryName}
                    </div>

                </div>
        );
    }

    render() {
        const colors = getCategoryColors(this.props.categoryColor);
        const style = {
            '--cat-dark': colors.dark,
            '--cat-mid': colors.mid,
            '--cat-light': colors.light,
            '--cat-text': colors.text
        };

        return (
            <div className={'card'} style={style}>
                { this.renderCard() }
            </div>
        );
    }
}

Card.propTypes = {
    flipped: PropTypes.any,
    id: PropTypes.any,
    categoryId: PropTypes.any,
    categoryName: PropTypes.any,
    categoryColor: PropTypes.any,
    principle: PropTypes.any,
    questions: PropTypes.any,
    description: PropTypes.any,
    subtitle: PropTypes.any,
    examples: PropTypes.any,
    exampleGame: PropTypes.any,
    gameExURL: PropTypes.any,
    gameExDesc: PropTypes.any,
    related: PropTypes.any,
    onOpen: PropTypes.any,
    onFlipToFront: PropTypes.any,
    onFlipToBack: PropTypes.any
};

export default Card;