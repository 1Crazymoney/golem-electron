import React from 'react';

import welcomeBeta from './../../../assets/img/welcome-beta.svg'

export default class Welcome extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding welcome-beta">
                   <img className="welcome-image" src={welcomeBeta}/>
                </div>
                <div className="desc__onboarding">
                    <span>Thanks for installing Brass Golem.
                    <br/>
                    Let’s set up a few things 
                    <br/>
                    for you before we start.</span>
                    <br/>
                    <br/>
                    <span className="desc__port"><mark><strong>Attention:</strong> Please make sure that your computer has public IP or forwarded ports 40102, 40103, 3282.
                    <br/><a href="https://github.com/golemfactory/golem/wiki/Testing#how-to-start-testing">More info</a>
                    </mark></span>
                </div>
            </div>
        );
    }
}