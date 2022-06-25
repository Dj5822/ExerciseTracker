import { Typography, Container, Card } from "@mui/material";
import { useContext } from "react";
import {AppContext} from "../context/AppContextProvider"

interface Exercise {
    name: string,
    quantity: number,
    date: Date
}

const ExerciseLog = () => {
    const { exerciseData } = useContext(AppContext);

    return (
        <Card sx={{ mt: 8, p: 2}}>
            <Typography variant="h5">Exercise Logs</Typography>
            <p>{exerciseData.username}</p>
            <p>{exerciseData.count}</p>
            {exerciseData.log.map((exercise: Exercise) => <p>{exercise.name}</p>)}               
        </Card>
    )
}

export default ExerciseLog;