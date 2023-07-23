import React, { useEffect, useState } from "react";
import styles from "./card.module.scss";
import axios from "axios";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Card = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const username = window.location.href.split("/").pop();

    try {
      axios
        .get(`https://api.github.com/users/${username}`)

        .then((response) => {
          setUser(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleExport = () => {
    const idInt = +user.id;
    try {
      axios
        .post("http://localhost:4000/user", {
          login: user.login,
          id: idInt,
          avatar_url: user.avatar_url,
        })
        .then(alert("Información guardada"));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>{user.login}</h2>
      <h3>{`ID: ${user.id}`}</h3>
      <img src={user.avatar_url} alt="avatar" className={styles.img} />
      <Button variant="contained" onClick={handleExport}>
        Exportar
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          navigate("/");
        }}
      >
        Regresar
      </Button>
    </div>
  );
};

export default Card;
