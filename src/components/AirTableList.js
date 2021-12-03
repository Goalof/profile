import React, { useMemo } from 'react';
import { Box } from '@quarkly/widgets';
import { useOverrides } from '@quarkly/components';
import AirTableItem from './AirTableItem';
const overrides = {
	'Item': {
		kind: 'Box',
		props: {
			height: '300px',
			background: "--color-light",
			'box-shadow': "--xxl",
			display: "grid",
			'border-radius': '8px',
			padding: "25px 25px 25px 25px",
			margin: '20px 0 0 0'
		}
	}
};

const AirTableList = ({
	records,
	fieldsProp,
	...props
}) => {
	const {
		override,
		rest
	} = useOverrides(props, overrides);
	const recordsList = useMemo(() => records.map(({
		id,
		fields
	}) => <AirTableItem
		key={`AirTableItem-${id}`}
		{...override('Item', `Item ${id}`)}
		id={id}
		fields={fields}
		fieldsProp={fieldsProp}
	/>), [records, override]);
	return <Box {...rest}>
		      
		{recordsList}
		    
	</Box>;
};

Object.assign(AirTableList, {
	overrides
});
export default AirTableList;