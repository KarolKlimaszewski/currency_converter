import React from 'react';
import {Header} from "./header.jsx";
import {Loader} from "./loader.jsx";
import {CurrentConverter} from "./currentConverter.jsx";
import {HistoricalConverter} from "./historicalConverter.jsx";

export class Converter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: ""
        }
    }

    componentDidMount() {
        fetch('https://api.exchangeratesapi.io/latest?base=PLN')
            .then(response => response.json())
            .then(data => this.setState({data}));
    }

    render() {
        if (this.state.data) {
            return (
                <div className={"container"}>
                    <Header/>
                    <h2 className="converter__title">
                        Current conversion rates
                    </h2>
                    <CurrentConverter/>
                    <h2 className="historical__title">
                        Historical conversion rates
                    </h2>
                    <HistoricalConverter/>
                </div>
            )
        } else {
            return <Loader/>
        }
    }
}
