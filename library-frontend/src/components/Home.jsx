const Home = ({token}) => {
  if (!token) {
    return null
  }

  console.log('TOKEN EXISTS:', token)

  return (
    <div>
      <h2>HOME</h2>
    </div>
  )
}

export default Home