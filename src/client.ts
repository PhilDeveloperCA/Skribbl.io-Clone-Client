import axios from 'axios';
import {w3cwebsocket} from 'websocket';

export const client = new w3cwebsocket("ws://192.168.1.122:9090");

export const apiClient = axios.create({
    baseURL : `http://192.168.1.122:9090/api`,
});

//export const apiClient = new axios.instance(`http:192.168.1.122:9000/api/`);