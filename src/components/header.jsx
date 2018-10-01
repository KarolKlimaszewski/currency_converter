import React from 'react';

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <header className="header">
                <h1 className={"header__title"}>
                    Currency converter App
                </h1>
                <img className={"header__logo"} src={require("../../images/arrows-conversion.png")} alt="Currency converter logo"/>
            </header>
        );
    }
}