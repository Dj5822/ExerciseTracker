const getExerciseDTO = (user: any, exercise: any) => {
    return {
        _id: user._id,
        userId: user.username,
        date: exercise.date.toDateString(),
        quantity: exercise.quantity,
        name: exercise.name,
      }
}

export default getExerciseDTO;