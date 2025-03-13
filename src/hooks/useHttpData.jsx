import { useState, useEffect } from "react";

export default function useHttpData(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Efecto para obtener datos con cancelación de petición
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(url, { signal });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const result = await response.json();
        setData(result);
        setError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => controller.abort();
  }, []);

  // Función para agregar datos con POST
  async function addData(el) {
    const initialData = [...data];
    setData([{ id: 0, ...el }, ...data]);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(el),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setData(initialData); // Revertimos en caso de error
        throw new Error(`Error ${response.status}`);
      }

      const savedData = await response.json();
      setData([savedData, ...initialData]);
    } catch (error) {
      setError(error.message);
    }
  }

  const deleteData = async (id) => {
    const initialData = [...data];
    setData(data.filter((x) => x.id !== id));
    try {
      const response = await fetch(`${url}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        setData(initialData); // Revertimos en caso de error
        throw new Error(`Error ${response.status}`);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  async function updateData(updateEl) {
    const initialData = [...data];
  
    // Actualizar visualmente
    setData(data.map((x) => (x.id === updateEl.id ? updateEl : x)));
  
    try {
      const response = await fetch(`${url}/${updateEl.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateEl),
      });
  
      if (!response.ok) {
        setData(initialData); // Revertimos en caso de error
        throw new Error(`Error ${response.status}`);
      }
  
      const updatedItem = await response.json();
      setData(data.map((x) => (x.id === updatedItem.id ? updatedItem : x)));
    } catch (error) {
      setError(error.message);
      setData(initialData); // Revertimos en caso de error
    }
  }
  

  return { data, loading, error, addData, deleteData, updateData };
}

/* SIN ASYNC Y AWAIT
  useEffect(() => {
    const url = "http://jsonplaceholder.typicode.com/users";
    setLoading(true);
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status}`);
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []); 
  
  
  
    // ASYNC Y AWAIT en useEffect, se usa una function, no se hace directamente
  useEffect(() => {  
    async function hook() {
      const url = "http://jsonplaceholder.typicode.com/users";
      setLoading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`${response.status}`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    hook();
  }, []);


   // Abortando UNA PETICION
  useEffect(() => {
    const controller = new AbortController(); 
    const { signal } = controller;
    async function hook() {
      const url = "http://jsonplaceholder.typicode.com/users";
      setLoading(true);
      try {
        const response = await fetch(url,{signal} ); // con esto podemos hacer que fetch use otros metodos GET, POST, PUT, CABECERAS HEAD, etc
        if (!response.ok) throw new Error(`${response.status}`);
        const data = await response.json();
        setUsers(data);

        setError(undefined); // esto hace que funcione igual

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    hook();

    return () => controller.abort();
  }, []);
  */
