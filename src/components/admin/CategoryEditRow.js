import React from 'react';
import PropTypes from 'prop-types';

function CategoryEditRow(props) {
    const { category, onChange, onDelete } = props;

    return (
        <div className={'admin-row admin-row--category'}>
            <input
                type={'color'}
                value={category.color}
                onChange={(e) => onChange(category.id, 'color', e.target.value)}
                className={'admin-color-input'}
                aria-label={'Category color'}
            />
            <input
                type={'text'}
                value={category.name}
                onChange={(e) => onChange(category.id, 'name', e.target.value)}
                className={'admin-text-input admin-row--category__name'}
                placeholder={'Category name'}
            />
            <span className={'admin-row__id'}>id {category.id}</span>
            <button type={'button'} className={'admin-delete-btn'} onClick={() => onDelete(category.id)} title={'Delete category'}>
                <i className={'fas fa-trash-alt'}/>
            </button>
        </div>
    );
}

CategoryEditRow.propTypes = {
    category: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default CategoryEditRow;
