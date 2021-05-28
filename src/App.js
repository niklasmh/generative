import "./App.css";
import * as Projects from "./projects";
import { Switch, Route, Link, useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

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
            <Link to={fromPascalCaseToKebab(project) + "/" + seed}>
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

function Project({ seed, setSeed = () => {} }) {
  const { name, seed: URLSeed } = useParams();
  const pascalCaseName = fromKebabCaseToPascal(name);

  useEffect(() => {
    if (URLSeed && parseInt(URLSeed) !== seed) {
      setSeed(parseInt(URLSeed));
    }
  }, [URLSeed]);

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
  const [seed, setSeed] = useState(-1);
  const { push } = useHistory();

  useEffect(() => {
    if (seed === -1) {
      const { pathname } = location;
      const URLSeed = parseInt(pathname.split("/")[2]);
      if (URLSeed) {
        setSeed(URLSeed);
      } else {
        const newSeed = 10000 + Math.floor(Math.random() * 90000);
        setSeed(newSeed);
        if (pathname.length > 1) {
          push("/" + pathname.split("/")[1] + "/" + newSeed);
        }
      }
    }
  }, [seed]);

  return (
    <div className="App">
      {seed === -1 ? null : (
        <div className="seed">
          <span>Seed:</span>
          <input
            value={seed}
            onChange={(e) => {
              const newSeed = parseInt(e.target.value);
              setSeed(newSeed);
              const { pathname } = location;
              if (pathname.length > 1) {
                push("/" + pathname.split("/")[1] + "/" + newSeed);
              }
            }}
            type="number"
          />
          <button
            onClick={() => {
              const newSeed = 10000 + Math.floor(Math.random() * 90000);
              setSeed(newSeed);
              const { pathname } = location;
              if (pathname.length > 1) {
                push("/" + pathname.split("/")[1] + "/" + newSeed);
              }
            }}
          >
            New seed
          </button>
        </div>
      )}
      <Switch>
        <Route exact path="/">
          <ProjectList seed={seed} />
        </Route>
        <Route path="/:name/:seed?">
          <Link to="/">Home</Link>
          {seed === -1 ? null : (
            <Project seed={seed} setSeed={(seed) => setSeed(seed)} />
          )}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
