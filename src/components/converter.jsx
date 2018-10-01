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
            amount: 0,
            displayResult: "none"
        }
    }

    componentDidMount() {
        fetch('https://api.exchangeratesapi.io/latest?base=PLN')
            .then(response => response.json())
            .then(data => this.setState({data}));
    }

    handleUserCurrencyChange = (selectedOption) => {
        console.log(selectedOption)
        this.setState({
            userCurrency: selectedOption.value
        })
    }

    handleTargetCurrencyChange = (selectedOption) => {
        this.setState({
            targetCurrency: selectedOption.value
        })
    }

    handleAmountChange = (event) => {
        this.setState({
            amount: event.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.userCurrency && this.state.targetCurrency && this.state.amount !== 0) {
            this.setState({
                communicate: "",
                displayResult: "block"
            })
            fetch('https://api.exchangeratesapi.io/latest?base=' + this.state.userCurrency)
                .then(response => response.json())
                .then(data => this.setState({data}));
        }
        else {
            this.setState({
                communicate: "please fill all fields."
            })
        }
    }

    render() {
        if (this.state.data) {
            const currenciesArr = [];
            for (let name in this.state.data.rates) {
                currenciesArr.push(name);
            }
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
                            <Select onChange={this.handleUserCurrencyChange}
                                    className={"converter__select"} options={currencies}/>
                        </div>
                        <div className="converter__container">
                            <p className={"converter__text"}>
                                to:
                            </p>
                            <Select onChange={this.handleTargetCurrencyChange}
                                    className={"converter__select"} options={currencies}/>
                        </div>
                        <button className="submit" onClick={this.handleSubmit}>{">"}</button>
                    </section>

                    <div className="results" style={{display: this.state.displayResult}}>
                        Conversion rate: 1 {this.state.userCurrency} =
                        {this.state.data.rates[this.state.targetCurrency]} {this.state.targetCurrency} <br/>
                        Amount: {this.state.data.rates[this.state.targetCurrency] * this.state.amount} <br/>
                        Last update: {this.state.data.date}
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
