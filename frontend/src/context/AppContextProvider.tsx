import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import React, { ReactNode, useEffect, useState } from "react";

interface Props {
    children?: ReactNode
}

interface User {
    _id: string,
    username: string
}

interface Exercise {
    name: string,
    quantity: number,
    date: Date
}

interface ExerciseLogs {
    username: string,
    count: number,
    log: Exercise[]
}

interface Context {
    userData: User,
    exerciseLog: ExerciseLogs,
    isLoading: boolean,
    exerciseTypes: Object[],
    addToExerciseLog: any
}

export const AppContext : any = React.createContext({});

export const AppContextProvider = ({ children }: Props) => {
    const [userData, setUserData] = useState<User>({_id:"0", username: "none"});
    const [exerciseLog, setExerciseLog] = useState<ExerciseLogs>({username: "none", count: 0, log: []});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const exerciseTypes = [{name: "Push ups", unit: ""}, {name: "Pull ups", unit: ""}]

    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const newUserData = await axios.get("/api/users");
                // Select the first user.
                setUserData(newUserData.data[0]);
                const newExerciseLog = await axios.get(`/api/users/${newUserData.data[0]._id}/logs?limit=5`);
                setExerciseLog(newExerciseLog.data);
            }
            catch (err: any) {
                console.log(err.error);
            }
            
            setIsLoading(false);
        }

        fetchData();
        
    }, [userData._id]);

    const addToExerciseLog = (exercise: Exercise) => setExerciseLog({username: exerciseLog.username, count: exerciseLog.count+1, 
        log: [...exerciseLog.log, {name: exercise.name, quantity: exercise.quantity, date: exercise.date}]});

    const context : Context = {
        userData,
        exerciseLog,
        isLoading,
        exerciseTypes,
        addToExerciseLog
    }

    return (
        <AppContext.Provider value={context}>
            {children}
        </AppContext.Provider>
    )
}
