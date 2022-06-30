const getLogsDTO = (user: any, exercises: any) => {
    return {
        username: user.username,
        count: exercises.length,
        log: exercises.map((exercise: any) => {
          return {
            name: exercise.name,
            quantity: exercise.quantity,
            date: exercise.date.toDateString(),
          };
        }),
      };
}

export default getLogsDTO;