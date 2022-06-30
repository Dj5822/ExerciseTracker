const getUserDTO = (user: any) => {
    return {
        username: user.username,
        _id: user._id,
      }
}

export default getUserDTO;