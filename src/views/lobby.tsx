import React, {FC, useState, useRef, useEffect, Fragment} from "react";
import { useHistory, useParams } from "react-router";
import {apiClient, client} from '../client';
import {ErrorCodes, ActionCodes} from '../codes';

type gameSettings = {
    seconds: number, 
    rounds : number,
    admin:string
}

const Lobby:FC = () => {
    const [players, setPlayers] = useState<string[]>([]);
    const [gameSettings, setSettings] = useState<gameSettings>({seconds:0, rounds:0, admin:""});
    const name = localStorage.getItem('Username');

    const {gameid} = useParams<{gameid:string}>();
    //const {gameid} = useParams<{gameid:string}>;

    useEffect(() => {
        // Get Game State Here -> Rest API???
        apiClient.get(`/game/${gameid}`)
        .then(res => {
            setPlayers(res.data.players);
            setSettings(res.data.game);
        })
    },[])

    client.onmessage = (message) => {
        const data = JSON.parse(message.data.toString());
        console.log(data);
        if(data.status === "Error"){
            switch(data.message){

            }
            return;
        }
        switch(data.status){
            case ActionCodes.PlayerJoined: {
                setPlayers([...players, data.payload.player]);
                break;
            }
            case ActionCodes.PlayerLeft: {
                const newPlayers = players.filter((v) => v !== data.payload.player);
                setPlayers(newPlayers);
                break;
            }
            case ActionCodes.GameStarted:{
                break;
            }   
            default : {

            }
        }
    }

    return(
        <Fragment>
            {(name === gameSettings.admin && players.length>2)? <button> Play </button>:null}
            {players.map((player,index) => <li> {player} </li>)}
            rounds:{gameSettings.rounds}
            seconds Per Round : {gameSettings.seconds}
        </Fragment>
    )
}

export default Lobby;