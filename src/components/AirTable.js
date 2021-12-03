import React, { useState, useEffect, useReducer } from 'react';
import { Box, Text } from '@quarkly/widgets';
import { useOverrides } from '@quarkly/components';
import ComponentNotice from './ComponentNotice';
import AirTableList from './AirTableList';
/*  GET DATA  */

const getOptionFields = fields => {
	return fields.split(',').filter(field => field.trim()).reduce((res, field) => {
		return `${res}&fields[]=${field.trim()}`;
	}, '');
};

const getOptionSort = sort => {
	const fields = sort.fields.split(',').reverse();
	const directions = sort.directions.split(',').reverse();
	return fields.filter(field => field).reduce((res, _, index) => {
		const field = `sort[${index}][field]=${fields[index]}`;
		const direction = `sort[${index}][direction]=${directions[index] || directions[directions.length - 1]}`;
		return `${res}&${field}&${direction}`;
	}, '');
};

const getOption = (opt, key) => {
	let option;

	switch (key) {
		case 'fields':
			option = getOptionFields(opt);
			break;

		case 'sort':
			option = getOptionSort(opt);
			break;

		default:
			option = `&${key}=${opt}`;
	}

	return option;
};

const getData = ({
	apiKey,
	base,
	table,
	options,
	onRecords,
	onError
}) => {
	const query = Object.keys(options).reduce((res, key) => {
		const option = getOption(options[key], key);
		return options[key] ? `${res}${option}` : res;
	}, `api_key=${apiKey}`);
	const url = `https://api.airtable.com/v0/${base}/${table}?${query}`;
	fetch(encodeURI(url)).then(res => res.json()).then(({
		records,
		error
	}) => {
		if (error) {
			onError(error);
			return;
		}

		onRecords(records);
	});
};
/*                useDebounce              */


const useDebounce = (value, timeout) => {
	const [state, setState] = useState(value);
	useEffect(() => {
		const handler = setTimeout(() => setState(value), timeout);
		return () => clearTimeout(handler);
	}, [value, timeout]);
	return state;
};
/*                REDUCER                 */


const initialState = {
	components: [],
	records: [],
	error: '',
	isLoading: true
};

function reducer(state, action) {
	switch (action.type) {
		case 'SET_COMPONENTS':
			return { ...state,
				components: action.components,
				error: null,
				isLoading: false
			};

		case 'SET_RECORDS':
			return { ...state,
				records: action.records,
				error: null,
				isLoading: false
			};

		case 'SET_ERROR':
			return { ...state,
				error: action.error,
				isLoading: false
			};

		default:
			return state;
	}
}

;
/*                OVERRIDES                 */

const overrides = {
	'Item': {
		kind: 'Box'
	},
	'Image': {
		kind: 'Image',
		props: {
			height: '100%'
		}
	},
	'List': {
		kind: 'Box',
		props: {
			padding: "25px 25px 25px 25px"
		}
	},
	'Loading': {
		kind: 'Box',
		props: {
			children: <Text font-size="20px">
				Loading...
			</Text>
		}
	}
};
/*                 PROPS INFO                 */

const propInfo = {
	apiKey: {
		title: 'API Key',
		control: 'input',
		type: 'text',
		category: 'Data',
		weight: 1
	},
	base: {
		title: 'Base ID',
		control: 'input',
		type: 'text',
		category: 'Data',
		weight: 1
	},
	table: {
		title: 'Table name',
		control: 'input',
		type: 'text',
		category: 'Data',
		weight: 1
	},
	view: {
		title: 'View name',
		control: 'input',
		type: 'text',
		category: 'Data',
		weight: 1
	},
	fields: {
		title: 'Показывать только указанные поля',
		control: 'input',
		type: 'text',
		placeholder: 'e.g.: Name, Phone, Email',
		category: 'Others',
		weight: 1
	},
	filterByFormula: {
		title: 'Фильтровать указанные поля по формуле',
		control: 'input',
		type: 'text',
		placeholder: 'e.g.: {Name} = \'Client Name\'',
		category: 'Others',
		weight: 1
	},
	sortFields: {
		title: 'Сортировать по полю',
		control: 'input',
		type: 'text',
		placeholder: 'e.g.: Name',
		multiply: true,
		category: 'Others',
		weight: 1
	},
	sortDirections: {
		title: 'Направление сортировки',
		control: 'radio-group',
		variants: ['asc', 'desc'],
		multiply: true,
		category: 'Others',
		weight: 1
	},
	testShowLoading: {
		control: 'checkbox',
		category: 'Test'
	}
};
/* defaultProps */

const defaultProps = {
	apiKey: 'keyj12VU3ocppMncn',
	base: 'app952qvdkivUQy2p',
	table: 'Data',
	view: 'Grid view',
	fields: '',
	filterByFormula: '',
	sortFields: '',
	sortDirections: 'asc'
};
const timeout = 1000;

const AirTable = ({
	apiKey,
	base,
	table,
	view,
	fields,
	filterByFormula,
	sortFields,
	sortDirections,
	testShowLoading,
	...props
}) => {
	const {
		override,
		rest,
		ChildPlaceholder
	} = useOverrides(props, overrides);
	const [{
		records,
		isLoading,
		error
	}, dispatch] = useReducer(reducer, initialState);
	const apiKeyProp = useDebounce(apiKey, timeout);
	const baseProp = useDebounce(base, timeout);
	const tableProp = useDebounce(table, timeout);
	const viewProp = useDebounce(view, timeout);
	const fieldsProp = useDebounce(fields, timeout);
	const filterByFormulaProp = useDebounce(filterByFormula, timeout);
	const sortFieldsProp = useDebounce(sortFields, timeout);
	useEffect(() => {
		getData({
			apiKey: apiKeyProp,
			base: baseProp,
			table: tableProp,
			options: {
				view: viewProp,
				fields: fieldsProp,
				filterByFormula: filterByFormulaProp,
				sort: {
					fields: sortFieldsProp,
					directions: sortDirections
				}
			},
			onRecords: records => dispatch({
				type: 'SET_RECORDS',
				records
			}),
			onError: error => dispatch({
				type: 'SET_ERROR',
				error
			})
		});
	}, [apiKeyProp, baseProp, tableProp, viewProp, fieldsProp, filterByFormulaProp, sortFieldsProp, sortDirections]);
	return <Box {...rest}>
		      
		{!isLoading && !error && <AirTableList {...override('List')} records={records} fieldsProp={fieldsProp} />}
		      
		{(isLoading || testShowLoading) && <Box {...override('Loading')}>
			          
			<ChildPlaceholder slot="Loading" />
			        
		</Box>}
		      
		{error && <ComponentNotice message={error.message} />}
		    
	</Box>;
};

Object.assign(AirTable, {
	overrides,
	propInfo,
	defaultProps
});
export default AirTable;