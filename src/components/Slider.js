import React from 'react';

const DEFAULT = "#9b9b9b"
const TRUST = "#37C481"
const WARN = "#FEC62E"
const DANGER = "#F65A23"
const DISABLED = "#CBCBCB"

export default class Slider extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultValue: props.value
        }
    }

    componentDidMount() {
        this._handleFillLower(this.props.disabled)
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.disabled !== this.props.disabled) {
            this._handleFillLower(nextProps.disabled)
        }
    }

    /**
     * [_handleFillLower handling colorful part of the input range while thumb dragged]
     */
    _handleFillLower(isDisabled) {
        let primaryColor = this.props.mainColor || TRUST
        let slider = document.getElementById(this.props.inputId)
        let indicator = document.getElementById(`${this.props.inputId}__indicator`)
        if(slider && indicator){       
                let val = slider.value
                let min = slider.getAttribute('min')
                let max = slider.getAttribute('max')
                var value = (val - min) / (max - min);
        
                let color;
                if (!isDisabled) {
                    if (this.props.warn)
                        color = (val < 75 && val > 0) ? primaryColor : (val >= 75 && val < 90) ? WARN : (val == 0 ? DEFAULT : DANGER);
                    else
                        color = primaryColor;
                        slider.style.cursor = "pointer";
                } else {
                    color = DISABLED;
                    slider.style.cursor = "not-allowed";
                }
        
                slider.style.background = color;
                slider.style.backgroundImage = [
                    '-webkit-gradient(',
                    'linear, ',
                    'left top, ',
                    'right top, ',
                    'color-stop(' + value + ', transparent), ',
                    'color-stop(' + value + ', #eff1f2)',
                    ')'
                ].join('');
        
                let appWidth = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;

                let sliderWidth = slider.innerWidth
                || slider.clientWidth;

                indicator.innerHTML = val;
                indicator.style.color = color;
                indicator.style.left = (val * ((sliderWidth - 32 )/(max)) + ((((appWidth - sliderWidth)/ 2) + 6))) + 'px';
        } 
    }

    /**
     * [_handleCallback func. sends slider value as callback]
     * @return {[type]} [description]
     */
    _handleCallback() {
        let slider = document.getElementById(this.props.inputId)
        let val = slider.value
        this.props.callback(val)
    }

    render() {
        const {iconLeft, iconRight, mainColor, min, max, step, disabled} = this.props
        const {defaultValue} = this.state
        return (
            <div>
        <div className="slider">
                    <span className={iconLeft}></span>
                    <input type="range" className="slider__resources" id={this.props.inputId} defaultValue={defaultValue} min={min || 0} max={max || 100} step={step || 1} list="steplist" onInput={this._handleFillLower.bind(this, disabled)} role="slider" aria-label="Machine's Resource" onMouseUp={::this._handleCallback} disabled={disabled}/>
                    <span className="slider-indicator__resources" id={`${this.props.inputId}__indicator`}/>
                    <span className={iconRight}/>
        </div>
      </div>
        );
    }
}
