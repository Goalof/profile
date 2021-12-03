import React, { useMemo } from 'react';
import { Box, Text, Link, Icon, Image } from '@quarkly/widgets';
import { useOverrides } from '@quarkly/components';
import ComponentNotice from './ComponentNotice';
const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
const overrides = {
	'Group': {
		kind: 'Box'
	},
	'Text': {
		kind: 'Text'
	},
	'Link': {
		kind: 'Link'
	},
	'Icon': {
		kind: 'Icon',
		props: {
			color: '--dark'
		}
	},
	'Icon :checked': {
		props: {}
	},
	'Icon :unchecked': {
		props: {}
	},
	'Image': {
		kind: 'Image',
		props: {
			'max-width': '100%',
			'max-height': '100%'
		}
	}
};

const getKey = ({
	id,
	key,
	index
}) => {
	return index ? `AirTableItem-${id}-${key}-${index}` : undefined;
};

const getOverride = (kind, override, {
	id,
	key,
	value,
	index
}) => {
	if (kind === 'Icon') {
		return override(kind, `${kind} ${key}`, `${kind} ${key} ${value ? ':checked' : ':unchecked'}`, index && `${kind} ${key} ${index}`, index && `${kind} ${key} ${index} ${value ? ':checked' : ':unchecked'}`, `${kind} ${key} -${id}`, `${kind} ${key} -${id} ${value ? ':checked' : ':unchecked'}`, index && `${kind} ${key} ${index} -${id}`, index && `${kind} ${key} ${index} -${id} ${value ? ':checked' : ':unchecked'}`);
	} else {
		return override(kind, `${kind} ${key}`, index && `${kind} ${key} ${index}`, `${kind} ${key} -${id}`, index && `${kind} ${key} ${index} -${id}`);
	}
};

const getFieldValue = (id, [key, value, index], override) => {
	switch (typeof value) {
		case 'string':
			if (urlRegex.test(value)) {
				return <Link key={getKey({
					id,
					key,
					index
				})} href={value} {...getOverride('Link', override, {
					id,
					key,
					index
				})}>
					          
					{value}
					        
				</Link>;
			} else {
				const textOverrides = getOverride('Text', override, {
					id,
					key,
					index
				});
				return <Text key={getKey({
					id,
					key,
					index
				})} {...textOverrides}>
					          
					{textOverrides.children ?? value}
					        
				</Text>;
			}

		case 'number':
			{
				const textOverrides = getOverride('Text', override, {
					id,
					key,
					index
				});
				return <Text key={getKey({
					id,
					key,
					index
				})} {...textOverrides}>
					        
					{textOverrides.children ?? value}
					      
				</Text>;
			}

		case 'boolean':
			{
				return <Icon key={getKey({
					id,
					key,
					index
				})} {...getOverride('Icon', override, {
					id,
					key,
					value,
					index
				})} />;
			}

		case 'object':
			{
				return <Image key={getKey({
					id,
					key,
					index
				})} src={value.url} {...getOverride('Image', override, {
					id,
					key,
					index
				})} />;
			}

		default:
			return <ComponentNotice message="Type the name of the field" />;
	}
};

const getField = (id, [key, value], override) => {
	if (Array.isArray(value)) {
		const child = value.map((val, index) => getFieldValue(id, [key, val, index], override));
		return <Box {...override('Group', `Group ${key}`, `Group ${key} #${id}`)}>
			        
			{child}
			      
		</Box>;
	} else {
		return getFieldValue(id, [key, value], override);
	}
};

const AirTableItem = ({
	id,
	fields,
	fieldsProp,
	...props
}) => {
	const {
		override,
		rest
	} = useOverrides(props, overrides);
	const fieldsList = useMemo(() => {
		if (fieldsProp !== '') {
			return fieldsProp.split(',').filter(field => field in fields).map(field => getField(id, [field, fields[field]], override));
		}

		return Object.entries(fields).map(field => getField(id, field, override));
	}, [fields, override]);
	return <Box {...rest}>
		      
		{fieldsList}
		    
	</Box>;
};

Object.assign(AirTableItem, {
	overrides
});
export default AirTableItem;