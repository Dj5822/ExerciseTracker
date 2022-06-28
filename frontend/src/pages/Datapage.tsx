import { Card, Container, Typography } from "@mui/material";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useContext } from "react";
import { AppContext } from "../context/AppContextProvider";

const Datapage = () => {
    const { exerciseData } = useContext(AppContext);

    const data: any = exerciseData.daily.map((item: any) => {
        let output: any = {
            date: item._id
        }

        for (const exercise of item.exercises) {
            output[exercise.name] = exercise.total;
        }

        return output;
    });

    return (<div>
        <Container sx={{display: "flex", flexDirection: "row", mt: 12}}>
            {exerciseData.totals.map((exercise:any) => (<Card sx={{p: 2, m: 2, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Typography variant="h5">{exercise.id}</Typography>
                <Typography variant="h3">{exercise.total}</Typography>
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="h3">{exercise.highscore}</Typography>
                <Typography variant="subtitle1">Highscore</Typography>
            </Card>))}
            
        </Container>
        <LineChart
            width={1750}
            height={600}
            data={data}
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