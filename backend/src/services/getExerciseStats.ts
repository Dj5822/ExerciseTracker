import { Exercise } from "../db/schema";

export const getExerciseStats = async (id: string, dateFormat: string) => {
    const result = await Exercise.aggregate([
            {
                $match: { userId: id }
            },
            {
                $group: {
                    _id: { "date": {$dateToString: { format: dateFormat, date: "$date" }}, "exercise": "$name" },
                    total: {$sum: "$quantity"}
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    exercises: { $push: { name: "$_id.exercise", total: "$total"}}
                }
            }
        ]).sort({"_id": 1});
    
    const formattedResults: any = result.map((item: any) => {
        let output: any = {
            date: item._id
        }
    
        for (const exercise of item.exercises) {
            output[exercise.name] = exercise.total;
        }
    
        return output;
    });

    return formattedResults;
}

export const getCumulativeExerciseStats = async (id: string) => {
    return await Exercise.aggregate([
        {
          $match: { userId: id }
        },
        {
          $group: {
            _id: "$name",
            total: {$sum: "$quantity"},
            highscore: {$max: "$quantity"}
          }
        }
      ]);
}