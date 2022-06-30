const getStatsDTO = (user: any, exercises: any, statsList: any[] ) => {
    return {
        username: user.username,
        count: exercises.length,
        daily: statsList[0],
        monthly: statsList[1],
        yearly: statsList[2],
        totals: exercises.map((exercise: any) => {
          return {
            id: exercise._id,
            total: exercise.total,
            highscore: exercise.highscore
          };
        }),
      };
}

export default getStatsDTO;