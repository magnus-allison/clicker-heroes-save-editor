'use client';

import { useTranslations } from 'next-intl';

import type { SimpleFieldConfig } from '@/lib/data/editor-config';
import { SaveDecodeError } from '@/lib/save-codec';
import type { ChangeText } from '@/lib/save-diff-labels';
import type { PathSegment, SelectOption } from '@/lib/save-utils';

type Values = Record<string, string | number>;

/**
 * Lookups in the `editor` namespace whose keys are built from save paths
 * (`fields.rubies`, `fieldOptions.newClanRaidClassId.2`). Those keys are not
 * literal types, so this is the one place they are checked at runtime instead:
 * a key the locale lacks falls back to the English text from the config.
 */
export const useEditorText = () => {
	const t = useTranslations('editor');
	const has = t.has as (key: string) => boolean;
	const translate = t as unknown as (key: string, values?: Values) => string;

	const resolve = ({ key, text, values }: ChangeText) => (key && has(key) ? translate(key, values) : text);

	const fieldKey = (path: readonly PathSegment[]) => path.join('.');

	/** The label of a save field, e.g. "Rubies" → "Rubíes". */
	const fieldLabel = (field: Pick<SimpleFieldConfig, 'label' | 'path'>) =>
		resolve({ key: `fields.${fieldKey(field.path)}`, text: field.label });

	/** A field's help tooltip, translated when the locale has one. */
	const fieldHelp = (field: Pick<SimpleFieldConfig, 'help' | 'path'>) =>
		field.help
			? {
					title: resolve({ key: `fieldHelp.${fieldKey(field.path)}.title`, text: field.help.title }),
					body: resolve({ key: `fieldHelp.${fieldKey(field.path)}.body`, text: field.help.body })
				}
			: undefined;

	/** A select field's options with translated labels; values are untouched. */
	const fieldOptions = (field: Pick<SimpleFieldConfig, 'options' | 'path'>): SelectOption[] | undefined =>
		field.options?.map((option) => ({
			...option,
			label: resolve({
				key: `fieldOptions.${fieldKey(field.path)}.${String(option.value)}`,
				text: option.label
			})
		}));

	/**
	 * A decode/encode failure as a toast. Decode errors are translated by code;
	 * anything else (a browser `SyntaxError`, say) keeps its own message.
	 */
	const errorMessage = (error: unknown, fallback: string) => {
		if (error instanceof SaveDecodeError) {
			return resolve({ key: `decodeErrors.${error.code}`, text: error.message, values: error.params });
		}

		return error instanceof Error ? error.message : fallback;
	};

	return { resolve, fieldLabel, fieldHelp, fieldOptions, errorMessage };
};
