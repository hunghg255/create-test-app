#!/usr/bin/env node
const { prompt } = require("inquirer")
const {
  readdirSync,
  statSync,
  mkdirSync,
  existsSync,
  readFileSync,
  writeFileSync,
} = require("fs")
const { join } = require("path")
const { spawn, spawnSync } = require("child_process")
const { render } = require("./utils/template")
const { argv } = require("yargs")
const chalk = require("chalk")
const boxen = require("boxen")

const CURR_DIR = process.cwd()
const CHOICES = readdirSync(join(__dirname, "templates"))
const QUESTIONS = [
  {
    name: "template",
    type: "list",
    message: "What project template would you like to generate?",
    choices: CHOICES,
    when: () => !argv["template"],
  },
  {
    name: "name",
    type: "input",
    message: "Project name:",
    when: () => !argv["name"],
    validate: (input) => {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true
      else
        return "Project name may only include letters, numbers, underscores and hashes."
    },
  },
]

const runCommand = (command, args) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" })
    child.on("close", (code) => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(" ")}`,
        })
        return
      }
      resolve()
    })
  })
}

const createGitRepo = async () => {
  try {
    await runCommand("git", ["init"])
    await runCommand("git", ["add", "."])
    await runCommand("git", ["commit", "-m", '"Init project"'])
    console.log(chalk.green(`New git repo initialized successfully!`))
  } catch (error) {
    console.log(error)
  }
}

const showMessage = (options) => {
  const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "green",
  }

  const starting = chalk.white.bold(
    `Move to project directory:\n\n$ cd ${options.projectName}\n\nFollow this document to start: ${options.homepage}`,
  )
  console.log(boxen(starting, boxenOptions))
  console.log(chalk.cyan.bold(`Happy Hacking! From ${options.author} with ❤️`))
  console.log()
}

const createProject = (projectPath) => {
  if (existsSync(projectPath)) {
    console.log(
      chalk.red(`Folder ${projectPath} exists. Delete or use another name.`),
    )
    return false
  }

  mkdirSync(projectPath)
  return true
}

const isNode = (options) => {
  return existsSync(join(options.templatePath, "package.json"))
}

const useYarn = () => {
  const child = spawnSync("which", ["yarn"])
  return child.status === 0
}

const useNpm = () => {
  const child = spawnSync("which", ["npm"])
  return child.status === 0
}

const postProcess = (options) => {
  if (isNode(options)) {
    return postProcessNode(options)
  }
  return true
}

const postProcessNode = async (options) => {
  process.chdir(options.tartgetPath)

  let cmd = ""
  let args = []

  if (useYarn()) {
    cmd = "yarn"
  } else if (useNpm) {
    cmd = "npm"
    args = ["i", "--save", "--no-audit", "--save-exac", "--loglevel", "error"]
  }

  if (cmd) {
    try {
      console.log()
      console.log(`Installing dependencies...`)
      await runCommand(cmd, args)
      console.log(chalk.green(`Dependencies installed successfully!`))
      console.log()
    } catch (error) {
      console.log(error)
      return false
    }
  } else {
    console.log(chalk.red("No yarn or npm found. Cannot run installation."))
  }

  return true
}

const createDirectoryContents = (templatePath, projectName) => {
  const filesToCreate = readdirSync(templatePath)

  filesToCreate.forEach((file) => {
    const origFilePath = join(templatePath, file)

    // get stats about the current file
    const stats = statSync(origFilePath)

    if (stats.isFile()) {
      let contents = readFileSync(origFilePath, "utf8")

      contents = render(contents, { projectName })

      if (file === 'gitignore') file = '.gitignore';

      const writePath = join(CURR_DIR, projectName, file)
      writeFileSync(writePath, contents, "utf8")
    } else if (stats.isDirectory()) {
      mkdirSync(join(CURR_DIR, projectName, file))

      // recursive call
      createDirectoryContents(
        join(templatePath, file),
        join(projectName, file),
      )
    }
  })
}

prompt(QUESTIONS).then(async (answers) => {
  answers = Object.assign({}, answers, argv)

  const projectChoice = answers["template"]
  const projectName = answers["name"]
  const templatePath = join(__dirname, "templates", projectChoice)
  const tartgetPath = join(CURR_DIR, projectName)
  const author = "Hieu Nguyen"
  const homepage = "https://github.com/hieubeo0/create-test-app/blob/master/README.md"

  const options = {
    projectName,
    templateName: projectChoice,
    templatePath,
    tartgetPath,
    author,
    homepage
  }

  if (!createProject(tartgetPath)) {
    return
  }

  createDirectoryContents(templatePath, projectName)

  if (!(await postProcess(options))) {
    return
  }

  await createGitRepo()

  showMessage(options)
})
