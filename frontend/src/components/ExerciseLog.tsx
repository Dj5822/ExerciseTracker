import { Typography, Card } from "@mui/material";
import { useContext } from "react";
import {AppContext} from "../context/AppContextProvider"

interface Exercise {
    name: string,
    quantity: number,
    date: Date
}

const ExerciseLog = () => {
    const { exerciseLog } = useContext(AppContext);
    let count = 0;

    return (
        <Card sx={{ mt: 8, p: 2}}>
            <Typography variant="h5">Exercise Logs</Typography>
            <p>Username: {exerciseLog.username}</p>
            <p>Count: {exerciseLog.count}</p>
            <p>Records:</p>
            {exerciseLog.log.map((exercise: Exercise) => {
                count += 1
                return <div key={count}>{String(exercise.date)} - {exercise.quantity} {exercise.name}</div>
                })}               
        </Card>
    )
}

export default ExerciseLog;