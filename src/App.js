import React, { useEffect, useState } from "react";
import api from "./services/api";
import "./styles.css";

function App() {
  const [title, setTitle] = useState("");
  const [url, setURL] = useState("");
  const [techs, setTechs] = useState("");
  const [repositories, setRepositories] = useState([]);
  async function handleAddRepository() {
    const response = await api.post("repositories", {
      title,
      techs: techs.split(",").map((tech) => tech.trim()),
      url,
    });
    setRepositories([...repositories, response.data]);
    setTitle("");
    setURL("");
    setTechs([]);
  }

  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);
    const filteredRepositories = repositories.filter(
      (repository) => repository.id !== id
    );
    setRepositories(filteredRepositories);
  }
  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);
    const updatedRepository = repositories.map((repository) =>
      repository.id === id ? response.data : repository
    );
    setRepositories(updatedRepository);
  }
  useEffect(() => {
    api.get("repositories").then((response) => setRepositories(response.data));
  }, []);
  return (
    <div>
      <h1>My Portfolio</h1>
      <form>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setURL(e.target.value)}
        />
        <input
          placeholder="Techs"
          value={techs}
          onChange={(e) => setTechs(e.target.value)}
        />
        <button onClick={handleAddRepository} type="button">
          Add new Repository
        </button>
      </form>
      <br />
      <br />
      <h2>Projects:</h2>
      <ul data-testid="repository-list">
        {repositories.map((repository) => (
          <li key={repository.id}>
            <section>
              <p>{repository.title}</p>
              <aside>
                <button onClick={() => handleLikeRepository(repository.id)}>
                  Like
                </button>
                <button onClick={() => handleRemoveRepository(repository.id)}>
                  Remove
                </button>
              </aside>
            </section>
            <span>Techs: {repository.techs.join(",")}</span>
            <span>Likes: {repository.likes}</span>
            <span>
              <a href={repository.url}>Got to repository</a>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
