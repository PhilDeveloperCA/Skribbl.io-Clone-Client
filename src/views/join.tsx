import React, {FC, useState, useRef, useEffect, Fragment} from "react";
import { useHistory } from "react-router";
import {client} from '../client';
import {ErrorCodes} from '../codes';

type JoinDetails = {
    username : string,
    game : string,
}

const Join:FC = () => {
    const JoinSubmission = useRef<JoinDetails>({username:"", game:""});
    const [error, setError] = useState<null|string>(null);

    const history = useHistory();

    client.onmessage = (message) => {
        const data = JSON.parse(message.data.toString());
        if(data.status === "Error"){
            if(data.code === ErrorCodes.GameDNE){
                setError("Game ID Is Not Valid")
            }
            if(data.code === ErrorCodes.GameFull){
                setError("")
            }
            if(data.code === ErrorCodes.InvalidJoin){
                setError("Missing Fields");
            }
            if(data.code === ErrorCodes.NameTaken){
                setError("Username Taken");
            }
            if(data.code === ErrorCodes.SystemError){
                setError("System Failure. Try Again Later");
            }
        }
        if(data.status === "Success") {
            localStorage.setItem('Username', JoinSubmission.current.username);
            history.push(`/lobby/${JoinSubmission.current.game}`);
        }
    }

    const Submit = (e:any) => {
        e.preventDefault();
        if(!JoinSubmission.current.game || !JoinSubmission.current.username) {
            return setError("Set Valid Game and Username");
        }
        client.send(JSON.stringify({type:"join", payload:JoinSubmission.current}));
    }
    
    return(
        <Fragment>
            {error !== null? <h1> {error}</h1>:null}
            <h1> Name : </h1>
            <input onChange={(e) => {JoinSubmission.current.username = e.target.value}}/>
            <h1> Game Room: </h1>
            <input onChange={(e) => {JoinSubmission.current.game = e.target.value}}/>
            <button onClick={Submit}> Submit : </button>
            <h1> {error} </h1>
        </Fragment>
    )
}

export default Join;