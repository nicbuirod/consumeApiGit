import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "./search.module.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [followers, setFollowers] = useState([]);

  const navigate = useNavigate();

  const handleGetAll = async () => {
    try {
      await axios
        .get("https://api.github.com/users?per_page=10")
        .then((response) => {
          setUsers(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    if (name.length < 4) {
      alert("Debe introducir minimo 4 caracteres");
    } else if (name === "doublevpartners") {
      alert("este usuario no puede ser buscado, prueba con otro nombre");
    } else {
      try {
        await axios
          .get(`https://api.github.com/search/users?q=${name}&&per_page=10`)

          .then((response) => {
            setUsers(response.data.items);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchFollowers = async () => {
      const userFollowers = [];

      try {
        const followersData = await Promise.all(
          users.map(async (e) => {
            const response = await axios.get(e.followers_url);

            return {
              name: e.login,
              value: response.data.length,
            };
          })
        );

        followersData.forEach((followerData) => {
          userFollowers.push(followerData);
        });

        setFollowers(userFollowers);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFollowers();
  }, [users]);

  const handleNavigate = async (login) => {
    navigate(`/user/${login}`);
  };

  const handleSearchSave = () => {
    try {
      axios.get("http://localhost:4000/user").then((response) => {
        setUsers(response.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.container_buttons}>
        <Button
          variant="contained"
          onClick={handleGetAll}
          className={styles.button}
        >
          Primeros 10
        </Button>
        <TextField
          id="outlined-basic"
          label="Nombre"
          variant="outlined"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={styles.button}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          className={styles.button}
        >
          buscar por nombre
        </Button>

        <Button
          variant="contained"
          onClick={handleSearchSave}
          className={styles.button}
        >
          Ver usuarios guardados
        </Button>
      </div>
      <div className={styles.title}>Resultados</div>
      <div className={styles.results}>
        <tr>
          <th>Usuario</th>
          <th>Id</th>
          <th>Foto</th>
        </tr>
        {users.map(({ login, id, avatar_url }, index) => {
          return (
            <tr
              key={index}
              onClick={() => {
                handleNavigate(login);
              }}
            >
              <td>{login}</td>
              <td>{id}</td>
              <td>
                <img src={avatar_url} alt="face" className={styles.img} />
              </td>
            </tr>
          );
        })}
      </div>
      <div className={styles.title}>Grafica</div>
      <>
        <BarChart width={900} height={300} data={followers}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </>
    </div>
  );
};

export default Search;
