import enCommon from './en/common.json';
import enEditor from './en/editor.json';
import enGuides from './en/guides.json';
import enGuidesUi from './en/guidesUi.json';
import enNewPlayerGuide from './en/newPlayerGuide.json';
import enSeo from './en/seo.json';
import enToolAbout from './en/toolAbout.json';
import enTools from './en/tools.json';
import esCommon from './es/common.json';
import esEditor from './es/editor.json';
import esGuides from './es/guides.json';
import esGuidesUi from './es/guidesUi.json';
import esNewPlayerGuide from './es/newPlayerGuide.json';
import esSeo from './es/seo.json';
import esToolAbout from './es/toolAbout.json';
import esTools from './es/tools.json';
import deCommon from './de/common.json';
import deEditor from './de/editor.json';
import deGuides from './de/guides.json';
import deGuidesUi from './de/guidesUi.json';
import deNewPlayerGuide from './de/newPlayerGuide.json';
import deSeo from './de/seo.json';
import deToolAbout from './de/toolAbout.json';
import deTools from './de/tools.json';

/*
 * One JSON file per area of the site, so each can be translated on its own.
 * English is the source of truth: typing each locale as `typeof en` makes a
 * missing translation a type error, and `lib/messages.test.ts` also catches extra keys
 * and mismatched `{placeholders}`.
 */
const en = {
	common: enCommon,
	editor: enEditor,
	tools: enTools,
	toolAbout: enToolAbout,
	guides: enGuides,
	guidesUi: enGuidesUi,
	newPlayerGuide: enNewPlayerGuide,
	seo: enSeo
};

const es: typeof en = {
	common: esCommon,
	editor: esEditor,
	tools: esTools,
	toolAbout: esToolAbout,
	guides: esGuides,
	guidesUi: esGuidesUi,
	newPlayerGuide: esNewPlayerGuide,
	seo: esSeo
};

const de: typeof en = {
	common: deCommon,
	editor: deEditor,
	tools: deTools,
	toolAbout: deToolAbout,
	guides: deGuides,
	guidesUi: deGuidesUi,
	newPlayerGuide: deNewPlayerGuide,
	seo: deSeo
};

export const messages = { en, es, de };

/**
 * Namespaces client components read. Only these are serialised into the page
 * for `NextIntlClientProvider`; guide prose, tool write-ups and SEO text render
 * on the server and never ship to the browser.
 */
export const clientNamespaces = [
	'common',
	'editor',
	'tools',
	'guidesUi'
] as const satisfies readonly (keyof typeof en)[];
