import React from 'react';
import ReactDOM from 'react-dom';

require('./scss/main.scss');

import {Converter} from './components/converter.jsx';

class App extends React.Component {
   constructor(props){
     super(props);

   }
   render() {
     return (
     <Converter />
     )
   }
 }

document.addEventListener("DOMContentLoaded", function(){

  ReactDOM.render(
      <App />,
    document.querySelector('#app')
  )

})
