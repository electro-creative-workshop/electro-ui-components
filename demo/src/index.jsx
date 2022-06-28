if (process.env.NODE_ENV === 'development') {
	require('preact/debug');
}

import React from 'react';
import { render } from 'react-dom';

import Flow from '../../src/flow';
import Modal from '../../src/modal';

import Articles from './blocks/articles';

document.getElementById('flow')
	.addEventListener('click', () => {
		const Demo = () => {
			return (
				<Modal
					id='coupons'
					modifierClass='-coupons'
					component={<Flow
						id='coupons'
						source='/api/flows/config.json'
						onSuccess={data => {
							console.log(data);
						}}
					/>}
				/>
			);
		};

		render(<Demo />, document.body.appendChild(document.createElement('div')));
	});

document.getElementById('component')
	.addEventListener('click', () => {
		render(<Modal
			component={<Articles posts={[
                {
                    url: 'https://www.clorox.com/learn/topics/laundry-tips/',
                    image: 'https://www.clorox.com/wp-content/uploads/2021/10/laundry-tips.jpg',
                    title: 'Tips for Doing Laundry Like a Pro'
                },
                {
                    url: 'https://www.clorox.com/learn/topics/how-to-disinfect/',
                    image: 'https://www.clorox.com/wp-content/uploads/2021/10/how-to-disinfect.jpg',
                    title: 'How to Disinfect Laundry, Surfaces, Fabrics, and More'
                }
            ]} />}
		/>, document.body.appendChild(document.createElement('div')));
	});

document.getElementById('video')
	.addEventListener('click', () => {
		render(<Modal
			video={{
				id: 'u4k3KEGgFDQ'
			}}
			modifierClass='-video'
		/>, document.body.appendChild(document.createElement('div')));
	});

document.getElementById('iframe')
	.addEventListener('click', () => {
		render(<Modal
			iframe={{
				url: 'frame.html'
			}}
			confirmClose={true}
			modifierClass='-iframe'
			translation={{
				cancel: 'No',
	            close: 'Cerrar modal',
	            confirm: 'Sí',
				prompt: '¿Estás segura de que quieres cerrar esto?'
	        }}
		/>, document.body.appendChild(document.createElement('div')));
	});

const params = new URLSearchParams(location.search);

render(
	<Flow
		id='demo'
		source='/api/flows/config.json'
		blocks={{
			articles: Articles
		}}
		values={{
			campaign: params.get('utm_campaign'),
			selection: 'wipes'
		}}
	/>,
	document.getElementById('demo')
);