import { sendHttpRequest } from './util.js';

const URL =
	'https://gist.githubusercontent.com/al3xback/f6a782b9b978ea5880a6b67ada27e265/raw/1ef60c12f16b1c63bd38afd49a1a251da8c45f6a/four-card-data.xml';

const sectionWrapperEl = document.querySelector('.section-wrapper');
const sectionTemplate = document.getElementById('section-template');
const sectionHeadTemplate = document.getElementById('section-head-template');
const cardTemplate = document.getElementById('card-template');
const sectionBodyTemplate = document.getElementById('section-body-template');
const loadingEl = document.querySelector('.loading');

const removeLoading = () => {
	loadingEl.parentElement.removeChild(loadingEl);
};

const handleError = (msg) => {
	removeLoading();

	const errorEl = document.createElement('p');
	errorEl.className = 'error';
	errorEl.textContent = msg;

	sectionWrapperEl.appendChild(errorEl);
};

const renderCardsContent = (data) => {
	const parser = new DOMParser();
	const dataDoc = parser.parseFromString(data, 'text/xml');

	const getElementValue = (parentEl, name) => {
		const element = parentEl.getElementsByTagName(name)[0];
		const hasChildren = !!element.children.length;
		if (hasChildren) {
			return [...element.children].map(
				(item) => item.childNodes[0].nodeValue
			);
		}
		return element.childNodes[0].nodeValue;
	};

	const cardsSummaryData = dataDoc.getElementsByTagName('summary')[0];
	const cardsListData = dataDoc.getElementsByTagName('list')[0].children;

	const cardsSummaryTitle = getElementValue(cardsSummaryData, 'title');
	const cardsSummarySubtitle = getElementValue(cardsSummaryData, 'subtitle');
	const cardsSummaryDescription = getElementValue(
		cardsSummaryData,
		'description'
	);

	const sectionTemplateNode = document.importNode(
		sectionTemplate.content,
		true
	);
	const sectionEl = sectionTemplateNode.querySelector('.section');

	/* [section head] */
	const sectionHeadTemplateNode = document.importNode(
		sectionHeadTemplate.content,
		true
	);
	const sectionHeadEl =
		sectionHeadTemplateNode.querySelector('.section__head');

	const cardsSummaryTitleEl = sectionHeadEl.querySelector(
		'.cards-summary__title'
	);
	cardsSummaryTitleEl.textContent = cardsSummaryTitle;

	const cardsSummarySubtitleEl = sectionHeadEl.querySelector(
		'.cards-summary__subtitle strong'
	);
	cardsSummarySubtitleEl.textContent = cardsSummarySubtitle;

	const cardsSummaryDescriptionEl = sectionHeadEl.querySelector(
		'.cards-summary__desc'
	);
	cardsSummaryDescriptionEl.textContent = cardsSummaryDescription;

	/* [section body] */
	const sectionBodyTemplateNode = document.importNode(
		sectionBodyTemplate.content,
		true
	);
	const sectionBodyEl =
		sectionBodyTemplateNode.querySelector('.section__body');

	const cardBlockEls = sectionBodyEl.querySelectorAll('.cards__block');

	let cardIndex = 0;
	for (const card of cardsListData) {
		const title = getElementValue(card, 'title');
		const description = getElementValue(card, 'description');
		const image = getElementValue(card, 'image');

		const cardTemplateNode = document.importNode(
			cardTemplate.content,
			true
		);
		const cardEl = cardTemplateNode.querySelector('.card');
		cardEl.classList.add('card--' + title.toLowerCase().replace(' ', '-'));

		const cardTitleEl = cardEl.querySelector('.card__title');
		cardTitleEl.textContent = title;

		const cardDescriptionEl = cardEl.querySelector('.card__desc');
		cardDescriptionEl.textContent = description;

		const cardImage = cardEl.querySelector('.card__image img');
		cardImage.src = './images/icons/' + image;
		cardImage.alt = '';

		if (cardIndex === 0) {
			cardBlockEls[0].appendChild(cardTemplateNode);
		} else if (cardIndex === 1 || cardIndex === 2) {
			cardBlockEls[1].appendChild(cardTemplateNode);
		} else {
			cardBlockEls[2].appendChild(cardTemplateNode);
		}

		cardIndex++;
	}

	/* [init] */
	removeLoading();
	sectionEl.appendChild(sectionHeadTemplateNode);
	sectionEl.appendChild(sectionBodyTemplateNode);
	sectionWrapperEl.appendChild(sectionTemplateNode);
};

sendHttpRequest('GET', URL, renderCardsContent, handleError);
