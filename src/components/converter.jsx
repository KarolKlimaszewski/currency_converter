import React from 'react';
import ReactDOM from 'react-dom';

export class Converter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            userCurrency: "choose",
            targetCurrency: "choose",
            amount: 0,
            displayResult: "none"
        }
    }

    componentDidMount() {
        fetch('https://api.exchangeratesapi.io/latest?base=PLN')
            .then(response => response.json())
            .then(data => this.setState({data}));
    }

    handleUserCurrencyChange = (event) => {
        this.setState({
            userCurrency: event.target.value
        })
    }

    handleTargetCurrencyChange = (event) => {
        this.setState({
            targetCurrency: event.target.value
        })
    }

    handleAmountChange = (event) => {
        this.setState({
            amount: event.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.userCurrency !== "choose" && this.state.targetCurrency !== "choose" && this.state.amount !== 0) {
        this.setState({
            communicate: "",
            displayResult: "block"
        })
            fetch('https://api.exchangeratesapi.io/latest?base='+this.state.userCurrency)
                .then(response => response.json())
                .then(data => this.setState({data}));
        }
        else{
            this.setState({
                communicate: "please fill all fields."
            })
        }
    }

    render() {
        if (this.state.data) {
            const currenciesArr = [];
            for(let name in this.state.data.rates){
                currenciesArr.push(name);
            }
            let currencies = currenciesArr.map((el, i) => {
                return <option key={i} className={"currency__choose"} value={el}>{el}</option>
            })


            return (
                <div>
                    <p>
                        I want to convert
                    </p>
                    <input type="text" placeholder={"Write amount here..."} value={this.state.amount} onChange={this.handleAmountChange}/>
                    <select className={"addOperation__select"} name="currency" onChange={this.handleUserCurrencyChange}>
                        <option className={"currency__choose"} value="choose">Choose</option>
                        {currencies}
                    </select>
                    <p>
                        to:
                    </p>
                    <select className={"addOperation__select"} name="currency" onChange={this.handleTargetCurrencyChange}>
                        <option className={"currency__choose"} value="choose">Choose</option>
                        <option className={"currency__choose"} value="all">All</option>
                        {currencies}
                    </select>
                    <button className="submit" onClick={this.handleSubmit}>{">"}</button>

                    <div className="results" style={{display: this.state.displayResult}}>
                        Conversion rate: 1 {this.state.userCurrency} =
                        {this.state.data.rates[this.state.targetCurrency]} {this.state.targetCurrency} <br/>
                        Amount: {this.state.data.rates[this.state.targetCurrency] * this.state.amount}
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
