import { Card, Container } from "@mui/material";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import AveragescorePanel from "../components/AveragescorePanel";
import HighscorePanel from "../components/HighscorePanel";
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

    return (
        <ResponsiveContainer width="95%" height="95%">
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                top: 100,
                right: 0,
                left: 20,
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
        </ResponsiveContainer>
    );
}

export default Datapage;