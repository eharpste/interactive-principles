import React from 'react';
import PropTypes from 'prop-types';
import { CITATION_KINDS, emptyCitation } from '../../utils/citations';

function CitationsEditor(props) {
    const citations = props.citations || [];

    const update = (index, field, value) => {
        props.onChange(citations.map((c, i) => i === index ? { ...c, [field]: value } : c));
    };

    const remove = (index) => {
        props.onChange(citations.filter((c, i) => i !== index));
    };

    const add = () => {
        props.onChange([...citations, emptyCitation()]);
    };

    return (
        <div className={'admin-field admin-citations'}>
            <span>Citations</span>
            {citations.length === 0 &&
                <p className={'admin-citations__empty'}>No citations yet.</p>
            }
            {citations.map((citation, index) => (
                <div key={index} className={'admin-citations__row'}>
                    <select
                        value={citation.kind}
                        onChange={(e) => update(index, 'kind', e.target.value)}
                        aria-label={'Citation kind'}
                    >
                        {CITATION_KINDS.map(kind => (
                            <option key={kind.id} value={kind.id}>{kind.label}</option>
                        ))}
                    </select>
                    <input
                        type={'text'}
                        value={citation.label}
                        onChange={(e) => update(index, 'label', e.target.value)}
                        placeholder={'Label, e.g. Koedinger et al. (2013)'}
                        aria-label={'Citation label'}
                    />
                    <input
                        type={'url'}
                        value={citation.url}
                        onChange={(e) => update(index, 'url', e.target.value)}
                        placeholder={'https://doi.org/...'}
                        aria-label={'Citation link'}
                    />
                    <button type={'button'} className={'admin-delete-btn'} onClick={() => remove(index)} title={'Remove citation'}>
                        <i className={'fas fa-trash-alt'}/>
                    </button>
                </div>
            ))}
            <button type={'button'} className={'btn btn-link admin-citations__add'} onClick={add}>
                <i className={'fas fa-plus pull-left'}/> Add citation
            </button>
        </div>
    );
}

CitationsEditor.propTypes = {
    citations: PropTypes.array,
    onChange: PropTypes.func.isRequired
};

export default CitationsEditor;
