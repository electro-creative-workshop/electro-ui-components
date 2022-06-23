import React from 'react';

import './index.scss';

const Articles = props => {
	const baseClass = 'electro-flow-articles';

    return (
		<div className={baseClass}>
			{props.posts.map(entry =>
				<div className={`${baseClass}__post`}>
				    <a href={entry.url}>
					    <picture className={`${baseClass}__image`}>
						    <img src={entry.image} alt="" />
					    </picture>

					    <span className={`${baseClass}__title`}>{entry.title}</span>
				    </a>
			    </div>
			)}
		</div>
    );
}

export default Articles;