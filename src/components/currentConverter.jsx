import {Loader} from "./loader.jsx";
import React from "react";

import Select from "react-select";

export class CurrentConverter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            selectedoption: null,
            userCurrency: "",
            targetCurrency: "",
            amount: "",
            display: {
                result: "none",
                amount: "",
                userCurrency: "",
                targetCurrency: ""
            }
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
                amount: Math.round(this.state.amount, 3),
                display: {
                    result: "block",
                    amount: this.state.amount,
                    userCurrency: this.state.userCurrency,
                    targetCurrency: this.state.targetCurrency
                },
            })
            fetch('https://api.exchangeratesapi.io/latest?base=' + this.state.userCurrency)
                .then(response => response.json())
                .then(data => this.setState({data}));
        }
        else {
            this.setState({
                communicate: "please fill all fields.",
                display: {
                    result: "none"
                },
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
            return (<div>
                    <section className="converter">
                        <div className="converter__container col-12 col-md-6 col-lg-3">
                            <p className={"converter__text"}>
                                I want to convert:
                            </p>
                            <input className={"converter__input"} type="text" placeholder={"Write amount here..."}
                                   value={this.state.amount} onChange={this.handleAmountChange}/>
                        </div>
                        <div className="converter__container col-12 col-md-6 col-lg-3">
                            <p className={"converter__text"}>
                                from:
                            </p>
                            <Select onChange={this.handleUserCurrencyChange} placeholder={"Your currency..."}
                                    className={"converter__select"} options={currencies}/>
                        </div>
                        <div className="converter__container col-12 col-md-6 col-lg-3">
                            <p className={"converter__text"}>
                                to:
                            </p>
                            <Select onChange={this.handleTargetCurrencyChange} placeholder={"Your currency..."}
                                    className={"converter__select"} options={currencies}/>
                        </div>
                        <div className="converter__container col-12 col-md-6 col-lg-3">
                            <button className="converter__submit" onClick={this.handleSubmit}></button>
                        </div>
                    </section>

                    <section className="results" style={{display: this.state.display.result}}>
                        <p className="results__amountFrom results__amount">
                            {this.state.display.amount} {this.state.display.userCurrency} =
                        </p>
                        <p className="results__amountTo results__amount">
                            {Math.round(this.state.data.rates[this.state.display.targetCurrency] * this.state.display.amount * 1000) / 1000}&nbsp;
                            {this.state.display.targetCurrency}
                        </p>
                        <p className="results__conversionFrom results__conversion">
                            1 {this.state.display.userCurrency} =&nbsp;
                            {Math.round(this.state.data.rates[this.state.display.targetCurrency] * 100000) / 100000} &nbsp;
                            {this.state.display.targetCurrency}
                        </p>
                        <p className="results__conversionTo results__conversion">
                            1 {this.state.display.targetCurrency} =&nbsp;
                            {Math.round(1 / this.state.data.rates[this.state.display.targetCurrency] * 100000) / 100000} &nbsp;
                            {this.state.display.userCurrency}
                        </p>
                        <p className="results__date">
                            Last update: {this.state.data.date}
                        </p>
                    </section>
                </div>
            )
        } else {
            return <Loader/>
        }
    }
}