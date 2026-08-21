import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Img from './Img';
import Comparison from './Comparison';
import MultipleComparisons from './MultipleComparisons';
import GameExImg from './GameExImage';
import RelatedLink from './RelatedLink';
import { getCategoryColors } from '../utils/categoryColors';

class CardModal extends React.Component {
    constructor(props) {
        super(props);

        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleKeyPress(event) {
        if(event.key === 'ArrowLeft'){
            this.props.onPrev();
        }
        if(event.key === 'ArrowRight'){
            this.props.onNext();
        }
    }

    componentDidMount(){
        document.addEventListener('keydown', this.handleKeyPress, false);
    }
    componentWillUnmount(){
        document.removeEventListener('keydown', this.handleKeyPress, false);
    }

    renderGameExample() {
        if(this.props.exampleGame && this.props.exampleGameDesc) {
            return (
                <div className={'card-modal__body__details__section game-example'}>
                    <h3>What does it look like in a game?</h3>
                    <div className={'row'}>
                        <div className={'col-xs-12 col-sm-4'}>
                            <GameExImg id={this.props.id} classes={'game-example__image'}/>
                        </div>
                        <div className={'col-xs-12 col-sm-8'}>
                            <a className={'game-example__title'} href={this.props.exampleGameUrl} target={'_blank'}>
                                {this.props.exampleGame}
                                <i className={'fas fa-external-link-square-alt'}/>
                            </a>
                            <p>{this.props.exampleGameDesc}</p>
                        </div>
                    </div>
                </div>
            );
        }
    }

    renderExamples() {
        if (this.props.examples) {
            return (
                <div className={'card-modal__body__details__section'}>
                    <h3>What does it look like?</h3>
                    <MultipleComparisons comparisons={this.props.examples}/>
                </div>
            );
        }
    }

    renderQuestions() {
        if (this.props.questions) {
            return(
                <div className={'card-modal__body__details__section'}>
                    <div className={'card-modal__body__details__section__questions'}>
                        <h3>Ask Yourself</h3>
                        <p>{this.props.questions}</p>
                    </div>
                </div>
            );
        }
    }

    renderCitation() {
        if (this.props.cited) {
            return(
                <div>
                    <div className={'card-modal__body__side-panel__title'}>
                        <h3>Cited</h3>
                    </div>
                    <div className={'card-modal__body__side-panel__related'}>
                        <p>{this.props.cited}</p>
                    </div>
                </div>
            );
        }
    }

    renderRelated() {
        if (this.props.related) {
            let related = [];

            if (this.props.related.toString().includes(',')) {
                let items = this.props.related.split(',');
                for (let item of items) {
                    related.push(item);
                }
            } else {
                related.push(this.props.related);
            }
            return(
                <div>
                    <div className={'card-modal__body__side-panel__related'}>
                        <h3>Related Principles</h3>
                        {related.map((item, index) => (
                            ((index + 1) < related.length) ?
                                <span><RelatedLink key={item} id={item} onOpen={() => this.props.onOpenRelated(item)}></RelatedLink>, </span>
                                :
                                <RelatedLink key={item} id={item} onOpen={() => this.props.onOpenRelated(item)}></RelatedLink>
                        ))}
                    </div>
                </div>
            );
        }
    }

    render() {
        const colors = getCategoryColors(this.props.categoryColor);
        const style = {
            '--cat-dark': colors.dark,
            '--cat-mid': colors.mid,
            '--cat-light': colors.light,
            '--cat-text': colors.text
        };

        return(
            <Modal
                show={this.props.show}
                onHide={this.props.onClose}
                centered
                style={style}
                dialogClassName={'card-modal'}
            >
                <Modal.Header className={'card-modal__header'} closeButton>
                    <div className={'card-modal__header__id principle-number'}>{this.props.id}</div>
                    <h2 className={'card-modal__header__title'}>{this.props.principle}</h2>
                    <div className={'card-modal__header__cat'}>
                        {this.props.categoryName}
                    </div>
                </Modal.Header>
                <Modal.Body className={'card-modal__body row'}>
                    <div className={'card-modal__body__side-panel col-xs-12 col-sm-4 col-md-4'}>
                        <Img id={this.props.id} classes={'card-modal__body__side-panel__img'}/>
                        <div className={'card-modal__body__side-panel__definition'}>
                            <p>{this.props.description}</p>
                        </div>
                        <div className={'card-modal__body__side-panel__comparison'}>
                            <Comparison comparison={this.props.subtitle}/>
                        </div>
                        {this.renderRelated()}
                    </div>
                    <div className={'card-modal__body__details col-xs-12 col-sm-8 col-md-8'}>
                        {this.renderQuestions()}
                        {this.renderExamples()}
                        {this.renderGameExample()}
                        {/*{this.renderRelated()}*/}
                    </div>
                </Modal.Body>

                <button onClick={this.props.onNext} className='previous-next-button previous-next-button--next fas fa-arrow-circle-right'></button>
                <button onClick={this.props.onPrev} className='previous-next-button previous-next-button--prev fas fa-arrow-circle-left'></button>
            </Modal>
        );
    }
}

CardModal.propTypes = {
    show: PropTypes.any,
    onClose: PropTypes.any,
    onNext: PropTypes.any,
    onPrev: PropTypes.any,
    onOpenRelated: PropTypes.any,
    id: PropTypes.any,
    categoryId: PropTypes.any,
    categoryName: PropTypes.any,
    categoryColor: PropTypes.any,
    principle: PropTypes.any,
    subtitle: PropTypes.any,
    questions: PropTypes.any,
    description: PropTypes.any,
    examples: PropTypes.any,
    exampleGame: PropTypes.any,
    exampleGameUrl: PropTypes.any,
    exampleGameDesc: PropTypes.any,
    related: PropTypes.any,
    cited: PropTypes.any
};

export default CardModal;