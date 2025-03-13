import "./App.css";
import useHttpData from "./hooks/useHttpData.jsx";



function App() {
  const url = 'http://jsonplaceholder.typicode.com/users'
  const {loading, error, data: users, addData: addUser, deleteData: deleteUser, updateData: updateUser }= useHttpData(url)

  if (loading) {
    return <h2>cargando...</h2>;
  }

  if (error && !loading) {
    return <h2>Error: {error}</h2>;
  }

  return <ul> 
    <button onClick={()=> addUser({name: 'Cizarro Feliz'})} >Enviar</button>
    <button onClick={()=> updateUser({id: 2, name: 'Cambiazo Feliz'})} >Actualizar</button>
    {users.map((u)=>(
      <li key={ u.id}>{u.name} <strong> {u.email}</strong>
      <button onClick={()=> deleteUser(u.id)} >Eliminar</button>
      </li>
    ))}
  </ul>
}

export default App;
