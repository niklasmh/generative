import "./App.css";
import * as Projects from "./projects";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { useState } from "react";

function ProjectList({ seed }) {
  return (
    <div style={{ display: "flex", flexFlow: "row wrap" }}>
      {Object.keys(Projects).map((project) => {
        const Project = Projects[project];
        return (
          <div
            key={project}
            style={{
              margin: 16,
              width: 190,
            }}
          >
            <Link to={fromPascalCaseToKebab(project)}>
              <h3>{Project.prototype.name}</h3>
              <Project width={100} height={100} seed={seed} noDownload />
            </Link>
          </div>
        );
      })}
    </div>
  );
}

function fromPascalCaseToKebab(pascalCase) {
  return pascalCase
    .replace(/([A-Z])/g, "-$1")
    .replace(/^-/, "")
    .toLowerCase();
}

function fromKebabCaseToPascal(kebabCase) {
  return kebabCase
    .replace(/(-[a-z])/gi, (match) => match.slice(1).toUpperCase())
    .replace(/^[a-z]/i, (match) => match.toUpperCase());
}

function Project({ seed }) {
  const { name } = useParams();
  const pascalCaseName = fromKebabCaseToPascal(name);

  if (!(pascalCaseName in Projects)) {
    return <div>Could not find project</div>;
  }

  const Component = Projects[pascalCaseName];

  return (
    <div>
      <h1>{Component.prototype.name || pascalCaseName}</h1>
      {Component.prototype.description ? (
        <p>{Component.prototype.description}</p>
      ) : null}
      <Component seed={seed} />
    </div>
  );
}

function App() {
  const [seed, setSeed] = useState(Math.floor(Math.random() * 100000));

  return (
    <div className="App">
      <div className="seed">
        <span>Seed:</span>
        <input
          value={seed}
          onChange={(e) => setSeed(parseInt(e.target.value))}
          type="number"
        />
      </div>
      <Router>
        <Switch>
          <Route exact path="/">
            <ProjectList seed={seed} />
          </Route>
          <Route path="/:name">
            <Link to="/">Home</Link>
            <Project seed={seed} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
