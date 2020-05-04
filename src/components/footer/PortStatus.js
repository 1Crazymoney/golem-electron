import React, { useEffect, useState, useCallback } from 'react';
import { animated } from 'react-spring/renderprops.cjs';
import useStateWithCallback from '../../utils/stateWithCallback';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from './../../actions';
import { getStatus } from './../../reducers';

const { ipcRenderer } = window.electron;

function golemDotClass({ status, opened }) {
	if (status === 'checking') return 'yellow';
	else if (opened) return 'green';
	else return 'red';
}

const PortStatus = ({
	opacity,
	position,
	networkInfo,
	setPortInfo,
	skipChecker,
	transform
}) => {
	const [portList, setPortList] = useStateWithCallback([]);
	const [, updateState] = useState();
	const forceUpdate = useCallback(() => updateState({}), []);

	useEffect(() => {
		setPortInfo();
	}, []);

	useEffect(() => {
		const { port_statuses, pub_addr } = networkInfo;
		let skipTimer, delayTimer;
		if (pub_addr) {
			const _portList = Object.keys(port_statuses).map(port => [
				port,
				{ status: 'checking', opened: false }
			]);
			setPortList(_portList, checkPorts);

			function checkPorts(value) {
				delayTimer = setTimeout(() => {
					ipcRenderer.send('check-port', pub_addr, Object.keys(port_statuses));
					ipcRenderer.on('check-port-answer', (event, port, result) => {
						const index = value.findIndex(item => item[0] == port);
						if (index > -1) {
							value[index][1] = result;
							setPortList(value);
							forceUpdate();
						}
					});
					skipTimer = setTimeout(skipChecker, 3000);
				}, 1000);
			}
		}
		return () => {
			skipTimer && clearTimeout(skipTimer);
			delayTimer && clearTimeout(delayTimer);
		};
	}, [networkInfo]);

	return (
		<animated.div
			style={{
				opacity: opacity.interpolate(opacity => opacity),
				transform: transform.interpolate(y => `translateX(${y}px)`),
				position: position
			}}
			className="status-node__loading">
			<div className="status__components">
				{portList.map((port, index) => (
					<div className="item__status" key={index.toString()}>
						<div>
							<span
								className={`component-dot component-dot--${golemDotClass(
									port[1]
								)}`}
							/>
							<span>{port[0]}: </span>
						</div>
						<span className="port-status">{port[1]?.status}</span>
					</div>
				))}
			</div>
		</animated.div>
	);
};

PortStatus.displayName = 'PortStatus';

const mapStateToProps = state => ({
	networkInfo: state.info.networkInfo
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(Actions, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PortStatus);
