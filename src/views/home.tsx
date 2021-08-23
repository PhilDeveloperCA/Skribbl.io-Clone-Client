import React, {useState, FC, useEffect, useRef, Fragment} from 'react';
import {useHistory} from 'react-router-dom';
import {client} from '../client';

const Home :FC = () => {
    const history = useHistory();

    return(
        <div>
            <button onClick={(e) => {e.preventDefault(); history.push('/join')}}> Join Game ? </button>
            <button onClick={(e) => {e.preventDefault(); history.push('/create')}}> Create Game? </button>
        </div>
    );

    /*useEffect(() => {
        client.onopen = () => {}
        client.onmessage=((message) => {
            // @ts-ignore
            const response = JSON.parse(message.data);
            if(response.error){
                return setError(response.error);
            }
            history.push(`/lobby`);
        })
    },[])*/
    
    /*const joinGame = (e:any) => {
        e.preventDefault();
        client.send(JSON.stringify({method:'join', room:game.current}));
    }*/

    /*const createGame = (e:any) => {
        console.log('ARE U FUCKING CREATING OR NOT');
        e.preventDefault();
        client.send(JSON.stringify({method:'create'}));
    }*/

    /*return(
        <Fragment>
            <button onClick={createGame}> Create Private Game :  </button>
            <input onChange={(e) => game.current = e.target.value}/>
            <button onClick={joinGame}> Join Game : </button>
        </Fragment>
    )*/
}

export default Home;