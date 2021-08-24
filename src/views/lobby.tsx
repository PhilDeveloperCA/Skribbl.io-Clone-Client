import React, {FC, useState, useRef, useEffect, Fragment} from "react";
import { useHistory, useParams } from "react-router";
import {apiClient, client} from '../client';
import {ErrorCodes, ActionCodes} from '../codes';
import {TextField, Card, Container, makeStyles, Grid, Button, Typography, Select, MenuItem, FormControl, InputLabel} from '@material-ui/core'; 
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

const styles = makeStyles((theme) => {
    
})

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

        return client.send(JSON.stringify({type:"leave"}));
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
                setPlayers([...players, data.player.name]);
                break;
            }
            case ActionCodes.PlayerLeft: {
                const newPlayers = players.filter((v) => v !== data.player.name);
                setSettings({...gameSettings, admin:data.admin});
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

    const playerTable = players.map((player) => {
        <div key={player}>
            <Typography variant="h4"> {player} </Typography>
        </div>
    })

    return(
        <Fragment>
            <Grid>
                <Grid item> </Grid> {/* Put Players In The Game */}
                <Grid item> </Grid> {/* Put Players In The Game */}
            </Grid>
            {(name === gameSettings.admin && players.length>2)? <button> Play </button>:null}
            {players.map((player,index) => <li> {player} </li>)}
            rounds:{gameSettings.rounds}
            seconds Per Round : {gameSettings.seconds}
            <Button variant="contained" color="primary" disabled={name !== gameSettings.admin || players.length<3}> Play: </Button>
        </Fragment>
    )
}

export default Lobby;