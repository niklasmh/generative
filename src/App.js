import "./App.css";
import * as Projects from "./projects";
import { Switch, Route, Link, useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const projectsWithThumbnails = [
  "CornellBox",
  "CornellBoxFisheye",
  "CornellBoxGpu",
  "Earth",
  "GlassEffect",
  "Planet",
  "RayTracing",
  "Sdf",
  "SolarSystem",
];

function ProjectList({ seed }) {
<<<<<<< HEAD
  const isFinished = (project) => !!Projects[project].prototype.finished;
  const renderProject = (project) => {
=======
  const isNFT = (project) => !!Projects[project].prototype.nft;
  const isShowcase = (project) => !!Projects[project].prototype.finished && !isNFT(project);

  const renderProjectItem = (project) => {
>>>>>>> 087e04c... Add react helmet
    const Project = Projects[project];
    return (
      <div key={project} className="list-element">
        <Link to={fromPascalCaseToKebab(project) + "/" + seed}>
          <span className="list-element-name">{Project.prototype.name}</span>
<<<<<<< HEAD
          {projectsWithThumbnails.includes(project) ? (
            <img src={`/previews/${project}.png`} className="preview" />
          ) : (
            <Project name={Project.prototype.name} fileName={project} width={200} height={200} seed={seed} noDownload />
          )}
=======
          <Project name={Project.prototype.name} fileName={project} width={200} height={200} seed={seed} noDownload />
>>>>>>> 087e04c... Add react helmet
        </Link>
      </div>
    );
  };
<<<<<<< HEAD
=======

>>>>>>> 087e04c... Add react helmet
  return (
    <>
      <Helmet>
        <title>Generative art</title>
        <meta name="description" content="Generative art by Niklas M. Hole" />
      </Helmet>
      <h1 className="title">NFT showcase</h1>
      <div className="list">
        {Object.keys(Projects)
          .filter((project) => project !== "ProjectWrapper")
          .filter(isNFT)
          .map(renderProjectItem)}
      </div>
      <h1 className="title">Showcase</h1>
      <div className="list">
        {Object.keys(Projects)
          .filter((project) => project !== "ProjectWrapper")
<<<<<<< HEAD
          .filter(isFinished)
          .map(renderProject)}
=======
          .filter(isShowcase)
          .map(renderProjectItem)}
>>>>>>> 087e04c... Add react helmet
      </div>
      <h1 className="title">Experimental</h1>
      <div className="list">
        {Object.keys(Projects)
          .filter((project) => project !== "ProjectWrapper")
<<<<<<< HEAD
          .filter((project) => !isFinished(project))
          .map(renderProject)}
=======
          .filter((project) => !isShowcase(project) && !isNFT(project))
          .map(renderProjectItem)}
>>>>>>> 087e04c... Add react helmet
      </div>
    </>
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
  const title = Component.prototype.name || pascalCaseName;

  return (
    <div>
<<<<<<< HEAD
      <h1>{Component.prototype.name || pascalCaseName}</h1>
=======
      <Helmet>
        <title>
          {title}#{"" + seed} | Generative art
        </title>
        <meta name="description" content={`${title}#${seed} by Niklas M. Hole`} />
      </Helmet>
      <h1>{title}</h1>
>>>>>>> 087e04c... Add react helmet
      {Component.prototype.description ? <p>{Component.prototype.description}</p> : null}
      <Component seed={seed} name={Component.prototype.name} fileName={pascalCaseName} />
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
            min={0}
            max={99999}
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
          {seed === -1 ? null : <Project seed={seed} setSeed={(seed) => setSeed(seed)} />}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
