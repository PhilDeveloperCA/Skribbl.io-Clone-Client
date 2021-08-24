import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {App as Canvas} from './views/game';
import {BrowserRouter as Router, Link, Switch, Route} from 'react-router-dom';
import Lobby from './views/lobby';
import Home from './views/home';
import Join from './views/join';
import Create from './views/create';

type size = {
    height: number,
    width: number,
}

const App:React.FC = () => {
    const [drawing, setDrawing] = useState<boolean>(false);
    const [size, setSize] = useState<size|undefined>();
    const [location, setLocation] = useState<size|undefined>();

    useEffect(()=> {
        setSize({width:window.innerWidth, height:window.innerHeight-60});
    }, [window.innerHeight, window.innerWidth])


    /*window.addEventListener('mousemove', (e) => {
        console.log(`x : ${e.clientX}, y : ${e.clientY}`);
    })*/

    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/join"> <Join /></Route>
                    <Route path="/create"> <Create /> </Route>
                    <Route path="/game/:gameid" > <Canvas /> </Route>
                    <Route path="/lobby/:gameid"> <Lobby /> </Route>
                    <Route path="/"> <Home /> </Route>
                </Switch>
            </div>
        </Router>
    );
}

ReactDOM.render(<App />, document.querySelector('#root'));