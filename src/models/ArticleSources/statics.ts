import {
	ArticleHostnames,
	ArticleSourcesCollectionInterface,
	ArticleSourceIdentifier,
} from "./interface";
import url from "url";
import {
	mapArticleSourceIdentifierToArticleKeyRegex,
	mapHostToArticleSourceIdentifier,
} from "./utils";

/**
 *
 * Each article source should have a unique string
 * that identifies its webpage (e.g. __wiki__) in our system
 *
 * This function takes in an url (e.g. www.wikipedia.org) and maps
 * the url to an identifier if th url is valid
 *
 * Throw an error if the url is not valid
 *
 * @memberof module:models~ArticleSources
 * @param this for type decleration
 * @param URL valid url from a article source hostname
 * @returns {ArticleSourceIdentifier} the valid identifier
 */
export const getIdentifier = function (
	this: ArticleSourcesCollectionInterface,
	URL: string
): ArticleSourceIdentifier {
	// create a URL object
	const urlObject = new url.URL(URL);

	// extract hostname from url object
	const { hostname } = urlObject;

	// map the hostname to article source identifier
	const identifier: ArticleSourceIdentifier =
		mapHostToArticleSourceIdentifier[hostname as ArticleHostnames];

	// if the key is not present (invalid url) we throw an error
	if (!identifier)
		throw new Error(`No identifier found for hostname of url: ${URL}`);

	// return the identifier
	return identifier;
};

/**
 * Maps a URL from an article (that is based on a valid article source)
 * to a key that identifies an article based on that article source
 * @param this for type decleration
 * @param URL valid url for an article that belongs to a valid article source
 */
export const getArticleKey = function (
	this: ArticleSourcesCollectionInterface,
	URL: string
): string {
	// get the identifier for the articles source
	const identifier = this.getIdentifier(URL);

	// get the key extractor pattern for the article source's URLs

	// read the key from the article URL
	const pattern = mapArticleSourceIdentifierToArticleKeyRegex[identifier];
	const regex = RegExp(pattern, "g");
	const key = regex.exec(URL);

	// throw error if no key found (invalid URL)
	if (!key) throw new Error(`Unable to find article key in url ${URL}`);

	// return the first result from the regex search
	return key[0];
};
