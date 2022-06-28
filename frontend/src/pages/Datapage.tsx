import { Card, Container, Typography } from "@mui/material";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContextProvider";
import axios from "axios";

const Datapage = () => {
    const {userData} = useContext(AppContext);
    const [exerciseData, setExerciseData] = useState([]);
    const [totals, setTotals] = useState([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const newExerciseData: any = await axios.get(`/api/users/${userData._id}/stats`);
            const data: any = newExerciseData.data.daily.map((item: any) => {
                let output: any = {
                    date: item._id
                }
        
                for (const exercise of item.exercises) {
                    output[exercise.name] = exercise.total;
                }
        
                return output;
            });
            setExerciseData(data);
            setTotals(newExerciseData.data.totals);
            setIsLoading(false);
        }

        fetchData();        
    }, [userData._id]);

    return (<div>
        <Container sx={{display: "flex", flexDirection: "row", mt: 12}}>
            {totals.map((exercise:any) => (<Card sx={{p: 2, m: 2, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Typography variant="h5">{exercise.id}</Typography>
                <Typography variant="h3">{exercise.total}</Typography>
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="h3">{exercise.highscore}</Typography>
                <Typography variant="subtitle1">Highscore</Typography>
            </Card>))}
            
        </Container>
        <LineChart
            width={1600}
            height={600}
            data={exerciseData}
            margin={{
            top: 100,
            right: 0,
            left: 0,
            bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line connectNulls type="monotone" dataKey="Push ups" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line connectNulls type="monotone" dataKey="Pull ups" stroke="#82ca9d" />
        </LineChart>
    </div>);
}

export default Datapage;