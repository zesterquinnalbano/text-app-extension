import React, { useEffect } from 'react';
import { Input, Form, Icon } from 'antd';
import { useInput } from '../../states';

/*
 * props.name: name of the input component
 * props.validationRules: rules for input component
 * props.icon(optional): prefix icon
 * props.placeholder: placeholder of the input component
 * props.type: type of input component e.g: text, password
 */
function AppInput(props) {
	const { getFieldDecorator } = props.form;
	const data = useInput(null);

	// send the update value to the parent
	function handleValueChange() {
		props.inputData(data.value);
	}

	useEffect(() => {
		handleValueChange();
	}, [data]);

	return (
		<Form.Item className={'lnx-form-group'}>
			{getFieldDecorator(props.name, {
				rules: [props.validationRules]
			})(
				<Input
					prefix={props.icon ? <Icon type={props.icon} className="icon" /> : ''}
					className="form-input"
					placeholder={props.placeholder}
					{...data}
					type={props.type}
				/>
			)}
		</Form.Item>
	);
}

export default Form.create({ name: 'app-input' })(AppInput);
