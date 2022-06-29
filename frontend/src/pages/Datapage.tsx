import { Card, Container, Typography } from "@mui/material";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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

    return (<div style={{ display: 'flex', flexDirection: "row", width: "100%"}}>
        <Card sx={{width: "85%", height: "85vh", ml: 4, mt: 12}}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={exerciseData}
                    margin={{
                    top: 20,
                    right: 60,
                    left: 10,
                    bottom: 30,
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
            </ResponsiveContainer>
        </Card>
        <Container sx={{display: "flex", flexDirection: "column", justifyContent: "space-evenly", mt: 12, width: 300}}>
            {totals.map((exercise:any) => (
            <Card sx={{p: 2, m: 2, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Typography variant="h4">{exercise.id}</Typography>
                <Typography variant="h3">{exercise.total}</Typography>
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="h3">{exercise.highscore}</Typography>
                <Typography variant="subtitle1">Highscore</Typography>
            </Card>))} 
        </Container>
    </div>);
}

export default Datapage;