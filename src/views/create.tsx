import React, {FC, useState, useRef, useEffect, Fragment} from "react";
import { useHistory } from "react-router";
import {client} from '../client';
import {ErrorCodes, ActionCodes} from '../codes';

type CreateDetails = {
    name : string,
    rounds : number,
    seconds : number,
}

type ErrorState = {
    name : string|null,
    rounds : string|null,
    seconds : string|null,
}

const Create:FC = () => {
    const CreateSubmission = useRef<CreateDetails>({name:"", rounds:5, seconds:60});
    const [error, setError] = useState<null|string>(null);

    const history = useHistory();

    client.onmessage = (message) => {
        const data = JSON.parse(message.data.toString());
        if(data.status === "Error"){
            if(data.code === ErrorCodes.InvalidCreate){
                setError("Missing Fields");
            }
            if(data.code === ErrorCodes.SystemError){
                setError("System Failure. Try Again Later");
            }
        }
        if(data.status === "Success") {
            localStorage.setItem('Username', CreateSubmission.current.name);
            history.push(`/lobby/${data.game.id}`);
        }
    }

    const Submit = (e:any) => {
        e.preventDefault();
        client.send(JSON.stringify({type:"create", payload:CreateSubmission.current}))
    }

    return(
        <Fragment>
            Your Username 
            <input onChange={(e) => {CreateSubmission.current.name = e.target.value}}/>
            Rounds 
            <input onChange={(e) => {CreateSubmission.current.seconds = parseInt(e.target.value)}}/>
            Seconds Per Round 
            <input onChange={(e) => {CreateSubmission.current.rounds = parseInt(e.target.value)}}/>
            {error !== null ? <h1> {error}</h1>:null}
            <button onClick={Submit}> Submit </button>
        </Fragment>
    )
}

export default Create;