import React from 'react';
import PropTypes from 'prop-types';
import { getCategoryColors } from '../utils/categoryColors';

function CategoryFilterButton(props) {
    const colors = getCategoryColors(props.color);
    const style = {
        '--cat-dark': colors.dark,
        '--cat-mid': colors.mid,
        '--cat-light': colors.light,
        '--cat-text': colors.text
    };

    return(
        <h2
            onClick={props.onPress}
            style={style}
            className={'category-filters__button ' + (props.active ? 'category-filters__button--active' : '')}
        >
            <i className={props.active ? 'fas fa-check-square' : 'far fa-square'}/>
            {props.name}
        </h2>
    );
}

CategoryFilterButton.propTypes= {
    name: PropTypes.string,
    color: PropTypes.string,
    onPress: PropTypes.any,
    active: PropTypes.any
};

export default CategoryFilterButton;
