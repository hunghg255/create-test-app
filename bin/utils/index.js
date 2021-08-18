const {
  readdirSync,
  statSync,
  mkdirSync,
  existsSync,
  readFileSync,
  writeFileSync,
} = require("fs");
const { join } = require("path");
const { spawn, spawnSync, exec } = require("child_process");
const chalk = require("chalk");
const boxen = require("boxen");

const render = (content, data) => {
  Object.keys(data).forEach(
    (key) => (content = content.replace(new RegExp(`{{${key}}}`, 'g'), data[key])),
  );
  return content;
};

const isNode = (options) => {
  return existsSync(join(options.templatePath, "package.json"));
};

const useYarn = () => {
  const child = spawnSync("which", ["yarn"]);
  return child.status === 0;
};

const useNpm = () => {
  const child = spawnSync("which", ["npm"]);
  return child.status === 0;
};

const postProcessNode = (options) => {
  process.chdir(options.tartgetPath);

  let cmd = "";
  let args = [];

  if (useYarn()) {
    cmd = "yarn";
  } else if (useNpm) {
    cmd = "npm";
    args = ["install"];
  }

  return new Promise((resolve) => {
    if (cmd) {
      console.log();
      console.log(`Installing dependencies...`);
      const child = spawn(cmd, args, { stdio: "inherit" });
      child.on("close", (code) => {
        if (code !== 0) {
          // abort this case
          console.log(chalk.red("Cannot run installation."));
          console.log(chalk.red(`Command: ${cmd} ${args.join(" ")}`));
          console.log();
          resolve();
          return;
        }
        console.log(chalk.green(`Dependencies installed successfully!`));
        console.log();
        resolve();
      });
    } else {
      console.log(chalk.red("No yarn or npm found. Cannot run installation."));
      resolve();
    }
  });
};

module.exports.argvToObject = () => {
  const argvObjects = process.argv
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => {
      const argvArray = arg.substr(2).split("=");
      const argvObject = {};
      argvObject[argvArray[0]] = argvArray[1];
      return argvObject;
    });
  return Object.assign({}, ...argvObjects);
};

module.exports.createGitRepo = () => {
  return new Promise((resolve) => {
    const cmd = 'git init && git add . && git commit -m "Init project"';
    const child = exec(cmd);
    child.on("close", (code) => {
      if (code !== 0) {
        // abort this case
        console.log(chalk.red("Cannot initialize new git repo!"));
        console.log(chalk.red(`Command: ${cmd}`));
        resolve();
        return;
      }
      console.log(chalk.green(`New git repo initialized successfully!`));
      resolve();
    });
  });
};

module.exports.showMessage = (options) => {
  const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "green",
  };

  const starting = chalk`{white.bold Move to your project:\n\n$ cd ${options.projectName}\n\n}{cyan.bold Happy Hacking 😎 From ${options.author} with 😍😍😍}`;
  console.log(boxen(starting, boxenOptions));
};

module.exports.createProject = (projectPath) => {
  if (existsSync(projectPath)) {
    console.log(
      chalk.red(`Folder ${projectPath} exists. Delete or use another name.`),
    );
    return false;
  }

  mkdirSync(projectPath);
  return true;
};

module.exports.postProcess = (options) => {
  if (isNode(options)) {
    return postProcessNode(options);
  }
};

const createDirectoryContents = (
  templatePath,
  projectName,
  author,
  currDir
) => {
  const filesToCreate = readdirSync(templatePath);

  filesToCreate.forEach((file) => {
    const origFilePath = join(templatePath, file);

    // get stats about the current file
    const stats = statSync(origFilePath);

    if (stats.isFile()) {
      let contents = readFileSync(origFilePath, "utf8");

      if (file === 'package.json') contents = render(contents, { projectName, author });

      if (file === "gitignore") file = ".gitignore";

      const writePath = join(currDir, projectName, file);
      writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      mkdirSync(join(currDir, projectName, file));

      // recursive call
      createDirectoryContents(
        join(templatePath, file),
        join(projectName, file),
        author,
        currDir
      );
    }
  });
};

module.exports.createDirectoryContents = createDirectoryContents