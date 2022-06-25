import { Typography, Container } from "@mui/material";
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
        <Container>
            <Typography variant="h5">Exercise Logs</Typography>
            <p>{exerciseData.username}</p>
            <p>{exerciseData.count}</p>
            {exerciseData.log.map((exercise: Exercise) => <p>{exercise.name}</p>)}    
        </Container>
    )
}

export default ExerciseLog;