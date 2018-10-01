import React from 'react';
import ReactDOM from 'react-dom';

export class Converter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            userCurrency: []
        }
    }

    componentDidMount() {
        fetch('https://api.exchangeratesapi.io/latest?base=PLN')
            .then(response => response.json())
            .then(data => this.setState({data}));
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
                    <input type="text" placeholder={"Write amount here..."}/>
                    <select className={"addOperation__select"} name="currency">
                        <option className={"currency__choose"} value="choose">Choose</option>
                        {currencies}
                    </select>
                    <p>
                        to:
                    </p>
                    <select className={"addOperation__select"} name="currency">
                        <option className={"currency__choose"} value="choose">Choose</option>
                        <option className={"currency__choose"} value="all">All</option>
                        {currencies}
                    </select>
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
