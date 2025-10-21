const Home = ({token}) => {
  if (!token) {
    return null
  }

  return (
    <div>
      <h2>HOME</h2>
    </div>
  )
}

export default Home