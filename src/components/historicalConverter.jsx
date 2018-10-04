import {Loader} from "./loader.jsx";
import React from "react";

import Select from "react-select";

export class HistoricalConverter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            selectedoption: null,
            userCurrency: "",
            targetCurrency: "",
            date: "",
            display: {
                result: "block",
                date: "",
                userCurrency: "",
                targetCurrency: ""
            },
        }
    }

    componentDidMount() {
        fetch('https://api.exchangeratesapi.io/latest')
            .then(response => response.json())
            .then(data => this.setState({data}));
    }

    handleDateChange = (event) => {
        this.setState({
            date: event.target.value
        })
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

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.date && this.state.userCurrency && this.state.targetCurrency) {
            this.setState({
                display: {
                    result: "block",
                    date: this.state.date,
                    userCurrency: this.state.userCurrency,
                    targetCurrency: this.state.targetCurrency
                },
            })
            fetch('https://api.exchangeratesapi.io/' + this.state.date + '/?base=' + this.state.userCurrency)
                .then(response => response.json())
                .then(data => this.setState({data}));
        }
        else {
            this.setState({
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
                    <section className="historical">
                        <div className="historical__container col-12 col-md-6 col-lg-3">

                            <p className={"historical__text"}>
                                Date:
                            </p>
                            <input className={"converter__input"} type="date" placeholder={"Write date here..."}
                                   value={this.state.date} onChange={this.handleDateChange}/>
                        </div>
                        <div className="converter__container col-12 col-md-6 col-lg-3">
                            <p className={"historical__text"}>
                                from:
                            </p>
                            <Select onChange={this.handleUserCurrencyChange} placeholder={"Your currency..."}
                                    className={"converter__select"} options={currencies}/>
                        </div>
                        <div className="converter__container col-12 col-md-6 col-lg-3">
                            <p className={"historical__text"}>
                                to:
                            </p>
                            <Select onChange={this.handleTargetCurrencyChange} placeholder={"Target currency..."}
                                    className={"converter__select"} options={currencies}/>
                        </div>
                        <div className="converter__container col-12 col-md-6 col-lg-3">
                            <button className="converter__submit" onClick={this.handleSubmit}></button>
                        </div>
                    </section>
                    <section className="results" style={{display: this.state.display.result}}>
                        <p className="results__amountFrom results__amount">
                            {this.state.display.date}
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
                    </section>
                </div>
            )
        } else {
            return <Loader/>
        }
    }
}