import './App.css';
import {useEffect, useState} from "react";
import { EventSourcePolyfill } from 'event-source-polyfill';
import axios from "axios";


const BASE_URL = "http://54.180.50.177:8082/api"

function App() {
    const [count, setCount] = useState(null);
    const [status, setStatus] = useState('CLOSED');
    const [educationId, setEducationId] = useState(null);
    const [educationNumber, setEducationNumber] = useState(null);

    const handleConnect = () =>{
        const sse = new EventSourcePolyfill(`${BASE_URL}/events/education`);

        sse.addEventListener('education', (e) => {
            const { data: receivedConnectData } = e;

            console.log('connect event data: ', receivedConnectData);
        });

        sse.addEventListener('EducationOpen', e => {

            const { data: receivedEducationOpenData } = e;

            console.log('교육 시작 이벤트 발생');
            console.log(e);
            console.log(JSON.parse(receivedEducationOpenData));
            
            // setData(JSON.parse(receivedEducationOpenData));
            console.log("test event data", receivedEducationOpenData);
            // setCount(receivedEducationOpenData);
            setStatus(JSON.parse(receivedEducationOpenData).status);
            setEducationId(JSON.parse(receivedEducationOpenData).educationId);
            setEducationNumber(JSON.parse(receivedEducationOpenData).educationNumber);
            setCount(JSON.parse(receivedEducationOpenData).participants);
        })
    }

    const startEducation = async () => {

        await axios.patch(`${BASE_URL}/educations/open`,
            { educationId: 2 },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        .then(function (response) {
            console.log('Education Start', response);
            console.log(response.participants);
        })
        .catch(function (error) {
            console.log('error', error);
        });
    }


  return (
    <div className="App">
        <button onClick={handleConnect}>이벤트 구독 요청</button>
        <div>교육 상태: {status} </div>
        {/* <button onClick={startEducation}>교육 시작</button> */}
        <div>
            진행중인 교육 id: {educationId} <br></br> 교육 번호: {educationNumber}
        </div>
        <button onClick={startEducation}>교육 참가 요청</button>
        <div>{count}</div>
    </div>
  );
}

export default App;
