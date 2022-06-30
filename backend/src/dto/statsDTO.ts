const getStatsDTO = (user: any, statsList: any[] ) => {
    return {
        username: user.username,
        daily: statsList[0],
        monthly: statsList[1],
        yearly: statsList[2],
        totals: statsList[3].map((exercise: any) => {
          return {
            id: exercise._id,
            total: exercise.total,
            highscore: exercise.highscore
          };
        }),
      };
}

export default getStatsDTO;