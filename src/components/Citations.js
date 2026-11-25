import React from 'react';
import PropTypes from 'prop-types';
import { groupCitations } from '../utils/citations';

function Citations(props) {
    const groups = groupCitations(props.citations || []);

    if (groups.length === 0) {
        return null;
    }

    return (
        <div className={'citations'}>
            <h3>Sources</h3>
            {groups.map(group => (
                <div key={group.id} className={'citations__group'}>
                    <h4 className={'citations__kind'}>{group.label}</h4>
                    <ul className={'citations__list'}>
                        {group.items.map((citation, index) => (
                            <li key={index} className={'citations__item'}>
                                {citation.url ?
                                    <a href={citation.url} target={'_blank'} rel={'noopener noreferrer'}
                                        onClick={() => props.onOpen && props.onOpen(citation)}>
                                        {citation.label}
                                        <i className={'fas fa-external-link-alt citations__link-icon'}/>
                                    </a>
                                    :
                                    citation.label
                                }
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

Citations.propTypes = {
    citations: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        url: PropTypes.string,
        kind: PropTypes.string
    })),
    onOpen: PropTypes.func
};

export default Citations;
