import React, {FC, useState, useRef, useEffect, Fragment} from "react";
import { useHistory } from "react-router";
import {client} from '../client';
import {ErrorCodes, ActionCodes} from '../codes';
import {TextField, Card, Container, makeStyles, Grid, Button, Typography, Select, MenuItem, FormControl, InputLabel} from '@material-ui/core'; 

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
      maxWidth: 300,
      paddingTop:'40px',
      paddingBottom: '20px'
    },
    form : {
        display : 'flex',
        flexDirection : 'column',
        alignItems: 'center',
        border : '5 px blue'
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  }));

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

type Option = {label:string, value:number}

const timeOptions:Option[] = [{
    label : "30", value: 30,},
    {label:"45", value:45},
    {label: "60", value:60},
    {label:"90", value:90},
]

const roundOptions:Option[] = [{
    label : "2", value: 2,},
    {label:"3", value:3},
    {label: "4", value:4},
    {label:"5", value:5},
]

const Create:FC = () => {
    const [CreateSubmission, setSubmission] = useState<CreateDetails>({name:"", rounds:5, seconds:60});
    const [nameError, setNameError] = useState<null|string>(null);
    const [nsfw, setSafety] = useState<boolean>(false);
    const [serverError, setError] = useState<null|string>(null);

    const styles = useStyles();

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
            localStorage.setItem('Username', CreateSubmission.name);
            history.push(`/lobby/${data.game.id}`);
        }
    }

    const Submit = (e:any) => {
        e.preventDefault();
        console.log(CreateSubmission);
        if(CreateSubmission.name === ""){
            return setNameError("Enter Valid Name");
        }
        client.send(JSON.stringify({type:"create", payload:CreateSubmission}))
    }

    return(
        <Fragment>
            <Grid container>
                <Grid item xs={12} lg={12}>
                    <Typography variant="h4" color="secondary"> Create Game : </Typography>
                </Grid>
                <Grid item xs={12} lg={12}>
                    <div className={styles.form}>
                <TextField className={styles.formControl} onChange={(e) => {setSubmission({...CreateSubmission, name:e.target.value})}} label={"Username"} error={nameError !== null} helperText={nameError !== null? nameError : ""}/> 
                <FormControl className={styles.formControl}>
                        <InputLabel> Rounds </InputLabel>
                        { /* 
                        //@ts-ignore */}
                        <Select value={CreateSubmission.rounds} onChange={(e) => {setSubmission({...CreateSubmission, rounds:parseInt(e.target.value) })}}>
                            {roundOptions.map((option) => {
                                return <MenuItem value={option.value}> {option.label}</MenuItem>
                            })}
                        </Select>
                </FormControl>
                <FormControl className={styles.formControl}>
                    <InputLabel> Seconds </InputLabel>
                    { /* 
                        //@ts-ignore */}
                        <Select value={CreateSubmission.seconds} onChange={(e) => {setSubmission({...CreateSubmission,seconds:parseInt(e.target.value)})}}>
                        {timeOptions.map((option) => {
                            return <MenuItem value={option.value} > {option.label} </MenuItem>
                        })}
                        </Select>
                </FormControl>
                <Button onClick={Submit}color="primary" variant="contained">  Create Group </Button>
                </div>
                </Grid>
            </Grid>
            {/*Your Username 
            <input onChange={(e) => {CreateSubmission.current.name = e.target.value}}/>
            Rounds 
            <input onChange={(e) => {CreateSubmission.current.seconds = parseInt(e.target.value)}}/>
            Seconds Per Round 
            <input onChange={(e) => {CreateSubmission.current.rounds = parseInt(e.target.value)}}/>
            {error !== null ? <h1> {error}</h1>:null}
            <button onClick={Submit}> Submit </button>*/}
        </Fragment>
    )
}

export default Create;