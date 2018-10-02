import React from 'react';
import ReactDOM from 'react-dom';
import {Header} from "./header.jsx";

import Select from "react-select";

export class Converter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            selectedoption: null,
            userCurrency: "",
            targetCurrency: "",
            amount: "",
            displayResult: "block"
        }
    }

    componentDidMount() {
        fetch('https://api.exchangeratesapi.io/latest?base=PLN')
            .then(response => response.json())
            .then(data => this.setState({data}));
    }

    handleUserCurrencyChange = (e) => {
        this.setState({
            userCurrency: e.value,
        })
    }

    handleTargetCurrencyChange = (e) => {
        this.setState({
            targetCurrency: e.value,
        })
    }

    handleAmountChange = (event) => {
        const numbers = /^-?(\d+\.?\d*)$|(\d*\.?\d+)$/;
        if (event.target.value.match(numbers)) {
            this.setState({
                amount: event.target.value
            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.userCurrency && this.state.targetCurrency && this.state.amount) {
            this.setState({
                communicate: "",
                displayResult: "block",
                amount: Math.round(this.state.amount, 3),

            })
            fetch('https://api.exchangeratesapi.io/latest?base=' + this.state.userCurrency)
                .then(response => response.json())
                .then(data => this.setState({data}));
        }
        else {
            this.setState({
                communicate: "please fill all fields.",
                displayResult: "none"
            })
        }
    }

    render() {
        if (this.state.data) {
            const currenciesArr = [];
            for (let name in this.state.data.rates) {
                currenciesArr.push(name);
            }
            //return object is because of fact, that app is using react-select query, which needs objects looking like this to work.
            let currencies = currenciesArr.map((el, i) => {
                return {'value': el, 'label': el}
            })
            return (
                <div className={"container"}>
                    <Header/>
                    <section className="converter">
                        <div className="converter__container">
                            <p className={"converter__text"}>
                                I want to convert:
                            </p>
                            <input className={"converter__input"} type="text" placeholder={"Write amount here..."}
                                   value={this.state.amount} onChange={this.handleAmountChange}/>
                            <Select onChange={this.handleUserCurrencyChange} placeholder={"Your currency..."}
                                    className={"converter__select"} options={currencies}/>
                        </div>
                        <div className="converter__container">
                            <p className={"converter__text"}>
                                to:
                            </p>
                            <Select onChange={this.handleTargetCurrencyChange} placeholder={"Your currency..."}
                                    className={"converter__select"} options={currencies}/>
                        </div>
                        <button className="converter__submit" onClick={this.handleSubmit}>{">"}</button>
                    </section>

                    <div className="results" style={{display: this.state.displayResult}}>
                        <p className="results__amountFrom">
                            {this.state.amount} {this.state.userCurrency} =
                        </p>
                        <p className="results__conversion">
                            1 {this.state.userCurrency} =
                            {this.state.data.rates[this.state.targetCurrency]} {this.state.targetCurrency}
                        </p>
                        <p className="results__amount">
                            Amount: {this.state.data.rates[this.state.targetCurrency] * this.state.amount}
                        </p>
                        <p className="results__date">
                            Last update: {this.state.data.date}
                        </p>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    loading...
                </div>
            )
        }
    }
}
