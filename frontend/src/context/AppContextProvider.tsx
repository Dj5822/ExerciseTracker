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
    exerciseData: ExerciseLogs,
    isLoading: boolean,
    exerciseTypes: Object[]
}

export const AppContext : any = React.createContext({});

export const AppContextProvider = ({ children }: Props) => {
    const [userData, setUserData] = useState<User>({_id:"0", username: "none"});
    const [exerciseData, setExerciseData] = useState<ExerciseLogs>({username: "none", count: 0, log: []});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const exerciseTypes = [{name: "Push ups", unit: ""}, {name: "Pull ups", unit: ""}]

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const newUserData = await axios.get("/api/users");
            // Select the first user.
            setUserData(newUserData.data[0]);
            const newExerciseData = await axios.get(`/api/users/${userData._id}/logs`);
            setExerciseData(newExerciseData.data);
            setIsLoading(false);
        }

        fetchData();
        
    }, [userData._id]);

    const context : Context = {
        userData,
        exerciseData,
        isLoading,
        exerciseTypes
    }

    return (
        <AppContext.Provider value={context}>
            {children}
        </AppContext.Provider>
    )
}
