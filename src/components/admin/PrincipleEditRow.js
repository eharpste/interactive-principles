import React from 'react';
import PropTypes from 'prop-types';

const FIELD_DEFS = [
    { key: 'principle', label: 'Principle name', type: 'text' },
    { key: 'subtitle', label: 'Subtitle (comparison, e.g. "Do X > Do Y")', type: 'text' },
    { key: 'related', label: 'Related principle ids (comma-separated)', type: 'text' },
    { key: 'cited', label: 'Cited', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'questions', label: 'Questions to ask yourself (one per line)', type: 'textarea' },
    { key: 'examples', label: 'Examples (one per line, "X > Y" format)', type: 'textarea' },
    { key: 'exampleGame', label: 'Example game name', type: 'text' },
    { key: 'exampleGameUrl', label: 'Example game URL', type: 'text' },
    { key: 'exampleGameDesc', label: 'Example game description', type: 'textarea' }
];

function PrincipleEditRow(props) {
    const { principle, categories, expanded, onToggle, onChange, onDelete } = props;
    const category = categories.find(c => c.id === principle.categoryId);

    return (
        <div className={'admin-row admin-row--principle'}>
            <div className={'admin-row--principle__header'} onClick={() => onToggle(principle.id)}>
                <span className={'admin-row__id'}>{principle.id}</span>
                <span className={'admin-row--principle__title'}>{principle.principle || '(untitled)'}</span>
                <span className={'admin-row--principle__category'}>{category ? category.name : 'no category set'}</span>
                <i className={expanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'}/>
            </div>
            {expanded &&
                <div className={'admin-row--principle__body'}>
                    <label className={'admin-field'}>
                        <span>Category</span>
                        <select
                            value={principle.categoryId != null ? principle.categoryId : ''}
                            onChange={(e) => onChange(principle.id, 'categoryId', Number(e.target.value))}
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </label>
                    {FIELD_DEFS.map(field => (
                        <label className={'admin-field'} key={field.key}>
                            <span>{field.label}</span>
                            {field.type === 'textarea' ?
                                <textarea
                                    value={principle[field.key] || ''}
                                    onChange={(e) => onChange(principle.id, field.key, e.target.value)}
                                    rows={4}
                                />
                                :
                                <input
                                    type={'text'}
                                    value={principle[field.key] || ''}
                                    onChange={(e) => onChange(principle.id, field.key, e.target.value)}
                                />
                            }
                        </label>
                    ))}
                    <button type={'button'} className={'admin-delete-btn admin-delete-btn--full'} onClick={() => onDelete(principle.id)}>
                        <i className={'fas fa-trash-alt'}/> Delete this card
                    </button>
                </div>
            }
        </div>
    );
}

PrincipleEditRow.propTypes = {
    principle: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    expanded: PropTypes.bool,
    onToggle: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default PrincipleEditRow;
